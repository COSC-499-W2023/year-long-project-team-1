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
    method_not_allowed = b'<!doctype html>\n<html lang=en>\n<title>405 Method Not Allowed</title>\n<h1>Method Not Allowed</h1>\n<p>The method is not allowed for the requested URL.</p>\n'

    def setUp(self):
        self.app = app
    
    def test_process_video(self):
        route = "/process_video"
        with self.app.test_client() as c:
            for method in [c.get, c.put, c.delete, c.trace, c.patch]:
                response = method(route)
                self.assertEqual(self.method_not_allowed, response.data)
                self.assertEqual(405, response.status_code)

            response = c.post(route, data="blahblahblah invalid file")
            self.assertEqual(b"Error: file not found", response.data)
            self.assertEqual(200, response.status_code)

            response = c.post(route, data="1.mp4")
            self.assertEqual(b"Success: file exists", response.data)
            self.assertEqual(200, response.status_code)

    def test_health(self):
        route = "/health"
        with self.app.test_client() as c:
            for method in [c.put, c.post, c.delete, c.trace, c.patch]:
                response = method(route)
                self.assertEqual(self.method_not_allowed, response.data)
                self.assertEqual(405, response.status_code)

            response = c.get(route)
            self.assertEqual(b"{}\n", response.data)
            self.assertEqual(200, response.status_code)

if __name__ == "__main__":
    unittest.main()
