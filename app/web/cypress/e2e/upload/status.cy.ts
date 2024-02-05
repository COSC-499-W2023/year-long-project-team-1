describe("Upload status page", () => {
  const testVideoId = "e2e-test-video.mp4";

  beforeEach(() => {
    cy.visit(`/upload/status/${testVideoId}`);

    // Stub the status API to return a processing message
    // cy.intercept(
    //   {
    //     method: "GET",
    //     url: `/api/video/status?filename=${testVideoId}`,
    //   },
    //   {
    //     statusCode: 200,
    //     body: JSON.stringify({ message: "Processing", status: 200 }),
    //     headers: {
    //       "content-type": "application/json",
    //     },
    //   },
    // ).as("statusAPIProcessing");

    // Stub the status API to return a not found message
    // cy.intercept(
    //   {
    //     method: "GET",
    //     url: `/api/video/status?filename=${testVideoId}`,
    //   },
    //   {
    //     statusCode: 404,
    //     body: JSON.stringify({ message: "File not found", status: 404 }),
    //     headers: {
    //       "content-type": "application/json",
    //     },
    //   },
    // ).as("statusAPI404");
  });

  it("should display a heading", () => {
    cy.get("h1").contains("Upload Status");
  });

  it("should display a status message", () => {
    cy.get("p").contains("Processing");
  });

  it("should redirect to /upload/review/[id] when finished", () => {
    // Stub the status API to return a completed message
    cy.intercept(
      {
        method: "GET",
        url: `/api/video/status?filename=${testVideoId}`,
      },
      {
        statusCode: 200,
        body: JSON.stringify({ message: "True", status: 200 }),
        headers: {
          "content-type": "application/json",
        },
      },
    ).as("statusAPIComplete");

    // Capture the request
    cy.wait("@statusAPIComplete", { requestTimeout: 5500 }).then(
      (interception) => {
        // Check the status code is 200
        expect(interception.response.statusCode).to.equal(200);
        // Check the status message is present
        cy.url().should("include", `/upload/review/${testVideoId}`);
      },
    );
  });

  it("should display 'File not found' for nonexistant video", () => {
    // Stub the status API to return a not found message
    cy.intercept(
      {
        method: "GET",
        url: `/api/video/status?filename=${testVideoId}`,
      },
      {
        statusCode: 404,
        body: JSON.stringify({ message: "False", status: 404 }),
        headers: {
          "content-type": "application/json",
        },
      },
    ).as("statusAPI404");

    // Capture the request
    cy.wait("@statusAPI404", { requestTimeout: 5500 }).then((interception) => {
      // Check the status code is 404
      expect(interception.response.statusCode).to.equal(404);
      // Check the status message is present
      cy.get("p").contains("File not found");
    });
  });

  it("should display error for a failed video upload or server error", () => {
    // Stub the status API to return a failed message
    cy.intercept(
      {
        method: "GET",
        url: `/api/video/status?filename=${testVideoId}`,
      },
      {
        statusCode: 500,
        body: JSON.stringify({ message: "False", status: 500 }),
        headers: {
          "content-type": "application/json",
        },
      },
    ).as("statusAPI500");

    // Capture the request
    cy.wait("@statusAPI500", { requestTimeout: 5500 }).then((interception) => {
      // Check the status code is 500
      expect(interception.response.statusCode).to.equal(500);
      // Check the status message is present
      cy.get("p").contains("Error processing file");
    });
  });
});
