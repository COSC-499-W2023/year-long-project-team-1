# Create `.env.local` file for development environment
$DEV_PORT="3000"
echo "NEXT_AUTH_SECRET=$(openssl rand -base64 32)\\nNEXT_AUTH_URL=http://localhost:$DEV_PORT\\n\\nPRIVACYPAL_AUTHPRIVACYPAL_INPUT_VIDEO_DIR=\"../back-end/video-processing/input\"\n" > .env.local