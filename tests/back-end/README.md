# Testing the back-end video processing server

## Requirements
 - Python 3.8
    - boto3 v1.28.64
    - botocore v1.31.64
    - numpy v1.24.4
    - opencv-python-headless v4.8.1.78
    - flask v3.0.0
    - gunicorn v21.2.0

You can installl these dependencies by navigating to `app/video-processing` and running:
```bash
pip install -r requirements.txt
```


## Running tests
Navigate to the repository's root directory and run:
```bash
python3 -m unittest discover -s ./tests/back-end
```
