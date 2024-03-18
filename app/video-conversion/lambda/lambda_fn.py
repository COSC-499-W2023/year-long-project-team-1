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

import urllib
import boto3
import subprocess as sp
import os


def lambda_handler(event, context):
    s3event = event["Records"][0]["s3"]
    bucket = s3event["bucket"]["name"]
    webm_key = urllib.parse.unquote_plus(s3event["object"]["key"], encoding="utf-8")

    s3 = boto3.client("s3")
    metadata = s3.head_object(Bucket=bucket, Key=webm_key)["Metadata"]   # get metadata of .webm video

    webm_filepath = f"{get_tmp_dir()}/{webm_key}"
    s3.download_file(Bucket=bucket, Key=webm_key, Filename=webm_filepath)
    mp4_key = f"{webm_key[:-5]}.mp4"     # same filename just with .mp4 extension
    mp4_filepath = f"{get_tmp_dir()}/{mp4_key}"

    # convert the video from .webm to .mp4
    convert(webm_filepath, mp4_filepath)

    # upload and cleanup
    s3.upload_file(Bucket=bucket, Key=mp4_key, Filename=mp4_filepath, ExtraArgs={"Metadata": metadata})
    s3.delete_object(Bucket=bucket, Key=webm_key)


def convert(webm_filepath, mp4_filepath):
    p = sp.Popen(["ffmpeg", "-y", "-i", webm_filepath, mp4_filepath], stdout=sp.PIPE, stderr=sp.STDOUT)
    p.wait()


def get_tmp_dir():
    return os.environ.get("TMP_DIRECTORY", "/tmp")
