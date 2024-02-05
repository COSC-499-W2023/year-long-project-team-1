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
describe("Video review page", () => {
  const testApptId = 0;

  beforeEach(() => {
    cy.visit(`/upload/review/${testApptId}`);

    // Stub the processing API to return a success message
    cy.intercept(
      {
        method: "GET",
        url: `/api/video?apptId=${testApptId}`,
      },
      {
        statusCode: 200,
        body: "",
        headers: {
          "content-type": "video/mp4",
        },
      },
    ).as("processedAPI");
  });

  it("should display a heading", () => {
    cy.get("h1").contains("Review");
  });

  it("should display an accept button", () => {
    cy.get("button[aria-label='Accept video']").should("exist");
  });

  it("should display a reject button", () => {
    cy.get("button[aria-label='Reject video']").should("exist");
  });

  it("should display a video player", () => {
    cy.get("video").should("exist");
  });

  it("should display a video player with the correct source", () => {
    cy.get("source").should(
      "have.attr",
      "src",
      `/api/video?apptId=${testApptId}`,
    );
  });

  it("should redirect to not-found when the video is not found", () => {
    cy.visit("/upload/review/not-a-real-video");
    cy.get("h1").contains("Video not found");
  });
});
