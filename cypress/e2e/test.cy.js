// combined_spec.js
// import {aliasQuery, aliasMutation,hasOperationName} from '../utils/graphql-test-utils'

describe("Combined Tests with GraphQL POST Verification", () => {
  let username = "Raj Kumar Khanal";
  let email = "varosa6@yopmail.com";
  let wrongemail = "123SMTP";
  let passport = "Varosa@#123";
  let wrongpassport = "Varosa@#122";
  let existing_email = "subedimanmohan@gmail.com";

  beforeEach(() => {
    cy.login(email, passport);
  });

  it("test", () => {
    cy.visit("/app/dashboard");
//     cy.get('[data-test-id="email-test-field"]').type(email);
//     cy.get('[data-test-id="password-test-field"]').type(passport);

//     cy.get('[data-test-id="login-btn"]').should("be.disabled");
//     cy.get('[data-test-id="login-btn"]').invoke("prop", "disabled", false);
//     cy.get('[data-test-id="login-btn"]').should("not.be.disabled");

//     cy.get('[data-test-id="login-btn"]').click();
cy.wait(10000)
    cy.get('[data-test-id="business-account-id"]').click({ force: true });

    cy.contains("Continue").click();

    cy.contains("Tinder").click();

    //select
    cy.contains("Continue").click();

    cy.contains("Premium Plan").click();
    cy.contains("Continue").click();
    cy.pause();

    cy.get('[data-test-id="card-name-id"]').type(username);

    cy.switchToCardNumber();
    cy.get("@CardNumber")
      .find('[name="cardnumber"]')
      .type("4242424242424242");

    cy.switchToCVV();
    cy.get("@CVV").find('[name="cvv"]').type("123");

    cy.switchToExpiryDate();
    cy.get("@ExpiryDate").find('[name="cardnumber-expiry"]').type("12/30");

    cy.get('[data-test-id="address-1"]').type('Texas');

		cy.get('[data-test-id="address-1"]').type('Utah');
		cy.get('[data-test-id="address-2-id"]').type('salt lake');
		cy.get('[data-test-id="state-id"]').type('Texas');
		cy.get('[data-test-id="postalCode-id"]').type('00501');

    cy.get('[data-test-id="checkout-id"]').click();
  });
});
