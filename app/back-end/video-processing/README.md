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
The webserver needs to know where to look for video files when it receives a processing request from the front end. It looks for an environment variable named `PRIVACYPAL_VIDEO_DIRECTORY` for this.
You can set such an environment variable in your `~/.bashrc` file or if you want a session-only environment variable, use `export` in your current bash session:
```bash
export PRIVACYPAL_VIDEO_DIRECTORY=/tmp/privacypal
```

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

Now we can either run the module as a standalone dev server or serve the application with a separate production server such as Gunicorn.

#### Running a dev server
To run the module as a dev server, simply navigate to `app/back-end/video-processing/` in your terminal and run
```bash
python3 -m flask --app server run
```

#### Running a prod server
To run the module as a production server, we need to use a WSGI (web server gateway interface). In an example here we will be using Gunicorn. Navigate to `app/back-end/video-processing/`, then ensure Gunicorn is installed and then point to the `server.py` script:
```bash
pip install gunicorn==21.2.0
python3 -m gunicorn -b 0.0.0.0:5000 'server:app'
```
Alternatively, run `run_server.sh`:
```bash
bash run_server.sh
```
This command binds the server to 0.0.0.0 on port 5000 and runs `app` from `server.py`. You can use any python WSGI server, Gunicorn is simply chosen here for example for its lightweight and simple deployment as well as the ability to easily handle more concurrent requests by specifying a number of worker threads with `-w <num>`.
