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

import os
import json
import botocore
import boto3
import moto
from unittest import TestCase
from unittest import mock
from testfixtures.mock import call
from testfixtures import Replacer, compare
from testfixtures.popen import MockPopen
import subprocess as sp
from lambda_fn import lambda_handler, get_tmp_dir, convert

# Mocks
mocked_convert = mock.MagicMock()


@moto.mock_aws
@mock.patch('lambda_fn.convert', mocked_convert)
class TestConversionLambda(TestCase):
    """
    Test class for video conversion lambda.
    """

    def setUp(self) -> None:
        """
        Create mocked resources for use during tests.
        """
        # Set up test utilities
        self.test_event_file_path = os.environ.get("TEST_EVENT_PATH", "resources/sample_event.json")
        self.mocked_s3_resource = {
            "client": boto3.resource("s3", region_name="ca-central-1"),
            "bucket": "input-video-bucket",
            "file_key": os.environ.get("TEST_FILE_NAME", "username-recorded-20240223T193522")
        }

        # Set up S3 bucket
        s3Client = self.mocked_s3_resource["client"]
        s3Client.create_bucket(Bucket=self.mocked_s3_resource["bucket"],
                               CreateBucketConfiguration={"LocationConstraint": "ca-central-1"})
        s3Client.Object(self.mocked_s3_resource["bucket"],
                        f"{self.mocked_s3_resource["file_key"]}.webm").put(Body="video-content")

    def tearDown(self):
        """
        Clean up test resources after each test to ensure clean states.
        """

        s3_client = self.mocked_s3_resource["client"]
        bucket = s3_client.Bucket(self.mocked_s3_resource["bucket"])

        # Remove all files and delete the bucket
        for f in bucket.objects.all():
            f.delete()
        bucket.delete()

    def load_test_event(self):
        """
        Load test events from local filesystem.
        """
        with open(self.test_event_file_path, "r", encoding="UTF-8") as f:
            event = json.load(f)
            return event

    def test_convert_handler_should_be_called(self):
        filename = self.mocked_s3_resource["file_key"]
        tmp_dir = os.environ.get("TMP_DIRECTORY", "resources")

        event = self.load_test_event()
        lambda_handler(event, context=None)

        mocked_convert.assert_called_with(f"{tmp_dir}/{filename}.webm", f"{tmp_dir}/{filename}.mp4")

    def test_input_video_should_be_deleted(self):
        filename = self.mocked_s3_resource["file_key"]
        tmp_dir = os.environ.get("TMP_DIRECTORY", "resources")

        event = self.load_test_event()
        lambda_handler(event, context=None)

        mocked_convert.assert_called_with(f"{tmp_dir}/{filename}.webm", f"{tmp_dir}/{filename}.mp4")

        s3Client, bucket = self.mocked_s3_resource["client"], self.mocked_s3_resource["bucket"]

        inputFile = s3Client.ObjectSummary(bucket_name=bucket, key=f"{filename}.webm")
        try:
            inputFile.get()
        except botocore.exceptions.ClientError as e:
            assert e.response['Error']['Code'] == "NoSuchKey"
        else:
            # Should not happen
            raise

    def test_output_video_should_be_uploaded(self):
        filename = self.mocked_s3_resource["file_key"]
        tmp_dir = os.environ.get("TMP_DIRECTORY", "resources")

        event = self.load_test_event()
        lambda_handler(event, context=None)

        mocked_convert.assert_called_with(f"{tmp_dir}/{filename}.webm", f"{tmp_dir}/{filename}.mp4")

        s3Client, bucket = self.mocked_s3_resource["client"], self.mocked_s3_resource["bucket"]

        inputFile = s3Client.Object(bucket_name=bucket, key=f"{filename}.webm")
        try:
            inputFile.get()
        except botocore.exceptions.ClientError as e:
            assert e.response['Error']['Code'] == "NoSuchKey"
        else:
            # Should not happen
            raise

        outputFile = s3Client.ObjectSummary(bucket_name=bucket, key=f"{filename}.mp4")
        resp = outputFile.get()
        assert resp["ResponseMetadata"]["HTTPHeaders"]["content-type"] == "binary/octet-stream"


class TestLamdaUtil(TestCase):
    def setUp(self) -> None:
        self.old_tmp_dir = os.environ.pop("TMP_DIRECTORY", None)
        # Mock subprocess
        self.Popen = MockPopen()
        self.r = Replacer()
        self.r.replace('lambda_fn.sp.Popen', self.Popen)
        self.addCleanup(self.r.restore)

    def tearDown(self) -> None:
        if self.old_tmp_dir is None:
            return
        os.environ["TMP_DIRECTORY"] = self.old_tmp_dir

    def test_get_tmp_dir_should_return_default(self):
        assert get_tmp_dir() == "/tmp"

    def test_get_tmp_dir_should_return_override(self):
        os.environ["TMP_DIRECTORY"] = "/some-path"
        assert get_tmp_dir() == "/some-path"

    def test_convert_should_invoke_ffmpeg(self):
        webm_filepath = "/tmp/a_file.web"
        mp4_filepath = "/tmp/a_file.mp4"

        # set up
        self.Popen.set_command(f'ffmpeg -y -i {webm_filepath} {mp4_filepath}', stdout=b'o', stderr=b'e')

        convert(webm_filepath, mp4_filepath)

        # Assert calls
        process = call.Popen(["ffmpeg", "-y", "-i", webm_filepath, mp4_filepath], stdout=sp.PIPE, stderr=sp.STDOUT)
        compare(self.Popen.all_calls, expected=[
            process,
            process.wait()
        ])
