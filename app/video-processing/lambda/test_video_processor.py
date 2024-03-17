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

from unittest import TestCase, mock
from unittest.mock import MagicMock
import os
import cv2 as cv
import json
from video_processor import VideoProcessor
import mock_client


class TestVideoProcessor(TestCase):
    vp: VideoProcessor
    video_path: str = "../samples/test.mp4"
    image_path: str = "../samples/test.jpg"
    no_faces_path: str = "../samples/response_no_faces.json"
    one_face_path: str = "../samples/response_one_face.json"
    two_faces_path: str = "../samples/response_two_faces.json"
    img: "any"
    fps: int = 25
    width: int = 1280
    height: int = 720
    num_frames: int = 132

    @classmethod
    @mock.patch("video_processor.VideoProcessor.get_client", MagicMock(return_value=mock_client.MockClient))
    def setUpClass(self):
        self.vp = VideoProcessor()  # init VideoProcessor object for all tests
        self.img = cv.imread(self.image_path)    # 64x64 pixel image

    def test_get_frames(self):
        frames = self.vp.get_frames(self.video_path, self.num_frames, 0)
        assert len(frames) == self.num_frames, "incorrect number of frames in get_frames"
        for frame in frames:
            H, W = frame.shape[:2]
            assert W == self.width, "width not equal in get_frames"
            assert H == self.height, "height not equal in get_frames"

    def test_interpolate(self):
        simple_positive = [[0, 0, 1, 1], [5, 5, 11, 11]]
        simple_negative = [[5, 5, 11, 11], [0, 0, 1, 1]]
        answer_positive = [[1, 1, 3, 3], [2, 2, 5, 5], [3, 3, 7, 7], [4, 4, 9, 9]]
        answer_negative = [[4, 4, 9, 9], [3, 3, 7, 7], [2, 2, 5, 5], [1, 1, 3, 3]]
        for question, answer in [[simple_positive, answer_positive], [simple_negative, answer_negative]]:
            vector = self.vp.interpolate_BOX(question[0], question[1], 4)
            assert vector == answer, "incorrect calculations in interpolate"

    def test_interpolate_blank_frame(self):
        start_blank = [self.vp.BLANK_FRAME, [9, 87, 65, 43]]
        end_blank = [[12, 34, 56, 78], self.vp.BLANK_FRAME]
        all_blank = [self.vp.BLANK_FRAME, self.vp.BLANK_FRAME]
        start_answer = [[9, 87, 65, 43], [9, 87, 65, 43], [9, 87, 65, 43], [9, 87, 65, 43]]
        end_answer = [[12, 34, 56, 78], [12, 34, 56, 78], [12, 34, 56, 78], [12, 34, 56, 78]]
        all_answer = [self.vp.BLANK_FRAME, self.vp.BLANK_FRAME, self.vp.BLANK_FRAME, self.vp.BLANK_FRAME]
        for question, answer in [[start_blank, start_answer], [end_blank, end_answer], [all_blank, all_answer]]:
            vector = self.vp.interpolate_BOX(question[0], question[1], 4)
            assert vector == answer, "incorrect handling of blank frames in interpolate"

    def test_compensate(self):
        # regular case
        result = self.vp.compensate([5, 5, 10, 10], 1.0)
        assert result == [5, 5, 10, 10], "compensate with factor=1.0 should not change the box"

        # slight increase
        result = self.vp.compensate([5, 5, 10, 10], 1.5)
        assert result == [2, 2, 15, 15], "compensate should adjust both origin points and box size"

        # large increase which will make origin points adjust to outside the frame
        result = self.vp.compensate([5, 5, 10, 10], 5.0)
        assert result == [0, 0, 50, 50], "compensate should make sure origin points don't go outside of frame"

    def test_match_boxes(self):
        a, b = [0, 0, 5, 5], [50, 50, 5, 5]     # test start faces
        c, d = [15, 24, 5, 5], [40, 39, 5, 5]   # test end faces

        # 2 start faces, 2 end faces
        result = self.vp.match_boxes([a, b], [d, c])
        assert result == ([b, a], [d, c]), "match_boxes not sorting properly with len(start) == len(end)"

        # 2 start faces, 1 end face
        result = self.vp.match_boxes([a, b], [d])
        assert result == ([b, a], [d]), "match_boxes not sorting properly with len(start) > len(end)"

        # 1 start face, 2 end faces
        result = self.vp.match_boxes([b], [c, d])
        assert result == ([b], [d, c]), "match_boxes not sorting properly with len(start) < len(end)"

    @mock.patch("mock_client.MockClient.detect_faces")
    def test_get_face_boxes_none(self, mocked: MagicMock):
        mocked.return_value = json.load(open(self.no_faces_path, "r"))
        faces = self.vp.get_face_boxes(self.img)
        assert len(faces) == 1, "return length wrong in get_face_boxes"
        assert faces[0] == self.vp.BLANK_FRAME, "return value wrong in get_face_boxes"

    @mock.patch("mock_client.MockClient.detect_faces")
    def test_get_face_boxes_one(self, mocked: MagicMock):
        mocked.return_value = json.load(open(self.one_face_path, "r"))
        faces = self.vp.get_face_boxes(self.img)
        assert len(faces) == 1, "return length wrong in get_face_boxes"
        assert faces[0] == [44, 32, 12, 25], "return value wrong in get_face_boxes"

    @mock.patch("mock_client.MockClient.detect_faces")
    def test_get_face_boxes_two(self, mocked: MagicMock):
        mocked.return_value = json.load(open(self.two_faces_path, "r"))
        faces = self.vp.get_face_boxes(self.img)
        assert len(faces) == 2, "return length wrong in get_face_boxes"
        for a, b in [[faces[0], [6, 6, 12, 25]], [faces[1], [32, 32, 12, 25]]]:
            assert a == b, "return value wrong in get_face_boxes"

    def test_blur_blank_frame(self):
        blurred_img = self.vp.blur_frame(self.img, [self.vp.BLANK_FRAME], r=10)  # shouldn't be blurred at all
        assert self.img.tobytes() == blurred_img.tobytes(), "blur_frame incorrectly blurring a blank frame"

    def test_img_to_bytes(self):
        file_path = "test.jpg"
        cv.imwrite(file_path, self.img)      # write out the test image to disk
        f = open(file_path, "rb")
        assert self.vp.img_to_bytes(self.img) == f.read(), ""   # compare converted bytes to direct read-from-disk bytes
        f.close()
        os.remove("test.jpg")
