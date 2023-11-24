import os
import multiprocessing as mp
import signal
import time
from video_processor import VideoProcessor
from process_tracker import ProcessTrackerObject, ProcessTracker
from quart import Quart, request, jsonify, utils

app = Quart(__name__)


def start_process(file_path: str, final: str):
    """
    Expects `file` to be the name of the file, such as '23-yeehaw-1698360721.mp4'. Synchronously runs video processing and returns
    """
    vp: VideoProcessor = app.config["PROCESSOR"]
    vp.process(f"{file_path}", final)
    print(f"Done processing {os.path.basename(file_path)}.")
    return "Video finished processing.", 200    # indicate processing is completed


@app.route("/process_video", methods=["POST"])
async def handle_request():
    file = (await request.data).decode()    # expects the filename, in the form <uid>-<file name>-<epoch time> such as "23-yeehaw-1698360721.mp4"
    input_path = app.config["INPUT_DIR"]
    output_path = app.config["OUTPUT_DIR"]

    file_path = f"{input_path}/{file}"
    if os.path.isfile(file_path):    # check if the file exists
        dest_path = f"{output_path}/{file[:-4]}-processed{file[-4:]}"
        if not app.testing:  # if we're running Flask unit tests, don't run the video processing method
            if not app.config["IS_STATELESS"]:    # start process and send response immediately
                tracker: ProcessTracker = app.config["TRACKER"]
                process = mp.Process(target=start_process, args=(file_path, dest_path))  # define a new process pointing to VideoProcessor.process()
                tracker.add(file, ProcessTrackerObject(process))
                process.start()  # start the process on another thread
                print(f"Process started on {file}")
                return "Success, file exists.", 202         # indicate processing has started
            else:   # redundant else but makes the code cleaner to read
                print(f"Process started on {file}")
                response = await utils.run_sync(start_process)(file, dest_path)
                return response
        return "Success, file exists.", 202
    else:
        return "Error: file not found", 404


@app.route("/process_status", methods=["GET"])
async def return_status():
    if not app.config["IS_STATELESS"]:  # only enable this route if we're running in stateless mode
        tracker: ProcessTracker = app.config["TRACKER"]
        process = tracker.get_process(request.args["filename"])
        if process is None:
            return "Process does not exist", 404  # shouldn't ever happen, but just in case

        if process.is_alive():
            return "false", 200  # return false to the request for "is the video finished processing"
        else:
            return "true", 200   # return true
    else:
        print("Not running in stateless mode, returning 501")
        return "", 501


@app.route("/health", methods=["GET"])
async def return_health():
    return jsonify({}), 200


@app.before_serving
async def before():
    # Initiate process tracker
    app.config["TRACKER"] = ProcessTracker.get_instance()
    app.config["PROCESSOR"] = VideoProcessor.get_instance()
    app.config["CLEANUP_DELAY"] = 3  # 3s delay
    app.config["OUTPUT_DIR"] = os.environ.get("PRIVACYPAL_OUTPUT_VIDEO_DIR")
    app.config["INPUT_DIR"] = os.environ.get("PRIVACYPAL_INPUT_VIDEO_DIR")
    app.config["IS_STATELESS"] = str(os.environ.get("PRIVACYPAL_IS_STATELESS", "true")).lower() == "true"

    tracker: ProcessTracker = app.config["TRACKER"]

    # Launch periodic prune subprocess
    prune: mp.Process = mp.Process(target=tracker.main)
    prune.start()

    # Overwrite SIGINT and SIGTERM handler to terminate subprocesses
    old_handlers = {
        signal.SIGINT: signal.getsignal(signal.SIGINT),
        signal.SIGTERM: signal.getsignal(signal.SIGTERM)
    }

    def process_cleanup(_signal, _stack):
        # Terminate all video processing processes
        tracker.terminate_processes()
        # Kill prune process
        prune.kill()

        # Ensure all subprocesses are terminated/killed
        while prune.is_alive() or tracker.is_any_alive():
            print(f"Sub-processes are still running. Retry in {app.config['CLEANUP_DELAY']}s.")
            time.sleep(app.config["CLEANUP_DELAY"])
        print("All subprocesses are terminated.")

        # Call other handlers
        try:
            old_handler = old_handlers(_signal)
            old_handler()
        except Exception:
            pass

    signal.signal(signal.SIGINT, process_cleanup)
    signal.signal(signal.SIGTERM, process_cleanup)
