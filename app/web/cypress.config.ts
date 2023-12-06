/*
 * Copyright [2023] [Privacypal Authors]
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineConfig } from "cypress";

const APP_PORT = process.env.APP_PORT ?? 8081;

export default defineConfig({
    projectId: "tyhfus",
    e2e: {
        specPattern: "cypress/{tests,e2e}/**/*.cy.{js,jsx,ts,tsx}",
        baseUrl: `http://localhost:${APP_PORT}/`,
        supportFile: false,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
