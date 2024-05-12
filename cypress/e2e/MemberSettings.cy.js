const apiUrl = "https://api.develop.krispchats.com/graphql";
import RandomDataGen from "../support/randomData";

const interceptWorkspaceMembers = () => {
  cy.intercept("POST", apiUrl, (req) => {
    if (req?.body?.operationName === "workspaceMembers") {
      req.alias = "WorkspaceMembers";
    }
  });
};

const visitMembersPage = () => {
  cy.visit("/app/settings/members");
  cy.wait("@WorkspaceMembers").then((interception) => {
    expect(interception.response.statusCode).to.equal(200);
    expect(interception.response.body).to.have.property("data");
    const ItemCount =
      interception.response.body.data.workspaceMembers.edges.length;
    if (ItemCount != 0) {
      expect(cy.contains(`${ItemCount} users`).should("exist"));
      cy.get(".ant-table-row").its("length").should("be.equal", ItemCount);
    }
  });
};

describe("Member Invite Functionality", () => {
  let email = "subedimanmohan@gmail.com";
  let password = "Signup@123";

  let fn = new RandomDataGen();
  beforeEach(() => {
    cy.loginKey(email, password, apiUrl);
  });

  it.skip("laod member page", () => {
    interceptWorkspaceMembers();
    visitMembersPage();
  });

  it.skip("Should display error message when use previously used email", () => {
    interceptWorkspaceMembers();
    visitMembersPage();

    cy.contains("Invite Members").click();

    cy.get('[data-test-id="name-test-field"]').type(
      fn.generateRandomFullName()
    );
    cy.get('[data-test-id="email-test-field"]').type(
      "subedimanmohan@gmail.com"
    );

    cy.get('[data-test-id="role-test-field"]').click();
    cy.get(".ant-select-item-option").then((options) => {
      const randomIndex = Math.floor(Math.random() * options.length);
      cy.wrap(options[randomIndex]).click();
    });
    cy.contains("Send Invite").click();
    cy.contains("Email is already used");
  });

  it.skip("invite user", () => {
    interceptWorkspaceMembers();
    visitMembersPage();

    cy.contains("Invite Members").click();

    cy.get('[data-test-id="name-test-field"]').type(
      fn.generateRandomFullName()
    );
    cy.get('[data-test-id="email-test-field"]').type(
      fn.generateRandomYopmail()
    );

    cy.get('[data-test-id="role-test-field"]').click();
    cy.get(".ant-select-item-option").then((options) => {
      const randomIndex = Math.floor(Math.random() * options.length);
      cy.wrap(options[randomIndex]).click();
    });
    cy.contains("Send Invite").click();
    cy.contains("Confirm").click();
    cy.wait(50000);
    cy.wait("@WorkspaceMembers", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      const ItemCount =
        interception.response.body.data.workspaceMembers.edges.length;
      if (ItemCount != 0) {
        expect(cy.contains(`${ItemCount} users`).should("exist"));
      }
      cy.get(".ant-table-row").its("length").should("be.equal", ItemCount);
    });
  });

  it.skip("Member Search Functionality", () => {
    cy.intercept("POST", apiUrl, (req) => {
      if (req?.body?.operationName === "workspaceMembers") {
        req.alias = "WorkspaceMembers";
      }
    });

    cy.visit("/app/settings/members");
    cy.wait("@WorkspaceMembers").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      const ItemCount =
        interception.response.body.data.workspaceMembers.edges.length;
      if (ItemCount != 0) {
        expect(cy.contains(`${ItemCount} users`).should("exist"));
        cy.get(".ant-table-row").its("length").should("be.equal", ItemCount);
      }
    });
    cy.get('input[placeholder="Search"]').type("amitnepal");

    cy.wait("@WorkspaceMembers").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      const ItemCount =
        interception.response.body.data.workspaceMembers.edges.length;
      if (ItemCount != 0) {
        expect(cy.contains(`${ItemCount} users`).should("exist"));
        cy.get(".ant-table-row").its("length").should("be.equal", ItemCount);
      } else {
        console.log("Empty data");
      }
    });
  });

  it("Tab Filters", () => {
    interceptWorkspaceMembers();
    visitMembersPage();
    cy.contains("Active").click();

    cy.wait("@WorkspaceMembers").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      const ItemCount =
        interception.response.body.data.workspaceMembers.edges.length;
      if (ItemCount != 0) {
        expect(cy.contains(`${ItemCount} users`).should("exist"));
        cy.get(".ant-table-row").its("length").should("be.equal", ItemCount);
      } else {
        console.log("Empty data");
      }
    });

    cy.contains("Invites").click();
    cy.wait("@WorkspaceMembers").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      const ItemCount =
        interception.response.body.data.workspaceMembers.edges.length;
      if (ItemCount != 0) {
        expect(cy.contains(`${ItemCount} users`).should("exist"));
        cy.get(".ant-table-row").its("length").should("be.equal", ItemCount);
      } else {
        console.log("Empty data");
      }
    });

    cy.contains("View All").click();
    cy.wait("@WorkspaceMembers").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      const ItemCount =
        interception.response.body.data.workspaceMembers.edges.length;
      if (ItemCount != 0) {
        expect(cy.contains(`${ItemCount} users`).should("exist"));
        cy.get(".ant-table-row").its("length").should("be.equal", ItemCount);
      } else {
        console.log("Empty data");
      }
    });
  });
});
