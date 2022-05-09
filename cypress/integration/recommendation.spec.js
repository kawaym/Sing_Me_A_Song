before(() => {
  cy.request("POST", "http://localhost:5000/tests/reset-database");
  cy.request("POST", "http://localhost:5000/tests/seed/recommendations");
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
    cy.get("svg[id*='upvote']").first().click();
    cy.wait("@upvote");
    cy.contains("1").should("be.visible");
  });
  it("should downvote successfully a recommendation", () => {
    cy.intercept("POST", "http://localhost:5000/recommendations/*/downvote").as(
      "downvote"
    );
    cy.get("svg[id*='downvote']").first().click();
    cy.wait("@downvote");
    cy.contains("0").should("be.visible");
  });
  it("should get 10 recommendations", () => {
    cy.get(".sc-gKXOVf")
      .find("div")
      .should("have.length", 11 * 4);
  });
  it("should get top recommendations", () => {
    cy.get("div").contains("Top").first().click();
    cy.location().should((loc) => {
      expect(loc.toString()).to.eq("http://localhost:3000/top");
    });
    cy.get(".sc-gKXOVf")
      .find("div")
      .should("have.length", 10 * 4);
  });
  it("should get a random recommendation", () => {
    cy.get("div").contains("Random").first().click();
    cy.location().should((loc) => {
      expect(loc.toString()).to.eq("http://localhost:3000/random");
    });
    cy.get(".sc-gKXOVf")
      .find("div")
      .should("have.length", 1 * 4);
  });
});
