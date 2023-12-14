/*
Copyright [2023] [Privacypal Authors]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

process.env.NODE_ENV = "test";

// Set up dummy PrivacyPal environment variables
process.env.PRIVACYPAL_INPUT_VIDEO_DIR = "../video-processing/input-videos";
process.env.PRIVACYPAL_OUTPUT_VIDEO_DIR = "../video-processing/output-videos";
process.env.PRIVACYPAL_AUTH_SECRET =
  "SoNlMT8Tbo2yzTYezGxgVTHtKHDdbDVWXaIvCsxz5kc=";
process.env.PRIVACYPAL_CONFIG_DIR = "./conf";
process.env.PRIVACYPAL_AUTH_MANAGER = "basic";
process.env.PRIVACYPAL_DEBUG = true;
process.env.PRIVACYPAL_COOKIE_NAME = "privacypal";

const mGetRandomValues = jest.fn().mockReturnValueOnce(new Uint32Array(10));
Object.defineProperty(window, "crypto", {
  value: { getRandomValues: mGetRandomValues },
});
