import os, multiprocessing as mp
from video_processor import VideoProcessor
from quart import Quart, request, jsonify
from env import input_path, out_path

app = Quart(__name__)
vp = VideoProcessor()
processes = {}  # key:value is of the form str:mp.Process
is_stateless = False
try:
    is_stateless = True if str(os.environ["VIDPROC_IS_STATELESS"]) == "true" else False # if env variable not defined, will raise KeyError
except:pass

@app.route("/process_video", methods=["POST"])
async def handle_request():
    if request.method == "POST":
        file = (await request.data).decode()    # expects the filename, in the form <uid>-<file name>-<epoch time> such as "23-yeehaw-1698360721.mp4"
        if os.path.isfile(f"{input_path}/{file}"):    # check if the file exists
            final = f"{out_path}/{file[:-4]}-processed{file[-4:]}"
            if not app.testing: # if we're running Flask unit tests, don't run the video processing method
                process = mp.Process(target=vp.process_INTERPOLATE, args=(f"{input_path}/{file}", final))  # define a new process pointing to process_INTERPOLATE
                if is_stateless:
                    processes[file] = process
                process.start() # start the process on another thread
                print(f"Process started on {file}")
            return "Success: file exists", 200
        else:
            return "Error: file not found", 200
    return "Error: request must be of type POST", 405

@app.route("/check_finished", methods=["POST"])
async def return_status():
    if is_stateless:  # only enable this route if we're running in stateless mode
        if request.method == "POST":
            file = (await request.data).decode()
            process: mp.Process
            try:
                process = processes[file]
            except KeyError:
                return "Invalid filename", 200  # shouldn't ever happen, but just in case
            
            if process.is_alive():
                return "false", 200 # return false to the request for "is the video finished processing"
            else:
                processes.pop(file) # remove the process from the dictionary
                return "true", 200  # return true
        else:
            return "Error: request must be of type POST", 405
    else:
        print("Not running in stateless mode, returning 404")
        return "", 404

@app.route("/health", methods=["GET"])
async def return_health():
    return jsonify({}), 200
