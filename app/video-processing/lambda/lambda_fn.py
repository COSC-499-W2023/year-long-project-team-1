# Copyright [2023] [Privacypal Authors]
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import boto3
import json
import urllib
import os
from video_processor import VideoProcessor


def lambda_handler(event, context):
    s3 = boto3.client("s3")  # init s3 client

    # get trigger event values
    s3event = event["Records"][0]["s3"]
    bucket = s3event["bucket"]["name"]
    filekey = urllib.parse.unquote_plus(s3event["object"]["key"],
                                        encoding="utf-8")

    # download s3object to local tmp folder
    s3object = s3.get_object(Bucket=bucket, Key=filekey)
    data = s3object.get("Body").read()
    input_filepath = f"{get_tmp_dir()}/{filekey}"
    output_filepath = f"{input_filepath[:-4]}-processed{input_filepath[-4:]}"   # only locally named this, S3 output bucket will be `filekey`
    with open(input_filepath, "wb") as f:
        f.write(data)

    # get and parse metadata
    metadata = s3object.get("Metadata")
    regions = []
    for region in json.loads(metadata["regions"]):
        x, y = region["origin"]
        w, h = region["width"], region["height"]
        regions.append([x, y, w, h])
    blur_faces = metadata["blurfaces"] == "true"

    # process video
    vp = VideoProcessor()
    vp.process(input_filepath, output_filepath, regions, blur_faces)

    s3.upload_file(output_filepath, get_output_bucket(),
                   f"{filekey}",
                   ExtraArgs={"Tagging": "privacypal-status=UnderReview"})

    return {
        'statusCode': 200,
        'body': json.dumps('Success!')
    }


def get_tmp_dir():
    return os.environ.get("TMP_DIRECTORY", "/tmp")


def get_output_bucket():
    return os.environ.get("OUTPUT_BUCKET", "privacypal-videos")
