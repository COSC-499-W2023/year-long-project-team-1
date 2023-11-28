import os
import multiprocessing as mp
from video_processor import VideoProcessor
from process_tracker import ProcessTrackerObject, ProcessTracker
from quart import Quart, request, jsonify, utils
from utils import get_env
import logging
import signal

app = Quart(__name__)
LOGGER = app.logger
LOGGER.setLevel(logging.INFO)


def start_process(file_path: str, final: str):
    """
    Expects `file` to be the name of the file, such as '23-yeehaw-1698360721.mp4'. Synchronously runs video processing and returns
    """
    signal.signal(signal.SIGTERM, signal.SIG_DFL)
    signal.signal(signal.SIGINT, signal.SIG_DFL)
    vp: VideoProcessor = app.config["PROCESSOR"]
    vp.process(f"{file_path}", final)
    LOGGER.info(f"Done processing {os.path.basename(file_path)}.")
    return "Video finished processing.", 200    # indicate processing is completed


@app.route("/process_video", methods=["POST"])
async def handle_request():
    file = (await request.data).decode()    # expects the filename, in the form <uid>-<file name>-<epoch time> such as "23-yeehaw-1698360721.mp4"
    input_path = app.config["INPUT_DIR"]
    output_path = app.config["OUTPUT_DIR"]

    file_path = f"{input_path}/{file}"
    if not os.path.isfile(file_path):    # check if the file exists
        LOGGER.warning(f"Invalid video path: {file_path}.")
        return "Error: file not found", 404

    dest_path = f"{output_path}/{file[:-4]}-processed{file[-4:]}"
    if not app.config["IS_STATELESS"]:    # start process and send response immediately
        process = mp.Process(target=start_process, args=(file_path, dest_path))
        tracker: ProcessTracker = app.config["TRACKER"]
        tracker.add(file, ProcessTrackerObject(process))
        process.start()  # start the process on another thread
        LOGGER.info(f"Processing started on {file}")
        return "Success: file exists.", 202         # indicate processing has started
    else:
        LOGGER.info(f"Process started on {file}")
        response = await utils.run_sync(start_process)(file, dest_path)
        return response


@app.route("/process_status", methods=["GET"])
async def return_status():
    if not app.config["IS_STATELESS"]:  # only enable this route if we're running in stateless mode
        tracker: ProcessTracker = app.config["TRACKER"]
        process = tracker.get_process(request.args["filename"])
        if process is None:
            return "Process does not exist", 404  # shouldn't ever happen, but just in case
        return f"{not process.is_alive()}", 200
    else:
        LOGGER.warning("Not running in stateless mode, returning 501")
        return "", 501


@app.route("/cancel_process", methods=["POST"])
async def cancel_process():
    if not app.config["IS_STATELESS"]:
        file = (await request.data).decode()    # get filename from request

        # terminate the process
        tracker: ProcessTracker = app.config["TRACKER"]
        process: ProcessTrackerObject = tracker.get_process(file)
        if process is None:     # process doesn't exist/isn't running/has been pruned
            return "Process does not exist in the current runtime", 404

        process.terminate()

        # cleanup files that may or may not exist as a result of cancelling a video processing operation
        for f in [f"{app.config['OUTPUT_DIR']}/{file[:-4]}-processed{file[-4:]}",
                  f"{app.config['OUTPUT_DIR']}/{file[:-4]}-processed-temp{file[-4:]}"]:
            if os.path.isfile(f):
                os.remove(f)

        return "Success", 200
    else:
        LOGGER.warning("Not running in stateless mode, returning 501")
        return "", 501


@app.route("/health", methods=["GET"])
async def return_health():
    return jsonify({}), 200


@app.before_serving
async def before_all():
    # Initiate process tracker
    app.config["TRACKER"] = ProcessTracker.get_instance(LOGGER)
    app.config["PROCESSOR"] = VideoProcessor.get_instance()
    app.config["INPUT_DIR"] = get_env("PRIVACYPAL_INPUT_VIDEO_DIR", "/opt/privacypal/input_videos")
    app.config["OUTPUT_DIR"] = get_env("PRIVACYPAL_OUTPUT_VIDEO_DIR", "/opt/privacypal/output_videos")
    app.config["IS_STATELESS"] = get_env("PRIVACYPAL_IS_STATELESS", "true").lower() == "true"
    app.config["ENVIRONMENT"] = get_env("ENVIRONMENT", "production")

    tracker: ProcessTracker = app.config["TRACKER"]

    # Launch periodic prune subprocess
    prune: mp.Process = mp.Process(target=tracker.main)
    app.config["PRUNE_PROCESS"] = prune
    prune.start()


@app.after_serving
async def after_all():
    prune: mp.Process = app.config["PRUNE_PROCESS"]
    prune.terminate()

    tracker: ProcessTracker = app.config["TRACKER"]
    tracker.terminate_processes()
