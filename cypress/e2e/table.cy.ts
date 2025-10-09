describe("display table correctly", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("table should exists", () => {
    cy.get("table").should("exist");
  });

  it("table should have all headers", () => {
    cy.get("th:nth-child(1) > .flex").should("have.text", "Kürzel");
    cy.get("th:nth-child(2) > .flex").should("have.text", "PO");
    cy.get("th:nth-child(3) > .flex").should("have.text", "Datum");
    cy.get("th:nth-child(4) > .flex").should("have.text", "Zeit");
    cy.get("th:nth-child(5) > .flex").should("have.text", "Dauer");
    cy.get("th:nth-child(6) > .flex").should("have.text", "Prüfer Name");
    cy.get("th:nth-child(7) > .flex").should("have.text", "Räume");
  });

  it("table should have column filters", () => {
    cy.get('[aria-label="Filter für Kürzel"]').should("be.visible");
    cy.get('[aria-label="Filter für PO"]').should("be.visible");
    cy.get('[aria-label="Filter für Datum"]').should("be.visible");
    cy.get('[aria-label="Filter für Zeit"]').should("be.visible");
    cy.get('[aria-label="Filter für Dauer"]').should("be.visible");
    cy.get('[aria-label="Filter für Prüfer Name"]').should("be.visible");
    cy.get('[aria-label="Filter für Räume"]').should("be.visible");
  });

  it("table should load contents", () => {
    cy.get("table tbody tr").should("have.length.at.least", 1);
    cy.get('tr:nth-child(1) [data-label="po"]').should("be.visible").and("not.be.empty");
    cy.get('tr:nth-child(1) [data-label="kuerzel"]').should("be.visible").and("not.be.empty");
    cy.get('tr:nth-child(1) [data-label="pruefungsdauer"]').should("be.visible").and("not.be.empty");
  });
});

describe("column filters work correctly", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should be able to filter a column", () => {
    cy.get('[aria-label="Filter für PO"]').click();
    cy.get('[aria-label="Filter für PO"]').clear();
    cy.get('[aria-label="Filter für PO"]').type("201");
    cy.get('[aria-label="Filter für PO"]').clear();
    cy.get('[aria-label="Filter für PO"]').type("2016");

    cy.get('tr:nth-child(1) [data-label="po"]').should("have.text", "2016");
    cy.get('tr:nth-child(2) [data-label="po"]').should("have.text", "2016");
    cy.get('tr:nth-child(3) [data-label="po"]').should("have.text", "2016");
    cy.get('tr:nth-child(4) [data-label="po"]').should("have.text", "2016");
  });

  it("should find nothing with invalid filter", () => {
    cy.get('[aria-label="Filter für PO"]').click();
    cy.get('[aria-label="Filter für PO"]').clear();
    cy.get('[aria-label="Filter für PO"]').type("invalid");
    cy.get("tr .italic.text-secondary-text").should(
      "have.text",
      "Keine Einträge gefunden.",
    );
  });

  it("filter should be clearable", () => {
    cy.get('[aria-label="Filter für PO"]').click();
    cy.get('[aria-label="Filter für PO"]').clear();
    cy.get('[aria-label="Filter für PO"]').type("invalid");
    cy.get('[viewBox="0 0 384 512"]').click();
    cy.get('tr:nth-child(1) [data-label="po"]').should("have.text", "2016");
    cy.get('tr:nth-child(2) [data-label="po"]').should("have.text", "2023");
  });

  it("filter should have max length", () => {
    const longString = "a".repeat(200);
    const maxLength = 100;
    cy.get('[aria-label="Filter für PO"]').clear().type(longString);
    cy.get('[aria-label="Filter für PO"]')
      .invoke("val")
      .should("have.length", maxLength);
  });

  it("filtering reduces displayed rows", () => {
    cy.contains("Keine Einträge gefunden.").should("not.exist");

    cy.get("table tbody tr").then(($rowsBefore) => {
      const rowCountBefore = $rowsBefore.length;

      cy.get('[aria-label="Filter für PO"]').clear().type("2016");

      cy.get("table tbody tr").should(($rowsAfter) => {
        expect($rowsAfter.length).to.be.lessThan(rowCountBefore);
        $rowsAfter.each((index, row) => {
          expect(Cypress.$(row).find('[data-label="po"]').text()).to.include(
            "2016",
          );
        });
      });
    });
  });
});
