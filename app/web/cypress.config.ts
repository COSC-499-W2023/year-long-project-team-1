/*
 * Created on Fri Nov 24 2023
 * Author: Connor Doman
 */
import { defineConfig } from "cypress";

export default defineConfig({
    projectId: "tyhfus",
    component: {
        specPattern: "app/**/*.cy.{js,jsx,ts,tsx}",
        devServer: {
            framework: "next",
            bundler: "webpack",
        },
    },
    e2e: {
        specPattern: "cypress/{tests,e2e}/**/*.cy.{js,jsx,ts,tsx}",
        baseUrl: "http://localhost:8081/",
        supportFile: false,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
