#!/bin/bash

# Create `.env.local` file for development environment
{
    echo PRIVACYPAL_INPUT_VIDEO_DIR="../video-processing/input-videos"
    echo PRIVACYPAL_OUTPUT_VIDEO_DIR="../video-processing/output-videos"
    echo PRIVACYPAL_AUTH_SECRET="$(openssl rand -base64 32)"
    echo PRIVACYPAL_CONFIG_DIR="./conf"
    echo PRIVACYPAL_AUTH_MANAGER="${PRIVACYPAL_AUTH_MANAGER:-basic}"
    echo PRIVACYPAL_DEBUG=${PRIVACYPAL_DEBUG:-true}
    echo PRIVACYPAL_COOKIE_NAME=${PRIVACYPAL_COOKIE_NAME:-"privacypal"}
} > .env.local
