/*
 * Created on Sat Nov 25 2023
 * Author: Connor Doman
 */

describe("/api/users: Fetch users", () => {
    it("Should return a list of users", () => {
        cy.request("/api/users").then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("result");
            expect(Array.isArray(response.body.result.data)).to.be.true;
            expect(response.body.result.data.length).to.be.at.least(0);
        });
    });
});
