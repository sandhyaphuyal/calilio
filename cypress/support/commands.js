import "cypress-iframe";

Cypress.Commands.add("loginKey", (username, passport, apiUrl) => {
  cy.session(
    [username, passport],
    () => {
      cy.intercept("POST", apiUrl, (req) => {
        if (req?.body?.operationName === "login") {
          req.alias = "Login";
          req.continue;
        }
      });
      cy.visit("/auth/login");
      cy.get('[data-test-id="email-test-field"]').type(username);
      cy.get('[data-test-id="password-test-field"]').type(passport);

      cy.get('[data-test-id="login-btn"]').should("be.disabled");
      cy.get('[data-test-id="login-btn"]').invoke("prop", "disabled", false);
      cy.get('[data-test-id="login-btn"]').should("not.be.disabled");

      cy.get('[data-test-id="login-btn"]').click();
      cy.wait("@Login").then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body).to.have.property("data");
      });
      
      cy.url().should("include", "app/dashboard");
    },
    {
      cacheAcrossSpecs: true,
    }
  );
});

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false
})

Cypress.Commands.add("switchToCardNumber", () => {
  cy.iframe('[name="cb-component-number-0"]').as("CardNumber");
});
Cypress.Commands.add("switchToCVV", () => {
  cy.iframe('[name="cb-component-cvv-1"]').as("CVV");
});
Cypress.Commands.add("switchToExpiryDate", () => {
  cy.iframe('[name="cb-component-expiry-2"]').as("ExpiryDate");
});
