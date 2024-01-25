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
  apptId: string;
}

export const VideoReview = ({ videoId, apptId }: VideoReviewProps) => {
  const router = useRouter();

  const videoFilename = videoId.replace(".mp4", "") + "-processed.mp4";

  const handleVideoRequest = async (action: string) => {
    const successMsg =
      action == "accept"
        ? "Video is successfully upload to S3."
        : "Video is successfully removed.";
    const errorMsg =
      action == "accept"
        ? "Error happened. Could not upload video."
        : "Error happened. Could not remove video.";

    try {
      const res = await fetch("/api/video/review", {
        method: "POST",
        body: JSON.stringify({
          apptId: apptId, // FIXME: pass apptId value
          filename: videoId,
          action: action,
        }),
      });

      if (!res.ok) {
        throw Error("Upload failed with status: " + res.statusText);
      }

      router.push(`/user/appointment?id=${apptId}`);
    } catch (err: any) {
      alert(errorMsg);
      router.push(`/upload?id=${apptId}`);
      console.error(err.message);
    }
  };

  const getHandler = (action: string) => {
    switch (action) {
      case "accept":
        return async () => await handleVideoRequest("accept");
      case "reject":
        return async () => await handleVideoRequest("reject");
      default:
        throw Error(`Unknow action: ${action}`);
    }
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
            <Button icon={<CheckIcon />} onClick={getHandler("accept")}>
              This looks good
            </Button>
          </ActionListItem>
          <ActionListItem>
            <Button
              variant="danger"
              icon={<TimesIcon />}
              onClick={getHandler("reject")}
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
