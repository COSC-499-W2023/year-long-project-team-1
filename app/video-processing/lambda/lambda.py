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
OUTPUT_BUCKET = os.environ.get("OUTPUT_BUCKET", "privacypal-videos")


def parse_metadata(metadata: str) -> 'list[list[int]]':
    if metadata == "null":
        return []
    raw_list = [int(i) for i in metadata.split(",")]    # should be something like [0, 0, 50, 50, 35, 35, 100, 100]
    region_list, tmp = [], []
    for i in range(len(raw_list)):
        tmp.append(raw_list[i])
        if (i + 1) % 4 == 0:
            region_list.append(tmp)
            tmp = []
    return region_list


def lambda_handler(event, context):
    s3 = boto3.client("s3")  # init s3 client

    # get trigger event values
    s3event = event["Records"][0]["s3"]
    bucket = s3event["bucket"]["name"]
    filekey = urllib.parse.unquote_plus(s3event["object"]["key"],
                                        encoding="utf-8")

    # download s3object to local /tmp folder
    s3object = s3.get_object(Bucket=bucket, Key=filekey)
    data = s3object.get("Body").read()
    input_filepath = f"/tmp/{filekey}"
    output_filepath = f"{input_filepath[:-4]}-processed{input_filepath[-4:]}"
    with open(input_filepath, "wb") as f:
        f.write(data)

    # get region metadata. if none, regions = []
    regions = parse_metadata(s3object.get("Metadata")["regions"])

    # process video
    vp = VideoProcessor()
    vp.process(input_filepath, output_filepath, regions)

    s3.upload_file(output_filepath, OUTPUT_BUCKET,
                   f"{filekey[:-4]}-processed{filekey[-4:]}",
                   ExtraArgs={"Tagging": "privacypal-status=UnderReview"})

    return {
        'statusCode': 200,
        'body': json.dumps('Success!')
    }
