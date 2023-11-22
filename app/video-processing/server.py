import os, multiprocessing as mp
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
                if not tracker.is_running:  # if the pruning background process isn't running, run it
                    mp.Process(target=tracker.main).start()
                process.start() # start the process on another thread
                print(f"Process started on {file}")
                return "Success, file exists.", 202         # indicate processing has started
            else:   # redundant else but makes the code cleaner to read
                response = await utils.run_sync(start_process)(file, final)
                return response
        return "Success, file exists.", 202
    else:
        return "Error: file not found", 404

@app.route("/process_status", methods=["GET"])
async def return_status():
    if not is_stateless:  # only enable this route if we're running in stateless mode
        file = request.query_string.decode().split("=")[1]  # query string should be something like 'filename=the_name_of_the_file.mp4'
        process = tracker.get_process(file)
        if process == None:
            return "Invalid filename", 400  # shouldn't ever happen, but just in case
        
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
