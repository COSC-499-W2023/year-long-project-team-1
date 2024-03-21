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
        self.client = self.get_client()   # request a client of the type 'rekognition' from aws services
        self.BLANK_FRAME = [-1, -1, -1, -1]     # class constant to define a box for a frame with no detected face

    def get_client(self):
        return boto3.client("rekognition")

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

    def interpolate(self, x1: int, y1: int, x2: int, y2: int, w1: int, h1: int, w2: int, h2: int, n: int) -> 'list[list[int]]':
        """
        Used to return a list of `n` boxes evenly distributed between the 2 boxes (exclusive).
        Those boxes are used to identify the face blurring regions for each frame.
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

    def interpolate_BOX(self, box1: list, box2: list, n: int) -> 'list[list[int]]':
        """
        Method overload for `interpolate` but Python doesn't support proper method overloading which is why the `_BOX` suffix.
        """
        return self.interpolate(box1[0], box1[1], box2[0], box2[1], box1[2], box1[3], box2[2], box2[3], n)

    def compensate(self, box: 'list[int]', factor: float) -> 'list[int]':
        """
        Takes a box and increases its size by `factor` (float where 1.0 will have no effect)
        Also adjusts origin point to compensate for the width/height increase
        """
        w_increase = box[2] * (factor - 1)
        h_increase = box[3] * (factor - 1)
        x_change = w_increase / 2
        y_change = h_increase / 2
        return [max(0, int(box[0] - x_change)), max(0, int(box[1] - y_change)), int(box[2] + w_increase), int(box[3] + h_increase)]

    def match_boxes(self, start_boxes: 'list[list[int]]', end_boxes: 'list[list[int]]') -> 'tuple[list[list[int]], list[list[int]]]':
        """
        Takes a list of unordered 'start' and 'end' faces and attempts to match them based on the smallest distance change.
        Returns a list of ordered 'start' and 'end' faces.
        """
        start_faces = [Face(start_boxes[i], i) for i in range(len(start_boxes))]
        end_faces = [Face(end_boxes[i], i) for i in range(len(end_boxes))]
        start_len, end_len = len(start_faces), len(end_faces)
        if start_len >= end_len:    # handle same number of start/end faces and start number of faces > end number of faces
            for start_face in start_faces:
                distances: 'dict[float, Face]' = {}
                for end_face in end_faces:
                    distances[start_face.calc_dist(end_face)] = end_face    # relate distances to Face objects in dictionary
                start_face.match = distances[min([i for i in distances.keys()])]    # set match to the face with the smallest distance
            start_faces = sorted(start_faces)   # sort list based on shortest distance (shortest will be start_faces[0])
            return [i.box() for i in start_faces], [i.match.box() for i in start_faces] if start_len == end_len else [i.match.box() for i in start_faces[:end_len]]
        elif start_len < end_len:
            for end_face in end_faces:
                distances: 'dict[float, Face]' = {}
                for start_face in start_faces:
                    distances[end_face.calc_dist(start_face)] = start_face  # relate distances to Face objects in dictionary
                end_face.match = distances[min([i for i in distances.keys()])]  # set match to the face with the smallest distance
            end_faces = sorted(end_faces)   # sort list based on shortest distance (shortest will be end_faces[0])
            return [i.match.box() for i in end_faces[:start_len]], [i.box() for i in end_faces]

    def process(self, src: str, out: str, regions: 'list[list[int]]', blur_faces: bool, keyframe_interval: float = 0.3, compensation_factor: float = 1.3):
        """
        Processes a final video from start to finish using interpolation techniques.

        Takes 3 paths, `src` for the original video source, `tmp` for where the temporary blurred but
        no audio video will be stored, and `out` for the final video. Also takes `keyframe_interval`,
        a float that describes the number of seconds between keyframes. A lower `keyframe_interval` will
        have higher accuracy at the cost of more Rekognition requests (and therefore slower execution).
        If `keyframe_interval` is not specified, it defaults to 0.3 (about a third of a second).
        `compensation_factor` is a multiple applied to the widths and heights of face boxes to increase
        the size of the blur box and help compensate for fast movement. defaults to 1.3 (30% bigger)
        """
        # setup initial variables
        tmp = f"{out[:-4]}-temp{out[-4:]}"
        input = cv.VideoCapture(src)
        fps = input.get(cv.CAP_PROP_FPS)
        H, W = [int(i) for i in [input.get(cv.CAP_PROP_FRAME_HEIGHT), input.get(cv.CAP_PROP_FRAME_WIDTH)]]
        frame_gap = int(fps * keyframe_interval)    # number of frames between keyframes
        n = int(input.get(cv.CAP_PROP_FRAME_COUNT))  # number of frames in the video total

        # do the blurring
        input.release()
        output = cv.VideoWriter(filename=tmp, fps=fps, frameSize=(W, H), fourcc=cv.VideoWriter_fourcc(*'mp4v'))     # init our video output
        frame = self.get_frames(src, 1, 0)[0]
        face_start_boxes = self.get_face_boxes(frame) if blur_faces else []
        output.write(self.blur_frame(frame, [self.compensate(i, compensation_factor) for i in face_start_boxes] + regions))
        offset = 1
        for j in range(int(n / frame_gap) + 1):
            if j * frame_gap == n or j * frame_gap == n - 1:    # protect against edge cases that cause crashes
                break
            frames = self.get_frames(src, frame_gap, offset)
            faces: 'list[list[list[int]]]' = []  # each index is a different face's list of regions for the current frame chunk
            if blur_faces:
                face_end_boxes = self.get_face_boxes(frames[-1])
                face_start_boxes, face_end_boxes = self.match_boxes(face_start_boxes, face_end_boxes)   # sort the boxes based on min dist
                num_start_faces = len(face_start_boxes)
                num_end_faces = len(face_end_boxes)
                for i in range(max(num_start_faces, num_end_faces)):
                    start, end = [], []
                    if num_start_faces == num_end_faces:
                        start = self.compensate(face_start_boxes[i], compensation_factor)
                        end = self.compensate(face_end_boxes[i], compensation_factor)
                    elif num_start_faces > num_end_faces:
                        start = self.compensate(face_start_boxes[i], compensation_factor)
                        end = self.BLANK_FRAME if i >= num_end_faces else self.compensate(face_end_boxes[i], compensation_factor)
                    elif num_start_faces < num_end_faces:
                        start = self.BLANK_FRAME if i >= num_start_faces else self.compensate(face_start_boxes[i], compensation_factor)
                        end = self.compensate(face_end_boxes[i], compensation_factor)
                    face_boxes = self.interpolate_BOX(start, end, len(frames) - 1)
                    face_boxes += [end]
                    faces += [face_boxes]
            for i in range(len(frames)):
                if blur_faces:    # faces should be non-empty here
                    face_regions: 'list[list[int]]' = [face[i] for face in faces]
                    output.write(self.blur_frame(frames[i], face_regions + regions))
                else:             # boxes will be empty here
                    output.write(self.blur_frame(frames[i], regions))
            if blur_faces:
                face_start_boxes = face_end_boxes
            offset += frame_gap
        output.release()

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

    def get_face_boxes(self, img) -> 'list[list[int]]':
        """
        Takes an image, converts it to `bytes`, sends a request to rekognotion, parses the JSON response,
        and returns the `xywh` coordinates in the form [`x`, `y`, `w`, `h`]. If no face is detected in
        the given image, returns `self.BLANK_FRAME`.
        `img` is an opencv image (essentially a np array)
        Explanation of xywh:
         - x,y: coordinates of the top-left box in pixels
         - w: width of the bounding box in pixels
         - h: height of the bounding box in pixels
        """
        H, W = img.shape[:2]    # get the height and width of the image
        response = self.client.detect_faces(Image={"Bytes": self.img_to_bytes(img)})  # run detect_faces and collect response
        if len(response["FaceDetails"]) > 0:
            faces = []
            for face in response["FaceDetails"]:
                box = face["BoundingBox"]
                x, y, w, h = box["Left"] * W, box["Top"] * H, box["Width"] * W, box["Height"] * H
                faces.append([int(i) if i > 0 else 0 for i in [x, y, w, h]])
            return faces
        else:
            return [self.BLANK_FRAME]

    @staticmethod
    def get_instance():
        if VideoProcessor._instance is None:
            VideoProcessor._instance = VideoProcessor()
        return VideoProcessor._instance


class Face:
    """
    This class was implemented just for the VideoProcessor.match_boxes() function for sortable lists based on cartesian distance
    """
    x: int
    y: int
    w: int
    h: int
    index: int
    match: 'Face'

    def __init__(self, box: 'list[int]', i: int) -> None:
        self.x, self.y, self.w, self.h = box[:4]
        self.index = i

    def calc_dist(self, other_face: 'Face') -> float:
        return ((self.x - other_face.x)**2 + (self.y - other_face.y)**2)**0.5

    def box(self) -> 'list[int]':
        return [self.x, self.y, self.w, self.h]

    def get_match_dist(self) -> float:
        return self.calc_dist(self.match)

    def __lt__(self, face: 'Face') -> bool:
        return self.get_match_dist() < face.get_match_dist()

    def __eq__(self, val: 'Face') -> bool:
        return self.box() == val.box()
