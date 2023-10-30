import unittest, sys, os
from flask import Flask, request

# add server.py's directory to sys path and import it
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../app/back-end/video-processing")))

# set temporary environment variables (will be automatically deleted when the session ends)
os.environ["PRIVACYPAL_INPUT_VIDEO_DIR"] = f"{os.getcwd()}/tests/back-end"
os.environ["PRIVACYPAL_OUT_VIDEO_DIR"] = f"{os.getcwd()}/tests/back-end"

from server import app  # finally, import our flask server

class ServerTest(unittest.TestCase):
    app: Flask

    def setUp(self):
        self.app = app
        self.app.testing = True
        self.client = self.app.test_client()
    
    def test_process_video_file_not_found(self):
        route = "/process_video"
        with self.client as c:
            response = c.post(route, data="blahblahblah invalid file")
            self.assertEqual(b"Error: file not found", response.data)
            self.assertEqual(200, response.status_code)

    def test_process_video_file_found(self):
        route = "/process_video"
        with self.client as c:
            response = c.post(route, data="1.mp4")
            self.assertEqual(b"Success: file exists", response.data)
            self.assertEqual(200, response.status_code)

    def test_process_video_method_not_allowed(self):
        route = "/process_video"
        with self.client as c:
            for method in [c.get, c.put, c.delete, c.trace, c.patch]:
                response = method(route)
                self.assertEqual(405, response.status_code)

    def test_health(self):
        route = "/health"
        with self.client as c:
            response = c.get(route)
            # response data = b"{someKey:someValue, someKey2: someValue2}",
            # to convert to python dict and check values we convert to string,
            # cut off the binary 'b' and quotes and cast to dict
            json = dict(str(response.data)[2:-1])
            self.assertEqual({}, json)
            self.assertEqual(200, response.status_code)

    def test_health_method_not_allowed(self):
        route = "/health"
        with self.client as c:
            for method in [c.put, c.post, c.delete, c.trace, c.patch]:
                response = method(route)
                self.assertEqual(405, response.status_code)

if __name__ == "__main__":
    unittest.main()
