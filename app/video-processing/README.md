# PrivacyPal Video Processing

Created with Python, opencv, and AWS Rekognition.

## REQUIREMENTS

- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) (for logging in with SSO)
- [Podman](https://podman.io/docs/installation) 4.7+


## BUILD

To the container image for the processing server, run:

```
make oci-build
```

## RUN

### Configure AWS SSO

First, access to AWS Rekcognition service is required. See [AWS SSO doc](https://docs.aws.amazon.com/cli/latest/userguide/sso-configure-profile-token.html) for more details.

```bash
aws configure sso
```

For maintainers, to configure a single-sign on (SSO) session:
- Input the start url: `https://ubc-cicsso.awsapps.com/start/` and the other details.
- Input the region is `ca-central-1`.
- Input the profile name for your credentials.
- Now, if you already have an SSO profile and haven't logged in or your current SSO profile has timed out, run:

    ```bash
    aws sso login --profile <profile-name>
    ```

Follow the directions in your browser to allow the server access to AWS. Congratulations! You are now authenticated.

**Note:** You might need to restart the server if the SSO session expires.


### Run production server container

To export the credentials for the processing server, run:

```bash
eval $(aws configure export-credentials --profile <your-profile> --format env)
```

This export necessary environment variables containing secrets to access AWS service.

To run a production server, run:

```bash
make run
```

## CONFIGURATIONS

PrivacyPal Video Processing service can be configured via the following environment variables:

## Configuration for AWS Credential

- `AWS_ACCESS_KEY_ID` **(Required)**: The access key for your AWS account.
- `AWS_SECRET_ACCESS_KEY` **(Required)**: The secret key for your AWS account.
- `AWS_DEFAULT_REGION` **(Required)**: The default AWS Region to use, for example, `ca-central-1`.

## Configuration for 

- `PRIVACYPAL_VIDEO_DIRECTORY`: The filesystem path for the directory containing videos. Default `/opt/privacypal/videos`.

## TESTING

### Requirements
 - Python 3.9
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


### Running tests

```bash
cd app/video-processing/ && python3 -m unittest discover -s .
```
