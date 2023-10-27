#!/bin/bash

if [ -d $PRIVACYPAL_INPUT_VIDEO_DIR ] && [ -d $PRIVACYPAL_OUT_VIDEO_DIR ]; then
    python3 -m gunicorn server:app
else
    echo Our in/out directories do not exist, exiting...
fi
