import unittest, sys, os, requests, multiprocessing as mp, cv2 as cv, numpy as np, random

# add video_processing.py's directory to sys path and import it
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../app/back-end/video-processing")))
from video_processor import VideoProcessor

class VideoProcessorTest(unittest.TestCase):
    vp: VideoProcessor
    video_path: str
    fps: int
    width: int
    height: int
    num_frames: int

    def setUp(self):
        self.vp = VideoProcessor()
        self.video_path = "app/back-end/video-processing/videos/1.mp4"
        # hard-coded test values i retrieved from ffprobe for this ^ video
        self.fps = 25
        self.width = 1280
        self.height = 720
        self.num_frames = 132

    def test_blur_frame(self):
        pass

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

    def test_img_to_bytes(self):
        file_path = "tests/back-end/test.jpg"
        img = np.zeros((64, 64, 3), np.uint8)   # 64x64 black opencv image
        cv.imwrite(file_path, img)      # write out a black 64x64 image to disk
        f = open(file_path, "rb")
        self.assertEqual(self.vp.img_to_bytes(img), f.read())   # compare converted bytes to direct read-from-disk bytes
        f.close()

    def test_get_face(self):
        pass

    def server_test_unfinished(self):
        url = "http://127.0.0.1:5000"
        response = requests.post(url, "test")
        content = response.content.decode("utf-8")
        self.assertEqual(content, "Error: file not found")

if __name__ == "__main__":
    unittest.main()
    