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

describe("/api/users: Fetch users", () => {
    const verifySuccessRespBody = (response: Cypress.Response<any>) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("result");
        expect(Array.isArray(response.body.result.data)).to.be.true;
    }

    context("GET /api/users?id=<mockid>", function(){
        it("gets user based on id", function(){
            cy.request({
                method: "GET", 
                url: "/api/users", 
                qs:{id: 1},
            }).then((response) => {
                verifySuccessRespBody(response);
                expect(response.body.result.data.length).to.eq(1);
                })
        }); 

        it("error when invalid id", function(){
            cy.request({
                method: "GET", 
                url: "/api/users", 
                qs:{id: "abc"},
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.errors[0].detail).to.eq("id must be a list of string numbers or single string number.");
            })
        }); 
    });

    context("GET /api/users?id=<mockids>", function(){
        it("gets user based on list of ids", function(){
            cy.request({
                method: "GET", 
                url: "/api/users", 
                qs:{id: "1,2,3"},
            }).then((response) => {
                verifySuccessRespBody(response);
                expect(response.body.result.data.length).to.be.at.least(1);
            })
        });
        it("gets error if one of id is invalid", function(){
            cy.request({
                method: "GET", 
                url: "/api/users", 
                qs:{id: "1,abc,3"},
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body.errors[0].detail).to.eq("id must be a list of string numbers or single string number.");
            })
        }); 
     });

    context("GET /api/users", function(){
    it("gets list of all users", () => {
        cy.request("/api/users").then((response) => {
            verifySuccessRespBody(response);
            expect(response.body.result.data.length).to.be.at.least(0);
        });
        }); 
    });

    // TODO: add PUT test
});
