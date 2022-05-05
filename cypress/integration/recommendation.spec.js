beforeEach(() => {
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
});
