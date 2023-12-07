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
  // const router = useRouter();

  const videoFilename = videoId.replace(".mp4", "") + "-processed.mp4";

  const handleAccept = async () => {
    // TODO: pass apptId value
    // TODO: handle fetch error
    await fetch("/api/video/review", {
      method: "POST",
      body: JSON.stringify({
        "apptId": "1",
        "filename": videoId,
        "action": "accept"
      })
    }).then((res)=>{
      if(res.ok){
        alert("Video is successfully upload to S3.");
      }else{
        alert("Error happened. Could not upload to S3.");
      }
    }).catch((e) => {
      console.log("Error: ", e);
      alert("Error happened. Could not save video.");
    });
  };

  const handleReject = async() => {
    // TODO: pass apptId value
    // TODO: handle fetch error
    const res = await fetch("/api/video/review", {
      method: "POST",
      body: JSON.stringify({
        "apptId": "1",
        "filename": videoId,
        "action": "reject"
      })
    }).then((res)=>{
      if(res.ok){
        alert("Video is successfully removed.");
      }else{
        alert("Error happened. Could not remove video.");
      }
    }).catch((e) => {
      console.log("Error: ", e);
      alert("Error happened. Could not remove video.");
    });
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
            <Button icon={<CheckIcon />} onClick={handleAccept}>
              This looks good
            </Button>
          </ActionListItem>
          <ActionListItem>
            <Button
              variant="danger"
              icon={<TimesIcon />}
              onClick={handleReject}
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
