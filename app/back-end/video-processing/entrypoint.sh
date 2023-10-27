#!/bin/sh
set -xe
export PRIVACYPAL_INPUT_VIDEO_DIR="/opt/privacypal/videos/input_videos"
export PRIVACYPAL_OUT_VIDEO_DIR="/opt/privacypal/videos/out_video"
if [ ! -d $PRIVACYPAL_INPUT_VIDEO_DIR ] || [ ! -d $PRIVACYPAL_OUT_VIDEO_DIR ]; then
    echo "[SEVERE][$(date)]: $PRIVACYPAL_INPUT_VIDEO_DIR and $PRIVACYPAL_OUTPUT_VIDEO_DIR must exist."
    exit 1
fi
exec python3 -m gunicorn server:app
