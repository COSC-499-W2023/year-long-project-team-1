"use client";
import { CSS } from "@lib/utils";
import { Button } from "@patternfly/react-core";
import { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder-2";

/* Support functions */

async function initMediaStream(stateHandler: (stream: MediaStream) => void) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  // no need to only get video tracks since the <video> preview can be muted i.e. capture audio without playing it back
  stateHandler(stream);
}

function destroyMediaStream(stream?: MediaStream | null) {
  if (!stream) return;
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

function recordButtonText(status: string): string {
  switch (status) {
    case "recording":
      return "Stop recording";
    case "stopped":
      return "Re-record";
    case "idle":
    default:
      return "Start recording";
  }
}
/* Components */

interface LiveFeedProps {
  stream?: MediaStream | null;
  style?: CSS;
}

const LiveFeed = ({ stream, style }: LiveFeedProps) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
    }
  }, [stream]);
  return stream ? (
    <video ref={ref} style={style} autoPlay disablePictureInPicture muted />
  ) : null;
};

interface MediaRecorderProps {
  frameRate: number;
  style?: CSS;
  videoPlayerStyle?: CSS;
  onStop: (_: string, blob: Blob) => void;
}

export const ClientSideMediaRecorder = ({
  frameRate,
  style,
  videoPlayerStyle,
  onStop,
}: MediaRecorderProps) => {
  const [previewStream, setPreviewStream] = useState<MediaStream>();

  useEffect(() => {
    initMediaStream(setPreviewStream);

    // destroy on unmount
    return () => {
      destroyMediaStream(previewStream);
    };
  }, []);

  const {
    status: recordingStatus, // renamed for semantic clarity
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream: liveStream, // rename to liveStream as we have a different previewStream object for an actual preview
  } = useReactMediaRecorder({
    video: { frameRate },
    onStop,
  });

  const handleRecordClick = (_: React.MouseEvent<HTMLButtonElement>) => {
    if (recordingStatus !== "recording") {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <div style={style}>
      {recordingStatus === "stopped" ? (
        // if status is stopped, we'll be displaying the recorded video so disable the live feed
        <video src={mediaBlobUrl} controls style={videoPlayerStyle} />
      ) : (
        <LiveFeed
          stream={recordingStatus === "recording" ? liveStream : previewStream}
          style={videoPlayerStyle}
        />
      )}
      <Button
        variant="danger"
        onClick={handleRecordClick}
        aria-label="Record video"
      >
        {recordButtonText(recordingStatus)}
      </Button>
    </div>
  );
};
