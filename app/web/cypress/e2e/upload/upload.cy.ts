describe("Video upload rendering", () => {
    beforeEach(() => {
        cy.visit("/upload");
    });

    it("should contain a heading", () => {
        cy.get("h1").contains("Upload a Video");
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

    it("should upload a video", () => {
        cy.get("input[type=file]").selectFile("cypress/test-data/test.mp4");
        cy.get("button[aria-label='Submit video']").click();
        cy.wait(250);
        cy.url().should("include", "/upload/status");
        cy.wait(1000);
        cy.url().should("include", "/upload/review");
    });
});
