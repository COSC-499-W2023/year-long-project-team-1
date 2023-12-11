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

  const handleVideoRequest = async (action: string) => {
    // TODO: pass apptId value
    // TODO: implement fetch error user flow
    const successMsg = action == "accept" ? "Video is successfully upload to S3." : "Video is successfully removed.";
    const errorMsg = action == "accept" ? "Error happened. Could not upload to S3." : "Error happened. Could not remove video.";
    await fetch("/api/video/review", {
      method: "POST",
      body: JSON.stringify({
        "apptId": "1",
        "filename": videoId,
        "action": action
      })
    }).then((res)=>{
      if(res.ok){
        alert(successMsg);
      }else{
        alert(errorMsg);
      }
    }).catch((e) => {
      console.log("Error: ", e);
      alert(errorMsg);
    });
  }

  return (
    <Card style={style.card}>
      <CardTitle component="h1">Review Your Submission</CardTitle>
      <CardBody>
        <video controls autoPlay={false} style={videoReviewStyle.videoPlayer}>
          <source src={`/api/video/processed?file=${videoFilename}`} />
        </video>
        <ActionList style={style.actionList}>
          <ActionListItem>
            <Button icon={<CheckIcon />} onClick={async ()=>handleVideoRequest("accept")}>
              This looks good
            </Button>
          </ActionListItem>
          <ActionListItem>
            <Button
              variant="danger"
              icon={<TimesIcon />}
              onClick={async ()=>handleVideoRequest("reject")}
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
