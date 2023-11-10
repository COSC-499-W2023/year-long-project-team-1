#!/bin/sh

set -e

export PRIVACYPAL_INPUT_VIDEO_DIR=${PRIVACYPAL_INPUT_VIDEO_DIR:-/opt/privacypal/input_videos}
export PRIVACYPAL_OUTPUT_VIDEO_DIR=${PRIVACYPAL_OUTPUT_VIDEO_DIR:-/opt/privacypal/output_videos}

if [ ! -d "$PRIVACYPAL_INPUT_VIDEO_DIR" ] || [ ! -d "$PRIVACYPAL_OUTPUT_VIDEO_DIR" ]; then
    echo "[SEVERE][$(date)]: $PRIVACYPAL_INPUT_VIDEO_DIR and $PRIVACYPAL_OUTPUT_VIDEO_DIR must exist."
    exit 1
fi

exec python3 -m uvicorn --host $HOST --port $PORT server:app
