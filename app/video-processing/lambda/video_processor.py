# Copyright [2023] [Privacypal Authors]
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import cv2 as cv
import os
import subprocess as sp
import boto3


class VideoProcessor:
    client: boto3.client
    BLANK_FRAME: 'list[int]'

    _instance: "VideoProcessor" = None

    def __init__(self):
        self.client = boto3.client("rekognition")   # request a client of the type 'rekognition' from aws services
        self.BLANK_FRAME = [-1, -1, -1, -1]     # class constant to define a box for a frame with no detected face

    def blur_frame(self, img, rects: list, r: int = 25):
        """
        Loads an image and applies a blur on all regions specified by `rects`.
        `img` is an opencv image (ie essentially an np array).
        `rects` is of the form [[x, y, w, h], [x, y, w, h], ...] where xy is the top left corner of the rectangle
        """
        H, W = img.shape[:2]    # height and width of image
        r = int(W / r)          # define a blur radius that scales with the image, definitely want to change and fine tune this in the future
        # if len(rects) == 0:     # if no rectangles passed, init a simple checker pattern blur for testing
        #     w, h = int(W / 2), int(H / 2)
        #     rects = [[0, 0, w, h], [w, h, w, h]]
        for rect in rects:      # for every blurring zone, blur the zone and update the image
            if rect != self.BLANK_FRAME and rect != []:    # if not a 'blank' frame, blur it
                x, y, w, h = rect[:4]       # init loop variables, if rect is longer than 4 elements, discard the extra elements
                section = img[y: y + h, x: x + w]  # cut out a section with numpy indice slicing
                img[y: y + h, x: x + w] = cv.blur(section, (r, r))    # blur the section and replace the indices with the now blurred section
        return img

    def get_frames(self, path: str, count: int, offset: int) -> list:
        """
        Reads all frames from the video specified by `path` into an array of OpenCV images.
        Number of frames read is determined by `count`, while `offset` determines how many frames into the video to begin saving frames
        """
        out = []
        input = cv.VideoCapture(path)
        hasNext = True
        while hasNext and offset > 0:
            hasNext, img = input.read()
            offset -= 1
        while count > 0:
            hasNext, img = input.read()
            if hasNext:
                out.append(img)
            count -= 1
        return out

    def calc_vector(self, x1: int, y1: int, x2: int, y2: int, w: int, h: int, n: int) -> 'list[list[int]]':
        """
        Takes a start point (`x1`, `y1`) and an end point (`x2`, `y2`) and returns
        a list of `n` points evenly distributed between the 2 points (exclusive).
        Copies the width and height specified in the parameters (`w` and `h`) to the output so
        that the output consists of a list of lists where each inner list is of the
        form [`x`, `y`, `w`, `h`].

        Example input: x1, y1, x2, y2, w, h, n = 0, 0, 10, 10, 3, 6, 9
        Example output: [[1, 1, 3, 6], [2, 2, 3, 6], [3, 3, 3, 6], [4, 4, 3, 6], [5, 5, 3, 6],
        [6, 6, 3, 6], [7, 7, 3, 6], [8, 8, 3, 6], [9, 9, 3, 6]]
        """
        # handle frames with no faces
        start, end = [x1, y1, w, h], [x2, y2, w, h]
        if start == end == self.BLANK_FRAME:   # if our start and endpoints are blank ie no face, return n blank tween frames
            return [self.BLANK_FRAME for i in range(n)]
        if start == self.BLANK_FRAME:  # if start is blank, we have no known motion to track so just blur the known end coords for the tween frames
            return [end for i in range(n)]
        if end == self.BLANK_FRAME:    # if end is blank, we have no known motion to track so just blur the known start coords for the tween frames
            return [start for i in range(n)]

        # handle frames with faces
        n += 1  # all these calculations require n increasing by 1 so we'll just do it beforehand
        stepx, stepy = (x2 - x1) / n, (y2 - y1) / n
        out = []
        for i in range(1, n):
            out.append([int(x1 + stepx * i), int(y1 + stepy * i), w, h])
        return out

    def calc_vector_BOX(self, box1: list, box2: list, n: int) -> 'list[list[int]]':
        """
        Method overload for `calc_vector` but Python doesn't support proper method overloading which is why the `_BOX` suffix.
        """
        return self.calc_vector(box1[0], box1[1], box2[0], box2[1], box1[2], box1[3], box2[2], box2[3], n)

    def calc_vector_size(self, x1: int, y1: int, x2: int, y2: int, w1: int, h1: int, w2: int, h2: int, n: int) -> 'list[list[int]]':
        """
        Essentially the same as `calc_vector` but it calculates the interpolation of the box size as well.
        Takes a start point (`x1`, `y1`) and an end point (`x2`, `y2`) and returns
        a list of `n` points evenly distributed between the 2 points (exclusive).
        Also calculates the shift in width and height as passed in (`w1`, `h1`) and (`w2`, `h2`).

        Example input: x1, y1, x2, y2, w, h, n = 0, 0, 3, 3, 4, 3, 7, 6, 2
        Example output: [[1, 1, 5, 4], [2, 2, 6, 5]]
        """
        # handle frames with no faces
        start, end = [x1, y1, w1, h1], [x2, y2, w2, h2]
        if start == end == self.BLANK_FRAME:   # if our start and endpoints are blank ie no face, return n blank tween frames
            return [self.BLANK_FRAME for i in range(n)]
        if start == self.BLANK_FRAME:  # if start is blank, we have no known motion to track so just blur the known end coords for the tween frames
            return [end for i in range(n)]
        if end == self.BLANK_FRAME:    # if end is blank, we have no known motion to track so just blur the known start coords for the tween frames
            return [start for i in range(n)]

        # handle frames with faces
        n += 1  # all these calculations require n increasing by 1 so we'll just do it beforehand
        stepx, stepy = (x2 - x1) / n, (y2 - y1) / n
        stepw, steph = (w2 - w1) / n, (h2 - h1) / n
        out = []
        for i in range(1, n):
            out.append([int(x1 + stepx * i), int(y1 + stepy * i), int(w1 + stepw * i), int(h1 + steph * i)])
        return out

    def calc_vector_size_BOX(self, box1: list, box2: list, n: int) -> 'list[list[int]]':
        """
        Method overload for `calc_vector_size` but Python doesn't support proper method overloading which is why the `_BOX` suffix.
        """
        return self.calc_vector_size(box1[0], box1[1], box2[0], box2[1], box1[2], box1[3], box2[2], box2[3], n)

    def process(self, src: str, out: str, regions: 'list[list[int]]', blur_faces: bool, keyframe_interval: float = 0.5):
        """
        Processes a final video from start to finish using interpolation techniques.

        Takes 3 paths, `src` for the original video source, `tmp` for where the temporary blurred but
        no audio video will be stored, and `out` for the final video. Also takes `keyframe_interval`,
        a float that describes the number of seconds between keyframes. A lower `keyframe_interval` will
        have higher accuracy at the cost of more Rekognition requests (and therefore slower execution).
        If `keyframe_interval` is not specified, it defaults to 0.5 (a half second).
        """
        # setup initial variables
        tmp = f"{out[:-4]}-temp{out[-4:]}"
        input = cv.VideoCapture(src)
        fps = input.get(cv.CAP_PROP_FPS)
        H, W = [int(i) for i in [input.get(cv.CAP_PROP_FRAME_HEIGHT), input.get(cv.CAP_PROP_FRAME_WIDTH)]]
        frame_gap = int(fps * keyframe_interval)    # number of frames between keyframes
        n = int(input.get(cv.CAP_PROP_FRAME_COUNT))  # number of frames in the video total

        # NO INTERPOLATION METHOD -------------------------------
        # output = cv.VideoWriter(filename=tmp, fps=fps, frameSize=(W, H), fourcc=cv.VideoWriter_fourcc(*'mp4v'))     # init our video output
        # for i in range(n):
        #     hasNext, frame = input.read()
        #     box = self.get_face(frame)
        #     output.write(self.blur_frame(frame, [box]))
        # input.release()
        # output.release()
        # END METHOD ------------------------------------------

        # NEW METHOD TO LOWER MEMORY USAGE -----------------------------------------------------------------
        input.release()
        output = cv.VideoWriter(filename=tmp, fps=fps, frameSize=(W, H), fourcc=cv.VideoWriter_fourcc(*'mp4v'))     # init our video output
        frame = self.get_frames(src, 1, 0)[0]
        start = self.get_face(frame) if blur_faces else []
        output.write(self.blur_frame(frame, [start] + regions))
        offset = 1
        for j in range(int(n / frame_gap) + 1):
            if j * frame_gap == n or j * frame_gap == n - 1:    # protect against edge cases that cause crashes
                break
            frames = self.get_frames(src, frame_gap, offset)
            boxes = []
            if blur_faces:
                end = self.get_face(frames[-1])
                boxes = self.calc_vector_size_BOX(start, end, len(frames) - 1)
                boxes += [end]
            for i in range(len(frames)):
                if blur_faces:    # boxes should be non-empty here
                    output.write(self.blur_frame(frames[i], [boxes[i]] + regions))
                else:             # boxes will be empty here
                    output.write(self.blur_frame(frames[i], regions))
            if blur_faces:
                start = end
            offset += frame_gap
        output.release()
        # END NEW METHOD -----------------------------------------------------------------

        # OLD METHOD WITH HIGH MEMORY USAGE ------------------------------------
        # input.release()
        # get our faces from rekognition
#         frames = self.get_frames(src, n, 0)
#         known_boxes = []  # [pick_point(frames[0]) for i in range(int(n / frame_gap) + 1)]
#         for i in range(0, n, frame_gap):
#             box = self.get_face(frames[i])
#             known_boxes.append(box)
#
#         # interpolate the positions of the faces based on `frame_gap`
#         boxes = []
#         for i in range(len(known_boxes) - 1):
#             start, end = known_boxes[i], known_boxes[i + 1]
#             boxes += [start]
#             boxes += self.calc_vector_size_BOX(start, end, frame_gap - 1)
#         boxes += [known_boxes[-1]]
#         while len(boxes) < n:
#             boxes.append(boxes[-1])
#
#         # use `boxes` to blur the frames and output the finished video
#         output = cv.VideoWriter(filename=tmp, fps=fps, frameSize=(W, H), fourcc=cv.VideoWriter_fourcc(*'mp4v'))     # init our video output
#         for i in range(n):
#             output.write(self.blur_frame(frames[i], [boxes[i]]))
#         output.release()    # release output io lock
        # END OLD METHOD ------------------------------------------------------

        # the command we now need to run to combine the audio from `src` and the video from `tmp` is:
        # 'ffmpeg -y -i {tmp} -i {src} -c copy -map 0:v:0 -map 1:a:0 out'. This looks confusing and scary but here's the breakdown:
        #  - the '-y' to overwrite existing files May be undesirable in the future if concurrency/multiple encodings occur at the same time
        #  - with each '-i' we specify an input video
        #  - "-c copy" expands to "-codec copy" which means we don't re-encode either the audio or the video, we simply copy/dump it to the output file
        #    - Much faster, but also less desirable if we want a standard output format
        #  - "-map 0:v:0" tells ffmpeg we want our 0th index input video's 0th video stream
        #    - Our first input video is `tmp` which contains our blurred video, so we want that video stream in our final output
        #  - "-map 1:a:0?" tells ffmpeg we want our 1th index input video's 0th audio stream
        #    - Our second input video is `src` which contains unblurred video but original audio which we want in our final output.
        #    Additionally, the '?' in the second -map makes it an optional map which is ignored if the requested stream doesn't exist.
        #  - and finally we specify the output file `out`
        p = sp.Popen(["ffmpeg", "-y", "-i", tmp, "-i", src, "-vcodec", "libx264", "-map", "0:v:0", "-map", "1:a:0?", out], stdout=sp.PIPE, stderr=sp.STDOUT)
        p.wait()
        os.remove(tmp)

    def img_to_bytes(self, img) -> bytes:
        """
        Simple function to take an opencv `img` and return its `bytes` representation.
        Used to send images to Rekognition.
        """
        _, img_arr = cv.imencode(".jpg", img)
        return img_arr.tobytes()

    def get_face(self, img) -> list:
        """
        Takes an image, converts it to `bytes`, sends a request to rekognotion, parses the JSON response,
        and returns the `xywh` coordinates in the form [`x`, `y`, `w`, `h`]. If no face is detected in
        the given image, returns `self.BLANK_FRAME`.
        `img` is an opencv image (essentially a np array)
        """
        H, W = img.shape[:2]    # get the height and width of the image
        response = self.client.detect_faces(Image={"Bytes": self.img_to_bytes(img)})  # run detect_faces and collect response
        if len(response["FaceDetails"]) > 0:
            facedetails = (response["FaceDetails"])[0]  # facedetails is of type dict
            box = facedetails["BoundingBox"]            # box is of type dict
            x, y, w, h = box["Left"] * W, box["Top"] * H, box["Width"] * W, box["Height"] * H   # use H/W to scale the percents back to pixel values
            return [int(i) if i > 0 else 0 for i in [x, y, w, h]]
        else:
            return self.BLANK_FRAME

    def get_sys_load(self) -> 'list[float]':
        """
        Function that returns a list of 3 percents indicating the system load average in the last 1, 5, and 15 minutes respectively
        """
        # run commands and decode the output
        p = sp.Popen(["uptime"], stdout=sp.PIPE, stderr=sp.STDOUT)
        uptime_raw, _ = [i.decode("utf-8").replace(" ", "") if i is not None else i for i in p.communicate()]
        p = sp.Popen(["lscpu"], stdout=sp.PIPE, stderr=sp.STDOUT)
        lscpu_raw, _ = [i.decode("utf-8").replace(" ", "") if i is not None else i for i in p.communicate()]

        # parse out the system load for the last 1, 5, and 15 minutes
        uptime_raw = uptime_raw[uptime_raw.index("loadaverage:") + 12:]
        one, five, fifteen = [float(i) for i in uptime_raw.split(",")]  # average system load in the last 1, 5, and 15 minutes

        # parse out the number of cores (technically physical threads, but the OS considers them
        # 'cores' or logical processors and that's how average system load is normalized)
        # ex: running this on an 8c/16t CPU will have num_cores == 16
        lscpu_raw = lscpu_raw[lscpu_raw.index("CPU(s):") + 7:]
        num_cores = int(lscpu_raw[:lscpu_raw.index("\n")])

        # normalize the system load values as a percentage of total system CPU resources
        one, five, fifteen = [i / num_cores * 100 for i in [one, five, fifteen]]
        return [one, five, fifteen]

    @staticmethod
    def get_instance():
        if VideoProcessor._instance is None:
            VideoProcessor._instance = VideoProcessor()
        return VideoProcessor._instance
