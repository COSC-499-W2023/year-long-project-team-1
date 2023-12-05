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
