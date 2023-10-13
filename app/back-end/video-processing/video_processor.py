import cv2 as cv, os, time, multiprocessing as mp, numpy as np, subprocess as sp, random
from PIL import Image, ImageFilter

def extract_frames(path: str) -> str:   # likely legacy as it seems performance is much better when we're doing all operations in RAM rather than saving/loading from disk
    """
    Extracts and save all frames of a video into a new folder and return the directory's name
    File pointed to by `path`, opencv and ffmpeg do the frame extraction.
    """
    fps = cv.VideoCapture(path).get(cv.CAP_PROP_FPS)
    directory = f"temp_{time.time()}"   # make the directory name unique
    os.mkdir(directory)
    os.system(f"ffmpeg -i {path} -vf fps={fps} {directory}/frame%04d.jpg")
    return directory

def blur_frame(img, r: int = 50, rects: [] = []):
    """
    Loads an image and applies a blur on all regions specified by `rects`.
    `img` is an opencv image (ie essentially an np array).
    `rects` is of the form [[x, y, w, h], [x, y, w, h], ...] where xy is the top left corner of the rectangle
    """
    H, W = img.shape[:2]    # height and width of image
    r = int(W / r)          # define a blur radius that scales with the image, definitely want to change and fine tune this in the future
    if len(rects) == 0:     # if no rectangles passed, init a simple checker pattern blur for testing
        w, h = int(W / 2), int(H / 2)
        rects = [[0, 0, w, h], [w, h, w, h]]
    for rect in rects:      # for every blurring zone, blur the zone and update the image
        x, y, w, h = rect[:4]       # init loop variables, if rect is longer than 4 elements, discard the extra elements
        section = img[y:y+h, x:x+w] # cut out a section with numpy indice slicing
        img[y:y+h, x:x+w] = cv.blur(section, (r, r))    # blur the section and replace the indices with the now blurred section
    return img

def process(src: str, tmp: str, out: str):
    """
    Takes 3 file paths, `src`, `tmp`, and `out`. Loads `src` into memory, applies a blur on every frame,
    and exports to `tmp`. Finally, audio is copied from `src` and video is copied from `tmp` to `out`
    to product the final video.

    Currently blur_frame() has no `rects` passed to it, this will be updated when we hook up to AWS Rekognition.
    Additionally, this function has NO interpolation and assumes ALL blur coordinates for every frame will be provided.
    """
    input = cv.VideoCapture(src)        # load input video 
    fps = input.get(cv.CAP_PROP_FPS)    # read our fps, we need this to set the output video properties
    hasNext, img = input.read()         # get next frame
    h, w = img.shape[:2]                # get height and width of our input video to set frameSize for our output video
    output = cv.VideoWriter(filename=tmp, fps=fps, frameSize=(w, h), fourcc=cv.VideoWriter_fourcc(*'mp4v'))     # init our video output
    while hasNext:      # hasNext is a truthy int returned from input.read() that indicates if there's another frame in the video
        output.write(blur_frame(img))   # blur image and write it to our output video
        hasNext, img = input.read()     # get next frame
    input.release()     # release input io lock
    output.release()    # release output io lock
    # the command we now need to run to combine the audio from `src` and the video from `tmp` is:
    # 'ffmpeg -y -i {tmp} -i {src} -c copy -map 0:v:0 -map 1:a:0 out'. This looks confusing and scary but here's the breakdown:
    #  - the '-y' operator answers "yes" to any potential "overwrite files?" prompts. May be undesirable in the future if concurrency/multiple encodings occur at the same time
    #  - with each '-i' we specify an input video
    #  - "-c copy" expands to "-codec copy" which means we don't re-encode either the audio or the video, we simply copy/dump it to the output file (much faster, but also less desirable if we want a standard output format)
    #  - "-map 0:v:0" tells ffmpeg we want our 0th index input video's 0th video stream (our first input video is `tmp` which contains our blurred video, so we want that video stream in our final output)
    #  - "-map 1:a:0" tells ffmpeg we want our 1th index input video's 0th audio stream (our second input video is `src` which contains unblurred video but original audio which we want in our final output)
    #  - and finally we specify the output file `out`
    sp.Popen(["ffmpeg", "-y", "-i", tmp, "-i", src, "-c", "copy", "-map", "0:v:0", "-map", "1:a:0", out], stdout=sp.PIPE, stderr=sp.STDOUT)
    print("Done.")  # sp.Popen will wait until the process is complete before continuing

def get_frames(path: str) -> []:
    """
    Reads all frames from the video specified by `path` into an array of OpenCV images.
    """
    out = []
    input = cv.VideoCapture(path)
    hasNext, img = input.read()
    while hasNext:
        out.append(img)
        hasNext, img = input.read()
    return out

def calc_vector(point1: [], point2: [], n: int) -> []:
    """
    Takes a start point `point1` and an end point `point2` (each of the form [x, y]) and return
    a list of `n` points evenly distributed between the 2 points (exclusive)

    Example input: x1, y1, x2, y2, n = 0, 0, 10, 10, 9
    Example output: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9]]
    """
    return calc_vector(point1[0], point1[1], point2[0], point2[1], n)

def calc_vector(x1: int, y1: int, x2: int, y2: int, n: int) -> []:
    """
    Takes a start point (`x1`, `y1`) and an end point (`x2`, `y2`) and return
    a list of `n` points evenly distributed between the 2 points (exclusive)

    Example input: x1, y1, x2, y2, n = 0, 0, 10, 10, 9
    Example output: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9]]
    """
    stepx, stepy = (x2 - x1) / (n + 1), (y2 - y1) / (n + 1)
    out = []
    for i in range(1, n + 1):
        out.append([int(x1 + stepx * i), int(y1 + stepy * i)])
    return out

def pick_point(img):
    """
    Temporary function to take an image and randomly pick a point on it, for testing the interpolation workflow
    """
    h, w = img.shape[:2]
    return [random.randint(0, w - 1), random.randint(0, h - 1)]

def test_interpolation():
    """
    Hard-coded temporary function to test provisional logic flow for the interpolation.
    Loads a video, picks a few random points, then interpolates between the points and
    exports frames with red dots where each interpolated point is.
    """
    frames = get_frames("app/back-end/video-processing/videos/1.mp4")
    n = len(frames) # 132
    fps = 25
    runtime = n / fps   # number of seconds of runtime
    keyframe_interval = 0.5 # number of seconds between each keyframe
    frame_gap = int(fps * keyframe_interval)
    known_points = [pick_point(frames[0]) for i in range(int(n / frame_gap) + 1)]
    points = []
    for i in range(len(known_points) - 1):
        start, end = known_points[i], known_points[i + 1]
        points += [start]
        points += calc_vector(start[0], start[1], end[0], end[1], frame_gap - 1)
    points += [known_points[-1]]
    while len(points) < n:
        points.append(points[-1])
    for i in range(n):
        frame, point = frames[i], points[i]
        x, y = point
        # frame = blur_frame_CVNP(frame, 50, [[point[0], point[1], 50, 50]])
        frame[y:y+10, x:x+10] = [0, 0, 255]
        cv.imwrite(f"app/back-end/video-processing/out/{i}.jpg", frame)