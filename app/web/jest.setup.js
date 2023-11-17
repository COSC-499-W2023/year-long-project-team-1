/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */

process.env.NODE_ENV = "test";

// Set up dummy PrivacyPal environment variables
process.env.PRIVACYPAL_INPUT_VIDEO_DIR = "../video-processing/input-videos";
process.env.PRIVACYPAL_OUTPUT_VIDEO_DIR = "../video-processing/output-videos";
process.env.PRIVACYPAL_AUTH_SECRET = "SoNlMT8Tbo2yzTYezGxgVTHtKHDdbDVWXaIvCsxz5kc=";
process.env.PRIVACYPAL_CONFIG_DIR = "./conf";
process.env.PRIVACYPAL_AUTH_MANAGER = "basic";
process.env.PRIVACYPAL_DEBUG = true;
process.env.PRIVACYPAL_COOKIE_NAME = "privacypal";
