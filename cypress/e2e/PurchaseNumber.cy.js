// cypress/integration/login.spec.js

const apiUrl = "https://api.staging.krispchats.com/graphql";
const interceptCartRequest = () => {
  cy.intercept("POST", apiUrl, (req) => {
    if (req?.body?.operationName === "carts") {
      req.alias = "cartitem";
    }
  });
};

const waitForCartInterception = () => {
  cy.wait("@cartitem").then((interception) => {
    expect(interception.response.statusCode).to.equal(200);
    expect(interception.response.body).to.have.property("data");
  });
};
const waitForAvailableNumber = () => {
  cy.intercept("POST", apiUrl, (req) => {
    if (req?.body?.operationName === "availablePhoneNumbers") {
      req.alias = "AvailableNumber";
      const itemsPerPage = 10;
    }
  });

  cy.visit("/app/settings/my-numbers/available-numbers");
  cy.wait("@AvailableNumber", { timeout: "10000" }).then((interception) => {});
};

const paginationTest = () => {
  cy.get(".ant-table-row").should("have.length", 10);
  cy.get(".ant-pagination-prev").should(
    "have.class",
    "ant-pagination-disabled"
  );
  cy.get(".ant-pagination-next").should("have.attr", "aria-disabled", "false");

  cy.get(".ant-pagination-next").click();
  cy.get(".ant-table-row").should("have.length", 10);
  cy.get(".ant-pagination-prev").should("have.attr", "aria-disabled", "false");
  cy.get(".ant-pagination-next").should("have.attr", "aria-disabled", "false");

  cy.get(".ant-pagination-prev").click();
  cy.get(".ant-table-row").should("have.length", 10);
  cy.get(".ant-pagination-prev").should(
    "have.class",
    "ant-pagination-disabled"
  );
  cy.get(".ant-pagination-next").should("have.attr", "aria-disabled", "false");

  cy.get(".ant-pagination-item")
    .its("length")
    .then((length) => {
      const paginationItemCount = length - 1;
      cy.get(".ant-pagination-item").eq(paginationItemCount).click();
      cy.get(".ant-pagination-prev").should(
        "have.attr",
        "aria-disabled",
        "false"
      );
      cy.get(".ant-pagination-next").should(
        "have.attr",
        "aria-disabled",
        "true"
      );

      const randomIndex = Cypress._.random(1, paginationItemCount - 1);
      cy.get(".ant-pagination-item").eq(randomIndex).click();
      cy.get(".ant-pagination-prev").should(
        "have.attr",
        "aria-disabled",
        "false"
      );
      cy.get(".ant-pagination-next").should(
        "have.attr",
        "aria-disabled",
        "false"
      );
    });
};
const VisitPage = () => {
  cy.visit("app/settings/my-numbers");
  cy.contains("Purchase Number").click();
  cy.contains("Purchase Phone Number").click();
};

const uuid = () => Cypress._.random(0, 1e6);
const id = uuid();
const testname = `FriendName${id}`;

const buySelectedPhoneNumber = () => {
  cy.get(".ant-table-row")
    .its("length")
    .then((options) => {
      const randomIndex = Math.floor(Math.random() * options);
      console.log(randomIndex);
      cy.get(".ant-table-row")
        .eq(randomIndex)
        .find("td")
        .contains("Buy Number")
        .closest("td")
        .click();
    });

  cy.get('[data-test-id="friendlyname-test-field"]').type(testname);
  cy.contains("Add to Cart").click();
};

let selectedNumberType;

describe("Cart Functionlity", () => {
  let email = "brain@yopmail.com";
  let password = "Varosa@#123";

  let ItemCount;
  let ItemCountupdate;

  beforeEach(() => {
    cy.loginKey(email, password, apiUrl);
  });

  it.skip("Should successfully add an item and verify the increased item count", () => {
    interceptCartRequest();
    VisitPage();

    cy.wait("@cartitem").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      ItemCount = interception.response.body.data.carts.data.length;
    });
    paginationTest();
    buySelectedPhoneNumber();
    cy.wait(10000);
    cy.wait("@cartitem").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      ItemCountupdate = interception.response.body.data.carts.data.length;
      cy.wrap(ItemCountupdate).should("be.greaterThan", ItemCount);
    });
    // paginationTest()
  });

  it.skip("Should filter Country wise available Number and add to cart", () => {
    interceptCartRequest();
    waitForAvailableNumber();
    cy.get('[data-test-id="country-input"]').click();
    cy.get('[data-test-id="search-country"]').type("Canada").type("{enter}");

    cy.wait("@AvailableNumber", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      let requestCountryCode = interception.request.body.variables.countryCode;
      let totalDatalenght =
        interception.response.body.data.availablePhoneNumbers.edges.length;
      let filteredEdges =
        interception.response.body.data.availablePhoneNumbers.edges.filter(
          (edge) => {
            return edge.isoCountry === requestCountryCode;
          }
        );
      // cy.wrap(filteredEdges.length).should("be.equal", totalDatalenght);
    });

    buySelectedPhoneNumber();
    cy.wait(10000);
    cy.wait("@cartitem").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      ItemCountupdate = interception.response.body.data.carts.data.length;
      cy.wrap(ItemCountupdate).should("be.greaterThan", ItemCount);
    });
  });

  it.skip("Should successfully remove an item and verify the decreased item count", () => {
    interceptCartRequest();
    VisitPage();
    cy.wait(10000);
    cy.wait("@cartitem").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      ItemCount = interception.response.body.data.carts.data.length;
    });
    paginationTest();
    cy.get(
      ":nth-child(2) > .justify-between > :nth-child(2) > div > .cursor-pointer"
    ).click();
    cy.wait(10000);
    cy.wait("@cartitem").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      ItemCountupdate = interception.response.body.data.carts.data.length;
      cy.wrap(ItemCountupdate).should("be.lessThan", ItemCount);
    });
    // paginationTest()
  });

  it.skip("pagination", () => {
    waitForAvailableNumber();
    paginationTest();
  });

  it.skip("Should filter Country and number type wise available Number", () => {
    waitForAvailableNumber();
    cy.get('[data-test-id="country-input"]').click();
    cy.get('[data-test-id="search-country"]').type("Canada").type("{enter}");

    cy.wait("@AvailableNumber", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      let requestCountryCode = interception.request.body.variables.countryCode;
      let totalDatalenght =
        interception.response.body.data.availablePhoneNumbers.edges.length;
      let filteredEdges =
        interception.response.body.data.availablePhoneNumbers.edges.filter(
          (edge) => {
            return edge.isoCountry === requestCountryCode;
          }
        );
      // cy.wrap(filteredEdges.length).should("be.equal", totalDatalenght);
    });
        cy.get('[data-test-id="select-number-type"]').click();
        cy.get('.ant-select-item-option:not([title="All"])').then((options) => {
          const optionsToClick = Array.from(options).slice(1);
          const randomIndex = Math.floor(Math.random() * optionsToClick.length);
          selectedNumberType = Cypress.$(optionsToClick[randomIndex]).text().toLowerCase();
          if(selectedNumberType == "toll-free"){
            selectedNumberType = "toll_free"
          }
          cy.wrap(optionsToClick[randomIndex]).click({ force: true });
        });

        cy.wait("@AvailableNumber", { timeout: 10000 }).then((interception) => {
          expect(interception.response.statusCode).to.equal(200);
          expect(interception.response.body).to.have.property("data");
          if(interception.response.body.data.availablePhoneNumbers.edges.length == 0){
            console.log("Data was not found")
          }
          else{
            cy.get(".ant-table-row")
            .its("length")
            .then((options) => {
              const randomIndex = Math.floor(Math.random() * options);
              expect(
                cy
                  .get(".ant-table-row")
                  .eq(randomIndex)
                  .find("td")
                  .eq(3)
                .contains(`${selectedNumberType}`)
              );
            });

          }
        });

        
      
    
    //paginationTest()
  });

  it.skip("Should filter Country and number type wise available Number and add to cart", () => {
    interceptCartRequest();
    waitForAvailableNumber();
    cy.get('[data-test-id="country-input"]').click();
    cy.get('[data-test-id="search-country"]').type("Canada").type("{enter}");

    cy.wait("@AvailableNumber", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      let requestCountryCode = interception.request.body.variables.countryCode;
      let totalDatalenght =
        interception.response.body.data.availablePhoneNumbers.edges.length;
      let filteredEdges =
        interception.response.body.data.availablePhoneNumbers.edges.filter(
          (edge) => {
            return edge.isoCountry === requestCountryCode;
          }
        );
      // cy.wrap(filteredEdges.length).should("be.equal", totalDatalenght);
    });
    //paginationTest()

    cy.get('[data-test-id="select-number-type"]').click();
    cy.get('.ant-select-item-option:not([title="All"])').then((options) => {
      const optionsToClick = Array.from(options).slice(1);
      const randomIndex = Math.floor(Math.random() * optionsToClick.length);
      selectedNumberType = Cypress.$(optionsToClick[randomIndex]).text().toLowerCase();
      if(selectedNumberType == "toll-free"){
        selectedNumberType = "toll_free"
      }
      cy.wrap(optionsToClick[randomIndex]).click({ force: true });
    });

    cy.wait("@AvailableNumber", { timeout: 10000 }).then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property("data");
      if (interception.response.body.data.availablePhoneNumbers.edges.length == 0){
        console.log("Empty data")
      }
      else {
        cy.get(".ant-table-row")
          .its("length")
          .then((options) => {
            const randomIndex = Math.floor(Math.random() * options);
            expect(
              cy
                .get(".ant-table-row")
                .eq(randomIndex)
                .find("td")
                .eq(3)
                .contains(`${selectedNumberType}`)
            );
          });
        buySelectedPhoneNumber();
        cy.wait(10000);
        cy.wait("@cartitem").then((interception) => {
          expect(interception.response.statusCode).to.equal(200);
          expect(interception.response.body).to.have.property("data");
          ItemCountupdate = interception.response.body.data.carts.data.length;
        });
      }
    });
  });

  it("Should filter available number by 'Match to number filter type' ",()=>{
    waitForAvailableNumber();


  });

  
});
