import os, multiprocessing as mp
from video_processor import VideoProcessor
from flask import Flask, request, jsonify

app = Flask(__name__)
vp = VideoProcessor()

@app.route("/process_video", methods=["POST"])
def handle_request():
    path = os.environ.get("PRIVACYPAL_VIDEO_DIRECTORY", "/opt/privacypal/videos/input_videos") # default to /opt/privacypal/videos/input_videos
    if request.method == "POST":
        file = request.data.decode("utf-8")     # expects the filename, in the form <uid>-<file name>-<epoch time> such as "23-yeehaw-1698360721.mp4"
        if os.path.isfile(f"{path}/{file}"):    # check if the file exists
            out = f"{path}/../output_videos/{file[:-4]}-processed"  # apparently relative paths are a thing that work
            tmp, final = f"{out}-temp{file[-4:]}", f"{out}{file[-4:]}"
            process = mp.Process(target=vp.process_INTERPOLATE, args=(f"{path}/{file}", tmp, final, ))  # define a new process pointing to process_INTERPOLATE
            process.start() # start the process on another thread
            print(f"Process started on {file}")
            return "Success: file exists"
        else:
            return "Error: file not found"
    return "Error: request must be of type POST"

@app.route("/health", methods=["GET"])
def return_health():
    return jsonify({}), 200
