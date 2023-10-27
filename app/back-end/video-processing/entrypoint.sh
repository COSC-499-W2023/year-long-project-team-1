#!/bin/sh

if [ ! -d $PRIVACYPAL_INPUT_VIDEO_DIR ] || [ ! -d $PRIVACYPAL_OUT_VIDEO_DIR ]; then
    echo Our in/out directories do not exist, exiting...
    exit
fi
python3 -m gunicorn server:app
