class Homepage {
  LoadBase() {
    cy.visit("/auth/login");
    cy.title().should("eq", "Calilio - Cloud Phone");
  }

  Login(email, passport, apiUrl) {
    cy.intercept("POST", apiUrl).as("loginRequest");
    cy.visit("/auth/login");
    cy.get('[data-test-id="email-test-field"]').type(email);
    cy.get('[data-test-id="password-test-field"]').type(passport);

    cy.get('[data-test-id="login-btn"]').should("be.disabled");
    cy.get('[data-test-id="login-btn"]').invoke("prop", "disabled", false);
    cy.get('[data-test-id="login-btn"]').should("not.be.disabled");
    cy.get('[data-test-id="login-btn"]').click();
    cy.wait(10000);
    cy.wait("@loginRequest").then(({ request, response }) => {
      expect(request.method).to.equal("POST");
      expect(response.statusCode).to.equal(200);
      expect(response.body.data.login.message).to.equal("Login successfully");
      const Accesstoken = response.body.data.login.data.token.access;
      const Refreshtoken = response.body.data.login.data.token.refresh;
    });

    cy.url().should("not.include", "/auth/login");
  }
}
export default Homepage;
