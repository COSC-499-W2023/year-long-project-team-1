describe("Clients List API (GET /api/users/clients)", () => {
  it("should return a list of clients", () => {
    cy.request("GET", "/api/users/clients").then((response) => {
      expect(response.status).to.eq(200);
      const data = response.body;
      cy.log("Clients List", data);
      expect(data).to.have.length.greaterThan(0);
    });
  });
});
