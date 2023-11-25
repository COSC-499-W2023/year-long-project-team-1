/*
 * Created on Fri Nov 24 2023
 * Author: Connor Doman
 */
import { PORT } from "@lib/config";
import { defineConfig } from "cypress";

export default defineConfig({
    projectId: "tyhfus",
    component: {
        specPattern: "app/**/*.cy.{js,jsx,ts,tsx}",
        devServer: {
            framework: "next",
            bundler: "webpack",
        },
        supportFile: false,
    },
    e2e: {
        specPattern: "cypress/{tests,e2e}/**/*.cy.{js,jsx,ts,tsx}",
        baseUrl: `http://localhost:${PORT}/`,
        supportFile: false,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
