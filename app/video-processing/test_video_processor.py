import unittest, sys, os, cv2 as cv, numpy as np
from video_processor import VideoProcessor

os.environ["AWS_ACCESS_KEY_ID"] = "some-key-id"
os.environ["AWS_SECRET_ACCESS_KEY"] = "some-access-key"
os.environ["AWS_SESSION_TOKEN"] = "some-session-token"
os.environ["AWS_DEFAULT_REGION"] = "ca-central-1"

class VideoProcessorTest(unittest.TestCase):
    vp: VideoProcessor
    video_path: str
    image_path: str
    fps: int
    width: int
    height: int
    num_frames: int

    def setUp(self):
        self.vp = VideoProcessor()
        self.video_path = "resources/test.mp4"
        self.image_path = "resources/test.jpg"
        # hard-coded test values i retrieved from ffprobe for this ^ video
        self.fps = 25
        self.width = 1280
        self.height = 720
        self.num_frames = 132

    def test_get_frames(self):
        frames = self.vp.get_frames(self.video_path)
        self.assertEqual(len(frames), self.num_frames, "incorrect number of frames in get_frames")
        for frame in frames:
            H, W = frame.shape[:2]
            self.assertEqual(W, self.width, "width not equal in get_frames")
            self.assertEqual(H, self.height, "height not equal in get_frames")
    
    def test_calc_vector_size(self):
        simple_positive = [[0, 0, 1, 1], [5, 5, 11, 11]]
        simple_negative = [[5, 5, 11, 11], [0, 0, 1, 1]]
        answer_positive = [[1, 1, 3, 3], [2, 2, 5, 5], [3, 3, 7, 7], [4, 4, 9, 9]]
        answer_negative = [[4, 4, 9, 9], [3, 3, 7, 7], [2, 2, 5, 5], [1, 1, 3, 3]]
        for question, answer in [[simple_positive, answer_positive], [simple_negative, answer_negative]]:
            vector = self.vp.calc_vector_size_BOX(question[0], question[1], 4)
            self.assertEqual(vector, answer, "incorrect calculations in calc_vector")
    
    def test_calc_vector_size_blank_frame(self):
        start_blank = [self.vp.BLANK_FRAME, [9, 87, 65, 43]]
        end_blank = [[12, 34, 56, 78], self.vp.BLANK_FRAME]
        all_blank = [self.vp.BLANK_FRAME, self.vp.BLANK_FRAME]
        start_answer = [[9, 87, 65, 43], [9, 87, 65, 43], [9, 87, 65, 43], [9, 87, 65, 43]]
        end_answer = [[12, 34, 56, 78], [12, 34, 56, 78], [12, 34, 56, 78], [12, 34, 56, 78]]
        all_answer = [self.vp.BLANK_FRAME, self.vp.BLANK_FRAME, self.vp.BLANK_FRAME, self.vp.BLANK_FRAME]
        for question, answer in [[start_blank, start_answer], [end_blank, end_answer], [all_blank, all_answer]]:
            vector = self.vp.calc_vector_size_BOX(question[0], question[1], 4)
            self.assertEqual(vector, answer, "incorrect handling of blank frames in calc_vector")

    def test_blur_blank_frame(self):
        img = cv.imread(self.image_path)
        blurred_img = self.vp.blur_frame(img, [self.vp.BLANK_FRAME], r=10)  # shouldn't be blurred at all
        self.assertEqual(img.tobytes(), blurred_img.tobytes(), "blur_frame incorrectly blurring a blank frame")

    def test_img_to_bytes(self):
        file_path = "test.jpg"
        img = cv.imread(self.image_path)    # read in test image
        cv.imwrite(file_path, img)      # write out the test image to disk
        f = open(file_path, "rb")
        self.assertEqual(self.vp.img_to_bytes(img), f.read())   # compare converted bytes to direct read-from-disk bytes
        f.close()
        os.remove("test.jpg")

if __name__ == "__main__":
    unittest.main()
