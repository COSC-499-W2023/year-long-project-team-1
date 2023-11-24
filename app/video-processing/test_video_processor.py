import pytest
import os
import cv2 as cv
from video_processor import VideoProcessor


class TestVideoProcessor:
    vp: VideoProcessor
    video_path: str = "samples/test.mp4"
    image_path: str = "samples/test.jpg"
    fps: int = 25
    width: int = 1280
    height: int = 720
    num_frames: int = 132

    @pytest.fixture
    def vp(self):
        return VideoProcessor()

    def test_get_frames(self, vp: VideoProcessor):
        frames = vp.get_frames(self.video_path)
        assert len(frames) == self.num_frames, "incorrect number of frames in get_frames"
        for frame in frames:
            H, W = frame.shape[:2]
            assert W == self.width, "width not equal in get_frames"
            assert H == self.height, "height not equal in get_frames"

    def test_calc_vector_size(self, vp: VideoProcessor):
        simple_positive = [[0, 0, 1, 1], [5, 5, 11, 11]]
        simple_negative = [[5, 5, 11, 11], [0, 0, 1, 1]]
        answer_positive = [[1, 1, 3, 3], [2, 2, 5, 5], [3, 3, 7, 7], [4, 4, 9, 9]]
        answer_negative = [[4, 4, 9, 9], [3, 3, 7, 7], [2, 2, 5, 5], [1, 1, 3, 3]]
        for question, answer in [[simple_positive, answer_positive], [simple_negative, answer_negative]]:
            vector = vp.calc_vector_size_BOX(question[0], question[1], 4)
            assert vector == answer, "incorrect calculations in calc_vector"

    def test_calc_vector_size_blank_frame(self, vp: VideoProcessor):
        start_blank = [vp.BLANK_FRAME, [9, 87, 65, 43]]
        end_blank = [[12, 34, 56, 78], vp.BLANK_FRAME]
        all_blank = [vp.BLANK_FRAME, vp.BLANK_FRAME]
        start_answer = [[9, 87, 65, 43], [9, 87, 65, 43], [9, 87, 65, 43], [9, 87, 65, 43]]
        end_answer = [[12, 34, 56, 78], [12, 34, 56, 78], [12, 34, 56, 78], [12, 34, 56, 78]]
        all_answer = [vp.BLANK_FRAME, vp.BLANK_FRAME, vp.BLANK_FRAME, vp.BLANK_FRAME]
        for question, answer in [[start_blank, start_answer], [end_blank, end_answer], [all_blank, all_answer]]:
            vector = vp.calc_vector_size_BOX(question[0], question[1], 4)
            assert vector == answer, "incorrect handling of blank frames in calc_vector"

    def test_blur_blank_frame(self, vp: VideoProcessor):
        img = cv.imread(self.image_path)
        blurred_img = vp.blur_frame(img, [vp.BLANK_FRAME], r=10)  # shouldn't be blurred at all
        assert img.tobytes() == blurred_img.tobytes(), "blur_frame incorrectly blurring a blank frame"

    def test_img_to_bytes(self, vp: VideoProcessor):
        file_path = "test.jpg"
        img = cv.imread(self.image_path)    # read in test image
        cv.imwrite(file_path, img)      # write out the test image to disk
        f = open(file_path, "rb")
        assert vp.img_to_bytes(img) == f.read()   # compare converted bytes to direct read-from-disk bytes
        f.close()
        os.remove("test.jpg")
