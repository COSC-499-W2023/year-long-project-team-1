import boto3
import json
import urllib
from video_processor import VideoProcessor
OUTPUT_BUCKET = "privacypal-output"  # should probably make this into an env variable for the container image build, this is just temp


def lambda_handler(event, context):
    s3 = boto3.client("s3")  # init s3 client

    # get trigger event values
    s3event = event["Records"][0]["s3"]
    bucket = s3event["bucket"]["name"]
    filekey = urllib.parse.unquote_plus(s3event["object"]["key"], encoding="utf-8")

    # download s3object to local /tmp folder
    s3object = s3.get_object(Bucket=bucket, Key=filekey)
    data = s3object.get("Body").read()
    input_filepath = f"/tmp/{filekey}"
    output_filepath = f"{input_filepath[:-4]}-processed{input_filepath[-4:]}"
    with open(input_filepath, "wb") as f:
        f.write(data)

    # process video
    vp = VideoProcessor()
    vp.process(input_filepath, output_filepath)

    s3.upload_file(output_filepath, OUTPUT_BUCKET, f"{filekey[:-4]}-processed{filekey[-4:]}")

    return {
        'statusCode': 200,
        'body': json.dumps('Success!')
    }
