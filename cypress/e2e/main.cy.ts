describe("template spec", () => {
  it("Main page", () => {
    cy.visit("/");
    cy.get("body").should("be.visible");
  });
});

it("display table correctly", function () {
  cy.visit("/");
  cy.get("table").should("exist");
  cy.get("thead").should("be.visible");
});
