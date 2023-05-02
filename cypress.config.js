const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    baseUrl: "http://localhost:4100",
    screenshotOnRunFailure: true,
    video: true,
    retries: 2,
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportPageTitle: 'Automation Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  env: {
    // implement environment variables here
    apiUrl: "https://conduit.productionready.io/api",
    grepTags: "@login @register @article",
  },
});
