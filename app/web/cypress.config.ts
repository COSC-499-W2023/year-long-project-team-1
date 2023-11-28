/*
 * Created on Fri Nov 24 2023
 * Author: Connor Doman
 */
import { defineConfig } from "cypress";

const PORT = process.env.PORT ?? 8081;

export default defineConfig({
    projectId: "tyhfus",
    e2e: {
        specPattern: "cypress/{tests,e2e}/**/*.cy.{js,jsx,ts,tsx}",
        baseUrl: `http://localhost:${PORT}/`,
        supportFile: false,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
