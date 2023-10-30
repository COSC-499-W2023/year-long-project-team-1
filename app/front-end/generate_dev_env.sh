# Create `.env.local` file for development environment
# PORT=8080
DEV_PORT=8081
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" > .env.local
echo "NEXTAUTH_URL=http://localhost:${PORT:-$DEV_PORT}" >> .env.local
echo "PRIVACYPAL_INPUT_VIDEO_DIR=\"../back-end/video-processing/input\"" >> .env.local
echo "PRIVACYPAL_OUTPUT_VIDEO_DIR=\"../back-end/video-processing/output\"" >> .env.local
echo "PRIVACYPAL_CONFIG_DIR=\"${PWD}/conf\"" >> .env.local