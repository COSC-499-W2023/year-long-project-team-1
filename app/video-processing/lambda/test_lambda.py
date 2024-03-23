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

from unittest import TestCase, mock
from unittest.mock import MagicMock
import boto3
import moto
import json
import os

# Mocks
mocked_process = MagicMock()

# flake8: noqa
from lambda_fn import lambda_handler


@moto.mock_aws
@mock.patch('lambda_fn.VideoProcessor.process', mocked_process)
class TestProcessingLambda(TestCase):
    """
    Test class for video processing lambda.
    """
    def setUp(self) -> None:
        """
        Create mocked resources for use during tests.
        """
        # Set up test utilities
        self.test_event_file_path = os.environ.get("TEST_EVENT_PATH", "resources/sample_event.json")
        self.mocked_s3_resource = {
            "client": boto3.resource("s3"),
            "buckets": ["input-video-bucket","output-video-bucket" ],
            "file_key": os.environ.get("TEST_FILE_NAME", "username-recorded-20240223T193522")
        }

        # Set up S3 bucket
        s3_client = self.mocked_s3_resource["client"]

        for bucket in self.mocked_s3_resource["buckets"]:
            s3_client.create_bucket(Bucket=bucket,
                               CreateBucketConfiguration={"LocationConstraint": "ca-central-1"})

        with open(self.test_event_file_path, "rb") as file:
            s3_client.Object(
                self.mocked_s3_resource["buckets"][0],
                f"{self.mocked_s3_resource["file_key"]}.mp4"
            ).put(Body=file, Metadata={'regions': '[]', 'blurfaces': 'true'})

    def tearDown(self) -> None:
        """
        Clean up test resources after each test to ensure clean states.
        """
        s3_client = self.mocked_s3_resource["client"]

        for bucket in self.mocked_s3_resource["buckets"]:
            bucket = s3_client.Bucket(bucket)

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

    def test_video_processor_should_be_called(self):
        filename = self.mocked_s3_resource["file_key"]
        tmp_dir = os.environ.get("TMP_DIRECTORY", "resources")

        event = self.load_test_event()

        result = lambda_handler(event, context=None)
        assert result['statusCode'] == 200 and result['body'] == '"Success!"'

        mocked_process.assert_called_with(f"{tmp_dir}/{filename}.mp4", f"{tmp_dir}/{filename}-processed.mp4", [], True)

    def test_output_video_should_be_uploaded(self):
        filename = self.mocked_s3_resource["file_key"]
        tmp_dir = os.environ.get("TMP_DIRECTORY", "resources")

        event = self.load_test_event()

        result = lambda_handler(event, context=None)
        assert result['statusCode'] == 200 and result['body'] == '"Success!"'

        mocked_process.assert_called_with(f"{tmp_dir}/{filename}.mp4", f"{tmp_dir}/{filename}-processed.mp4", [], True)

        s3_client, bucket = self.mocked_s3_resource["client"], self.mocked_s3_resource["buckets"][1]
        outputFile = s3_client.Object(bucket_name=bucket, key=f"{filename}.mp4")
        
        # Validate output video
        resp = outputFile.get()
        assert resp['TagCount'] == 1

        resp = boto3.client('s3').get_object_tagging(
            Bucket=bucket, Key=f"{filename}.mp4"
        )
        tagSet = resp["TagSet"]
        assert tagSet == [{'Key': 'privacypal-status', 'Value': 'UnderReview'}]

