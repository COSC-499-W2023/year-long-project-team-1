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

import Loading from "@app/loading";
import style from "@assets/style";
import {
  ActionList,
  ActionListItem,
  Alert,
  Card,
  CardBody,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  Panel,
  PanelHeader,
  PanelMain,
  PanelMainBody,
  Spinner,
  Title,
} from "@patternfly/react-core";
import { CheckIcon, TimesIcon } from "@patternfly/react-icons";
import { useEffect, useState } from "react";
import LoadingButton from "./form/LoadingButton";
import { CancelProcessingButton } from "./upload/CancelProcessingButton";
import { ErrorView } from "./ErrorView";

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
  apptId: number;
}

export const VideoReview = ({ videoId, apptId }: VideoReviewProps) => {
  const [error, setError] = useState<Error | undefined>();
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/video/processed?file=${videoId}`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((body) => setVideoSrc(body.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [videoId, setLoading, setError, setVideoSrc]);

  return (
    <Panel>
      <PanelHeader>
        <Title headingLevel={"h2"}>Review Your Submission</Title>
      </PanelHeader>
      <PanelMain>
        <PanelMainBody>
          {error ? (
            <ErrorView
              title={"Failed to retrieve the video"}
              message={error.message}
            />
          ) : loading ? (
            <EmptyState>
              <EmptyStateHeader
                titleText={"Retrieving the video"}
                headingLevel="h4"
                icon={<EmptyStateIcon icon={Spinner} />}
              />
            </EmptyState>
          ) : (
            <video
              controls
              autoPlay={false}
              style={videoReviewStyle.videoPlayer}
            >
              <source src={videoSrc} />
            </video>
          )}
        </PanelMainBody>
      </PanelMain>
    </Panel>
  );
};

export default VideoReview;
