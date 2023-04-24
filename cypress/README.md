# Cypress end to end tests

 - [Cypress](https://www.cypress.io/) is a JavaScript end to end testing framework. It is used to test the user interface of the application.
- [Cypress documentation](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)
- [Cypress best practices](https://docs.cypress.io/guides/references/best-practices.html#article)
- [Cypress best practices for Angular](https://docs.cypress.io/guides/references/best-practices.html#article)
- [Cypress best practices for React](https://docs.cypress.io/guides/references/best-practices.html#article)

## Running the tests

 - Run `npx cypress run` to run the tests in headless mode.
 - Run `npx cypress open` to open the Cypress test runner.

## Project Structure
    
     - The `cypress/integration` folder contains the tests.
     - The `cypress/fixtures` folder contains the test data.
     - The `cypress/plugins` folder contains the plugins.
     - The `cypress/support` folder contains the support files.
     - The `Helpers` folder contains the helper functions. And contains all constants used in the tests.
     - The 'cypress.config.js' file contains the configuration for the tests.

## Plugin used

 - [cypress-wait-until](https://github.com/NoriSte/cypress-wait-until) is a plugin used to wait for a condition to be true.
 - [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) is a plugin used to generate a report of the tests.
 - [cypress-xpath](https://github.com/cypress-io/cypress/tree/develop/npm/xpath) is a plugin used to select elements using xpath.
 - [cypress-testing-library](https://github.com/testing-library/cypress-testing-library) is a plugin used to select elements using testing library queries.
 - [cypress/grep](https://github.com/cypress-io/cypress/tree/develop/npm/grep) is a plugin used to run a specific test.