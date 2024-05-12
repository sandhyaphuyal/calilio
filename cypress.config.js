const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 2000,
  viewportHeight: 1400,
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl:"https://app.develop.krispchats.com/",
    defaultCommandTimeout: 10000,
  },

  
  
  
});
