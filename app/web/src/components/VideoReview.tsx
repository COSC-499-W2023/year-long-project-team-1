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
  Spinner,
} from "@patternfly/react-core";
import { CheckIcon, TimesIcon } from "@patternfly/react-icons";
import style from "@assets/style";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

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
  apptId: number;
}

export const VideoReview = ({ apptId }: VideoReviewProps) => {
  // const router = useRouter();
  const [videoExists, setVideoExists] = useState(false);
  const [loading, setLoading] = useState(true);

  // check if the video exists (needed if the user navigated directly to this route)
  useEffect(() => {
    const checkIfVideoExists = async () => {
      const res = await fetch(`/api/video?apptId=${apptId}`);
      if (!res.ok) {
        setVideoExists(false);
      } else if (res.ok) {
        setVideoExists(true);
      }
      setLoading(false);
    };
    checkIfVideoExists();
  }, []);

  const handleVideoRequest = async (action: string) => {
    const successMsg =
      action == "accept"
        ? "Video is successfully upload to S3."
        : "Video is successfully removed.";
    const errorMsg =
      action == "accept"
        ? "Error happened. Could not upload to S3."
        : "Error happened. Could not remove video.";

    await fetch("/api/video/review", {
      method: "POST",
      body: JSON.stringify({
        apptId, // FIXME: pass apptId value
        action: action,
      }),
    })
      .then((res) => {
        if (res.ok) {
          alert(successMsg);
        } else {
          alert(errorMsg);
        }
      })
      .catch((e) => {
        // TODO: implement fetch error user flow
        console.log("Error: ", e);
        alert(errorMsg);
      });
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

  if (loading) {
    return <Spinner size="lg" aria-label="Video review is loading" />;
  }

  if (!videoExists) {
    return (
      <Card style={style.card}>
        <CardTitle component="h1">Video not found</CardTitle>
        <CardBody>
          <Link href="/dashboard">Go back to your dashboard</Link>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card style={style.card}>
      <CardTitle component="h1">Review Your Submission</CardTitle>
      <CardBody>
        <video controls autoPlay={false} style={videoReviewStyle.videoPlayer}>
          <source src={`/api/video?apptId=${apptId}`} />
        </video>
        <ActionList style={style.actionList}>
          <ActionListItem>
            <Button
              aria-label="Accept video"
              icon={<CheckIcon />}
              onClick={getHandler("accept")}
            >
              This looks good
            </Button>
          </ActionListItem>
          <ActionListItem>
            <Button
              aria-label="Reject video"
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
