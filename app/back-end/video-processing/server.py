import os, multiprocessing as mp
from video_processor import VideoProcessor
from flask import Flask, request

app = Flask(__name__)
vp = VideoProcessor()

@app.route("/process_video", methods=["POST"])
def handle_request():
    path = os.environ["PRIVACYPAL_VIDEO_DIRECTORY"] # load our video directory environment variable
    if request.method == "POST":
        file = request.data.decode("utf-8")     # expects just the filename, such as "paul test phone.mp4"
        if os.path.isfile(f"{path}/{file}"):    # check if the file exists
            out = f"{path}/{file[:-4]}"
            if not os.path.isdir(out):
                os.mkdir(out)   # if the directory doesn't exist, make a directory with the name of the file we're going to be processing
            process = mp.Process(target=vp.process_INTERPOLATE, args=(f"{path}/{file}", f"{out}/temp.mp4", f"{out}/final.mp4", ))  # define a new process pointing to process_INTERPOLATE
            process.start() # start the process on another thread
            print(f"Process started on {file}")
            return "Success: file exists"
        else:
            return "Error: file not found"
    return "Error: request must be of type POST"

@app.route("/status", methods=["GET"])
def return_health():
    one, five, fifteen = vp.get_sys_load()
    return f"System load averages (1m, 5m, 15m): {one:.2f}%, {five:.2f}%, {fifteen:.2f}%"
