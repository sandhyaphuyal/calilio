import Homepage from "../pages/HomePage.cy";
import { aliasQuery, aliasMutation } from "../utils/graphql-test-utils";

describe("Load Home Page", () => {
  const log = new Homepage();
  const URL = "https://api.develop.krispchats.com/graphql";
  let username = "Raj Kumar Khanal";
  let email = "varosa7@yopmail.com";
  let wrongemail = "123SMTP";
  let passport = "Varosa@#123";
  let wrongpassport = "Varosa@#122";
  let existing_email = "subedimanmohan@gmail.com";

  before(() => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      if (err.message.includes("cross-origin")) {
        return false;
      }
      return true;
    });
  });

  beforeEach("successfully loads", () => {
    log.LoadBase();
    cy.title().should("eq", "Calilio - Cloud Phone");
    cy.get("a").eq(1).should("have.text", "Sign up").click();
  });
  it("Shows requires message- Empty Save ", () => {
    <p id="test-id-33">get started</p>;
    cy.contains("Get started").click();
    cy.contains("Email is required").should("exist");
    cy.contains("Password is required").should("exist");
    cy.contains("Name is required").should("exist");
    cy.contains("Required").should("exist");
  });

  it("Checks Email Validation", () => {
    cy.get('input[name="email"]').type(wrongemail);
    cy.get('input[name="password"]').type(passport);
    cy.contains("Please enter a valid email.").should("exist");
  });

  it("It checks passoword and retype password to be same", () => {
    cy.get('input[data-test-id="name-test-field"]').type(username); //name
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(passport); //password
    cy.get('input[name="retypePassword"]').type(wrongpassport); //retypepassword
    //cy.contains("Passwords doesn't match").should('be.visible');
  });

  it("User is already Exist", () => {
    cy.get('input[data-test-id="name-test-field"]').type(username); //name
    cy.get('input[name="email"]').type(existing_email);
    cy.get('input[name="password"]').type(passport); //password
    cy.get('input[name="retypePassword"]').type(passport); //retypepassword
    cy.contains("Get started").click();
    //api response check
    cy.contains(
      "Oops! Looks like you've already signed up with this email"
    ).should("be.visible");
  });

  it("Valid Credential", () => {
    cy.intercept("POST", URL, (req) => {
      aliasQuery(req, "signUp");
    });

    cy.get('input[data-test-id="name-test-field"]').type(username); //name
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(passport); //password
    cy.get('input[name="retypePassword"]').type(passport); //retypepassword

    cy.contains("Get started").click();

    // cy.wait('@signUp')

    cy.pause();

    cy.get('input[data-test-id="phone_number-test-field"]').clear();

    cy.pause();
    cy.contains("Continue").click();

    cy.pause();
    cy.contains("Continue").click();

    cy.pause();
    cy.get('[data-test-id="business-account-id"]').click({ force: true });
    cy.contains("Continue").click();
    cy.contains("Tinder").click();
    cy.contains("Continue").click();

    cy.contains("Continue").click();
    cy.get('[data-test-id="card-name-id"]').type(username);
    cy.get('[data-test-id="address-1"]').type("Texas");

    cy.get('[data-test-id="address-1"]').type("Utah");
    cy.get('[data-test-id="address-2-id"]').type("salt lake");
    cy.get('[data-test-id="state-id"]').type("Texas");
    cy.get('[data-test-id="postalCode-id"]').type("00501");
    cy.pause();
    // cy.contains('Checkout').click();
    cy.get('[data-test-id="checkout-id"]').click();
    cy.wait(1000);
  });

  it("test", () => {
    cy.visit("/");
    cy.get('input[name="email"]', { timeout: 10000 }).type(email);
    cy.get('input[name="password"]', { timeout: 10000 }).type(passport);
    cy.pause();
    cy.contains("Sign in").click();
    cy.pause();
    cy.get('[data-test-id="business-account-id"]').click({ force: true });

    cy.contains("Continue").click();

    cy.contains("Tinder").click();
    cy.pause();
    //select
    cy.contains("Continue").click();
    cy.pause();
    cy.contains("Premium Plan").click();
    cy.contains("Continue").click();
    cy;
    cy.get('iframe[name="cb-component-number-0"]').then(function ($iframe) {
      const body = $iframe.contents().find("body");
      console.log(body);
      const cardinput = body.find('input[id="cardnumber"]');
      cy.wrap(cardinput).type("4242424242424242");
    });

    cy.pause();
  });

  it("Graphql api response", () => {
    cy.intercept(
      "POST",
      "https://api.develop.krispchats.com/graphql",
      (req) => {
        console.log(req.body);
        req.alias = req.body.operationName;
      }
    );
    cy.visit("/");
  });
});
