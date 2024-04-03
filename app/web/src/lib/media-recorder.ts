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
