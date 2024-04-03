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
import { useEffect, useState } from "react";

export interface MediaRecorderHook {
  status: string;
  startRecording: () => void;
  stopRecording: () => void;
  mediaBlobUrl?: string;
  previewStream: MediaStream | null;
}

/**
 * The default media recorder hook. This is used during SSR.
 * @returns The default media recorder hook.
 */
const defaultMediaRecorderHook = (): MediaRecorderHook => {
  return {
    status: "idle",
    startRecording: () => {},
    stopRecording: () => {},
    mediaBlobUrl: "",
    previewStream: null,
  };
};

interface MediaRecorderProps {
  frameRate: number;
  onStop: (_: string, blob: Blob) => void;
}

/**
 * A wrapper to the `react-media-recorder-2` hook that makes it SRR-safe. It will dynamically import the hook only in a browser/edge context.
 * @param props The framerate and `onStop` callback for the media recorder.
 * @returns The protected media recorder hook.
 */
export const useMediaRecorder = ({ frameRate, onStop }: MediaRecorderProps) => {
  const [hook, setHook] = useState<MediaRecorderHook>(
    defaultMediaRecorderHook(),
  );

  useEffect(() => {
    // check for browser context
    const isBrowser: boolean = typeof window !== "undefined";
    const workerCompatible: boolean = isBrowser && window.Worker !== undefined;

    const importMediaRecorder = async () => {
      // import the media recorder hook only if it is a browser context
      if (workerCompatible) {
        const { useReactMediaRecorder } = await import(
          "react-media-recorder-2"
        );

        // prepare the hook as usual using the params passed from the client
        const mediaRecorderState = useReactMediaRecorder({
          video: { frameRate },
          onStop,
        });
        setHook(mediaRecorderState);
      }
    };
    importMediaRecorder();
  }, []);

  return hook;
};
