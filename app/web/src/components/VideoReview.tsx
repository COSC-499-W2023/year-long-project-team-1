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
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
} from "@patternfly/react-core";
import { CheckIcon, TimesIcon } from "@patternfly/react-icons";
import style from "@assets/style";
import { redirectAfterReview } from "@app/actions";
import { useEffect, useState } from "react";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Loading from "@app/loading";
import LoadingButton from "./form/LoadingButton";

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
  const [actionMessage, setActionMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const handleVideoRequest = async (action: string) => {
    const successMsg =
      action == "accept"
        ? "Successfully accepted the video."
        : "Successfully rejected the video.";
    const errorMsg =
      action == "accept"
        ? "Failed to accept the video."
        : "Failed to reject the video.";

    await fetch("/api/video/review", {
      method: "POST",
      body: JSON.stringify({
        apptId: "1", // FIXME: pass apptId value
        filename: videoId,
        action: action,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setActionMessage(successMsg);
        } else {
          setActionMessage(errorMsg);
          setIsError(true);
        }
      })
      .catch((e) => {
        // TODO: implement fetch error user flow
        console.log("Error: ", e);
        setActionMessage(errorMsg);
        setIsError(true);
      });
    setTimeout(() => {
      redirectAfterReview();
    }, 2000);
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

  const [videoSrc, setVideoSrc] = useState<string>("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getUrl() {
      const response = await fetch(`/api/video/processed?file=${videoId}`, {
        method: "GET",
      });
      response.json().then((i) => {
        setVideoSrc(i["data"]);
        setLoading(false);
      });
    }
    getUrl();
  }, []);
  return (
    <Card style={style.card}>
      <CardTitle component="h1">Review Your Submission</CardTitle>
      <CardBody>
        {loading ? (
          <>
            <Loading />
            <p>Loading video data...</p>
          </>
        ) : (
          <video controls autoPlay={false} style={videoReviewStyle.videoPlayer}>
            <source src={videoSrc} />
          </video>
        )}
        <ActionList style={style.actionList}>
          <ActionListItem>
            <LoadingButton icon={<CheckIcon />} onClick={getHandler("accept")}>
              This looks good
            </LoadingButton>
          </ActionListItem>
          <ActionListItem>
            <LoadingButton
              variant="danger"
              icon={<TimesIcon />}
              onClick={getHandler("reject")}
            >
              Cancel
            </LoadingButton>
          </ActionListItem>
        </ActionList>
        {actionMessage === "" ? null : (
          <Alert
            variant={isError ? "danger" : "success"}
            title={actionMessage}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default VideoReview;
