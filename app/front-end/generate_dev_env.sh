#!/bin/bash

# Create `.env.local` file for development environment
{
    echo NEXTAUTH_SECRET="$(openssl rand -base64 32)"
    echo NEXTAUTH_URL="http://localhost:${PORT:-8081}"
    echo PRIVACYPAL_INPUT_VIDEO_DIR="../back-end/video-processing/input-videos"
    echo PRIVACYPAL_OUTPUT_VIDEO_DIR="../back-end/video-processing/output-videos"
    echo PRIVACYPAL_CONFIG_DIR="./conf"
} > .env.local
