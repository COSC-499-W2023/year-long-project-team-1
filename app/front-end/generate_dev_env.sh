# Create `.env.local` file for development environment
DEV_PORT="3000"
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" > .env.local
echo "NEXTAUTH_URL=http://localhost:${PORT:-$DEV_PORT}" >> .env.local
echo "PRIVACYPAL_AUTHPRIVACYPAL_INPUT_VIDEO_DIR=\"../back-end/video-processing/input\"" >> .env.local