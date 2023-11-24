import os, multiprocessing as mp, signal, time
from video_processor import VideoProcessor
from process_tracker import ProcessTrackerObject, ProcessTracker
from quart import Quart, request, jsonify, utils
from env import input_path, out_path

app = Quart(__name__)
vp = VideoProcessor()
tracker = ProcessTracker()
is_stateless = False
try:
    is_stateless = True if str(os.environ["PRIVACYPAL_IS_STATELESS"]) == "true" else False # if env variable not defined, will raise KeyError
except:pass

def start_process(file: str, final: str):
    """
    Expects `file` to be the name of the file, such as '23-yeehaw-1698360721.mp4'. Synchronously runs video processing and returns
    """
    vp.process(f"{input_path}/{file}", final)
    print(f"Done processing {file}.")
    return "Video finished processing.", 200    # indicate processing is completed

@app.route("/process_video", methods=["POST"])
async def handle_request():
    file = (await request.data).decode()    # expects the filename, in the form <uid>-<file name>-<epoch time> such as "23-yeehaw-1698360721.mp4"
    if os.path.isfile(f"{input_path}/{file}"):    # check if the file exists
        final = f"{out_path}/{file[:-4]}-processed{file[-4:]}"
        if not app.testing: # if we're running Flask unit tests, don't run the video processing method
            if not is_stateless:    # start process and send response immediately
                process = mp.Process(target=vp.process, args=(f"{input_path}/{file}", final))  # define a new process pointing to VideoProcessor.process()
                tracker.add(file, ProcessTrackerObject(process))
                process.start() # start the process on another thread
                print(f"Process started on {file}")
                return "Success, file exists.", 202         # indicate processing has started
            else:   # redundant else but makes the code cleaner to read
                print(f"Process started on {file}")
                response = await utils.run_sync(start_process)(file, final)
                return response
        return "Success, file exists.", 202
    else:
        return "Error: file not found", 404

@app.route("/process_status", methods=["GET"])
async def return_status():
    if not is_stateless:  # only enable this route if we're running in stateless mode
        process = tracker.get_process(request.args["filename"])
        if process == None:
            return "Process does not exist", 404  # shouldn't ever happen, but just in case
        
        if process.process_is_alive():
            return "false", 200 # return false to the request for "is the video finished processing"
        else:
            return "true", 200  # return true
    else:
        print("Not running in stateless mode, returning 501")
        return "", 501

@app.route("/health", methods=["GET"])
async def return_health():
    return jsonify({}), 200

@app.before_serving
async def lifespan():
    prune: mp.Process = mp.Process(target=tracker.main)
    prune.start()
    old_int_handler = signal.getsignal(signal.SIGINT)
    old_term_handler = signal.getsignal(signal.SIGTERM)
    
    def process_cleanup(_signal, _stack):
        tracker.terminate_processes()
        prune.kill()
        while prune.is_alive() or tracker.is_any_alive():
            print("Waiting on process to be terminate")
            time.sleep(3)
        print("All sub-processes terminated")
        if (_signal == signal.SIGTERM):
            old_term_handler(_signal, _stack)
        elif (_signal == signal.SIGINT):
            old_int_handler(_signal, _stack)
        
    signal.signal(signal.SIGINT, process_cleanup)
    signal.signal(signal.SIGTERM, process_cleanup)
