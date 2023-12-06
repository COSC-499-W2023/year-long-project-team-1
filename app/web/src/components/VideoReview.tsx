/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use client";

import {
  ActionList,
  ActionListItem,
  Button,
  Card,
  CardBody,
  CardTitle,
} from "@patternfly/react-core";
import { CheckIcon, TimesIcon } from "@patternfly/react-icons";
import Link from "next/link";
import style from "@assets/style";
import { useRouter } from "next/navigation";

export const videoReviewStyle = {
  ...style,
  videoPlayer: {
    width: "100%",
    aspectRatio: "16 / 9",
    backgroundColor: "black",
    margin: "1rem 0",
    borderRadius: "0.25rem",
  },
};

interface VideoReviewProps {
  videoId: string;
}

export const VideoReview = ({ videoId }: VideoReviewProps) => {
  const router = useRouter();

  const videoFilename = videoId.replace(".mp4", "") + "-processed.mp4";

  const handleAccept = () => {
    // TODO: upload video to S3 with Server Action
    alert("TODO: upload video to S3 with Server Action");
  };

  const handleReject = () => {
    router.push("/upload");
  };

  return (
    <Card style={style.card}>
      <CardTitle component="h1">Review Your Submission</CardTitle>
      <CardBody>
        <video controls autoPlay={false} style={videoReviewStyle.videoPlayer}>
          <source src={`/api/video/processed?file=${videoFilename}`} />
        </video>
        <ActionList style={style.actionList}>
          <ActionListItem>
            <Button icon={<CheckIcon />} onClick={() => handleAccept()}>
              This looks good
            </Button>
          </ActionListItem>
          <ActionListItem>
            <Button
              variant="danger"
              icon={<TimesIcon />}
              onClick={() => handleReject()}
            >
              Cancel
            </Button>
          </ActionListItem>
        </ActionList>
      </CardBody>
    </Card>
  );
};

export default VideoReview;
