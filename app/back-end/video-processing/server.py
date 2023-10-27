import os, multiprocessing as mp
from video_processor import VideoProcessor
from flask import Flask, request, jsonify

app = Flask(__name__)
vp = VideoProcessor()

input_path = os.environ.get("PRIVACYPAL_INPUT_VIDEO_DIR", "/opt/privacypal/videos/input_videos")    # default to /opt/privacypal/videos/input_videos
out_path = os.environ.get("PRIVACYPAL_OUT_VIDEO_DIR", "/opt/privacypal/videos/out_videos") # default to /opt/privacypal/videos/out_videos

@app.route("/process_video", methods=["POST"])
def handle_request():
    if request.method == "POST":
        file = request.data.decode("utf-8")     # expects the filename, in the form <uid>-<file name>-<epoch time> such as "23-yeehaw-1698360721.mp4"
        if os.path.isfile(f"{input_path}/{file}"):    # check if the file exists
            final = f"{out_path}/{file[:-4]}-processed{file[-4:]}"
            process = mp.Process(target=vp.process_INTERPOLATE, args=(f"{input_path}/{file}", final, ))  # define a new process pointing to process_INTERPOLATE
            process.start() # start the process on another thread
            print(f"Process started on {file}")
            return "Success: file exists"
        else:
            return "Error: file not found"
    return "Error: request must be of type POST"

@app.route("/health", methods=["GET"])
def return_health():
    return jsonify({}), 200
