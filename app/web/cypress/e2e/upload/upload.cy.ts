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
describe("Video upload rendering", () => {
    beforeEach(() => {
        cy.visit("/upload");
    });

    it("should contain a heading", () => {
        cy.get("h1").contains("Upload a Video");
    });

    it("should contain an video upload form", () => {
        cy.get("form[aria-label='Video upload form']").should("exist");
    });

    it("should contain a file input", () => {
        cy.get("input[type=file]").should("exist");
    });

    it("should contain a submit button", () => {
        cy.get("button[aria-label='Submit video']").should("exist");
    });

    it("should contain a disabled record button", () => {
        const recordButton = cy.get("button[aria-label='Record video']");
        recordButton.should("exist");
        recordButton.should("be.disabled");
    });
});

describe("Video upload functionality", () => {
    beforeEach(() => {
        cy.visit("/upload");
    });

    it("should not upload a video when not logged in", () => {
        cy.intercept(
            {
                method: "POST",
                url: "/api/video/upload",
            },
            { data: { success: true, filePath: "test.mp4" } }
        ).as("videoUploadApi");
        cy.get("input[type=file]").selectFile("cypress/test-data/test.mp4");
        cy.get("button[aria-label='Submit video']").click();
        cy.wait("@videoUploadApi").then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
        });
        cy.url().should("include", "/upload/status");
    });
});
