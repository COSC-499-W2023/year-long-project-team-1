describe("Video review page", () => {
  const testVideoId = "e2e-test-video";

  beforeEach(() => {
    cy.visit(`/upload/review/${testVideoId}`);
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
      `/api/video/processed?file=${testVideoId}-processed.mp4`,
    );
  });

  it("should redirect to not-found when the video is not found", () => {
    cy.visit("/upload/review/not-a-real-video");
    cy.url().should("include", "/not-found");
  });
});
