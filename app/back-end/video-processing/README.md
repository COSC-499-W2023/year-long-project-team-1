# Back End
Created with Python, opencv, and AWS Rekognition

## Requirements
 - Python v3.8.10 with the following packages:
    - boto3 v1.28.64
    - botocore v1.31.64
    - numpy v1.24.4
    - opencv-python v4.8.1.78
    - flask v3.0.0
 - the AWS CLI (for logging in with SSO)

A list of all Python packages is also in `video-processing/requirements.txt`.

## Configuration
The run_server() method needs to know where to look for video files when it receives a processing request from the front end. It looks for an environment variable named `PRIVACYPAL_VIDEO_DIRECTORY` for this.

## Running the video processing server
Note: the following login process is annoying and burdensome, however it is what the client recommended to us in an email. I will be looking into other/better ways of configuring access to AWS.

First, we need to login to AWS services. Run this command:

```bash
aws configure sso
```
to configure a single-sign on (SSO) session. Input your start url (should look something like `https://ubc-cicsso.awsapps.com/start/`) and the other details. Make sure the region is `ca-central-1`. Finally, ensure that when it asks for `CLI profile name` that you enter "paul" as the Python script looks for that profile when loading. Now, if you already have an SSO profile and haven't logged in OR your current SSO profile has timed out, run
```bash
aws sso login --profile paul
```
Follow the directions in your browser to allow the script access to AWS. Congratulations! You are now authenticated.

Now to run the video processing server, simply navigate to `app/back-end/video-processing/` in your terminal and run
```bash
python3 video_processor.py
```