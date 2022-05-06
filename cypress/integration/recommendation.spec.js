before(() => {
  cy.request("POST", "http://localhost:5000/tests/reset-database");
});

describe("Recommendations E2E tests", () => {
  it("should create a new recommendation", () => {
    cy.visit("http://localhost:3000");

    cy.get('input[placeholder*="Name"]').type("Dummy");
    cy.get('input[placeholder*="https://youtu.be/..."]').type(
      "https://www.youtube.com/watch?v=yAoLSRbwxL8"
    );
    cy.intercept("POST", "http://localhost:5000/recommendations").as(
      "createRecommendation"
    );
    cy.get("div button").click();
    cy.wait("@createRecommendation");
    cy.contains("Dummy").should("be.visible");
  });
  it("should upvote successfully a recommendation", () => {
    cy.intercept("POST", "http://localhost:5000/recommendations/*/upvote").as(
      "upvote"
    );
    cy.get("svg[id*='upvote']").click();
    cy.wait("@upvote");
    cy.contains("1").should("be.visible");
  });
  it("should downvote successfully a recommendation", () => {
    cy.intercept("POST", "http://localhost:5000/recommendations/*/downvote").as(
      "downvote"
    );
    cy.get("svg[id*='downvote']").click();
    cy.wait("@downvote");
    cy.contains("0").should("be.visible");
  });
});
