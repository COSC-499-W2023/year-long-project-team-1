import os
import multiprocessing as mp
import signal
import time
from video_processor import VideoProcessor
from process_tracker import ProcessTrackerObject, ProcessTracker
from quart import Quart, request, jsonify, utils
from utils import get_env

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
    if not os.path.isfile(file_path):    # check if the file exists
        return "Error: file not found", 404

    dest_path = f"{output_path}/{file[:-4]}-processed{file[-4:]}"
    if not app.config["IS_STATELESS"]:    # start process and send response immediately
        process = mp.Process(target=start_process, args=(file_path, dest_path), daemon=True)
        tracker: ProcessTracker = app.config["TRACKER"]
        tracker.add(file, ProcessTrackerObject(process))
        process.start()  # start the process on another thread
        print(f"Process started on {file}")
        return "Success: file exists.", 202         # indicate processing has started
    else:
        print(f"Process started on {file}")
        response = await utils.run_sync(start_process)(file, dest_path)
        return response


@app.route("/process_status", methods=["GET"])
async def return_status():
    if not app.config["IS_STATELESS"]:  # only enable this route if we're running in stateless mode
        tracker: ProcessTracker = app.config["TRACKER"]
        process = tracker.get_process(request.args["filename"])
        if process is None:
            return "Process does not exist", 404  # shouldn't ever happen, but just in case
        if process.process_is_alive():
            return "false", 200     # return false to the request for "is the video finished processing"
        else:
            return "true", 200      # return true
    else:
        print("Not running in stateless mode, returning 501")
        return "", 501


@app.route("/cancel_process", methods=["POST"])
async def cancel_process():
    if not app.config["IS_STATELESS"]:
        file = (await request.data).decode()    # get filename from request

        # terminate the process
        process: ProcessTrackerObject = app.config["TRACKER"].get_process(file)
        if process is None:     # process doesn't exist/isn't running/has been pruned
            return "Process does not exist in the current runtime", 404

        process.terminate_process()

        # cleanup files that may or may not exist as a result of cancelling a video processing operation
        for f in [f"{app.config['INPUT_DIR']}/{file}",
                  f"{app.config['OUTPUT_DIR']}/{file[:-4]}-processed{file[-4:]}",
                  f"{app.config['OUTPUT_DIR']}/{file[:-4]}-processed-temp{file[-4:]}"]:
            if os.path.isfile(f):
                os.remove(f)

        return "Success", 200
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
    app.config["INPUT_DIR"] = get_env("PRIVACYPAL_INPUT_VIDEO_DIR", "/opt/privacypal/input_videos")
    app.config["OUTPUT_DIR"] = get_env("PRIVACYPAL_OUTPUT_VIDEO_DIR", "/opt/privacypal/output_videos")
    app.config["IS_STATELESS"] = get_env("PRIVACYPAL_IS_STATELESS", "true").lower() == "true"
    app.config["ENVIRONMENT"] = get_env("ENVIRONMENT", "production")

    tracker: ProcessTracker = app.config["TRACKER"]

    # Launch periodic prune subprocess
    prune: mp.Process = mp.Process(target=tracker.main, daemon=True)
    prune.start()

    # Overwrite SIGINT and SIGTERM handler to terminate subprocesses
    old_handlers = {
        signal.SIGINT: signal.getsignal(signal.SIGINT),
        signal.SIGTERM: signal.getsignal(signal.SIGTERM)
    }

    def process_cleanup(_signal, _stack):
        # FIXME: Workaround pytest pid issues
        if app.config["ENVIRONMENT"] == "testing" or mp.current_process().name == "MainProcess":  # Only on main process
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
            old_handler = old_handlers[_signal]
            if callable(old_handler):
                old_handler(_signal, _stack)
        except Exception:
            pass

    signal.signal(signal.SIGINT, process_cleanup)
    signal.signal(signal.SIGTERM, process_cleanup)
