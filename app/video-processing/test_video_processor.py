import unittest, sys, os, cv2 as cv, numpy as np
from video_processor import VideoProcessor

os.environ["AWS_ACCESS_KEY_ID"] = "some-key-id"
os.environ["AWS_SECRET_ACCESS_KEY"] = "some-access-key"
os.environ["AWS_SESSION_TOKEN"] = "some-session-token"
os.environ["AWS_DEFAULT_REGION"] = "ca-central-1"

class VideoProcessorTest(unittest.TestCase):
    vp: VideoProcessor
    video_path: str
    fps: int
    width: int
    height: int
    num_frames: int

    def setUp(self):
        self.vp = VideoProcessor()
        self.video_path = "./app/video-processing/resources/test.mp4"
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

    def test_img_to_bytes(self):
        file_path = "test.jpg"
        img = np.zeros((64, 64, 3), np.uint8)   # 64x64 black opencv image
        cv.imwrite(file_path, img)      # write out a black 64x64 image to disk
        f = open(file_path, "rb")
        self.assertEqual(self.vp.img_to_bytes(img), f.read())   # compare converted bytes to direct read-from-disk bytes
        f.close()
        os.remove("test.jpg")

if __name__ == "__main__":
    unittest.main()
