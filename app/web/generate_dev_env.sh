#!/bin/bash

# Create `.env.local` file for development environment
{
    echo NEXTAUTH_SECRET="$(openssl rand -base64 32)"
    echo NEXTAUTH_URL="http://localhost:${PORT:-8081}"
    echo PRIVACYPAL_INPUT_VIDEO_DIR="../video-processing/input-videos"
    echo PRIVACYPAL_OUTPUT_VIDEO_DIR="../video-processing/output-videos"
    echo PRIVACYPAL_CONFIG_DIR="./conf"
    echo PRIVACYPAL_AUTH_MANAGER="${PRIVACYPAL_AUTH_MANAGER:-basic}"
    echo PRIVACYPAL_DEBUG=${PRIVACYPAL_DEBUG:-true}
} > .env.local
