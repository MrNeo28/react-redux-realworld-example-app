// import helper functions
import { faker } from '@faker-js/faker';
import constants from '.././helper/constants';

// ** Login page **
describe('Validate login page', { tags: '@login' },() => {

    beforeEach(() => {
        // create login session
        cy.intercept('POST', '**/users/login').as('login').visit('/login');
    });

    it('User Should be able to login with valid credentials', () => {
        // load test data from fixture and login
        cy.fixture("test_data").then(data => {
            const email = data.email;
            const password = data.password;
            // login with valid credentials
            cy.findByPlaceholderText(constants.emailPlaceHolder).type(email);
            cy.findByPlaceholderText(constants.loginPasswordPlaceHolder).type(password);
            // clicks submit button
            cy.findByRole('button', { name: /sign in/i }).click();
            // wait for the request to complete
            cy.wait('@login').its('response.statusCode').should('eq', 307);
            // check if the user is redirected to home page
            cy.location('pathname').should('equal', '/');
            // check if the user is logged in
            cy.findByRole('navigation').within(() => {
                cy.findAllByRole('link', { name: RegExp(data.username, 'i') }).should('exist');
            });
        });
    });

    it('User should not be able to login with invalid credentials', () => {
        
        cy.fixture("test_data").then(data => {
            const email = data.email;
            const password = faker.internet.password();
            // login with invalid credentials
            cy.findByPlaceholderText(constants.emailPlaceHolder).type(email);
            cy.findByPlaceholderText(constants.loginPasswordPlaceHolder).type(password);
            // clicks submit button
            cy.findByRole('button', { name: /sign in/i }).click();
            // wait for the request to complete
            cy.wait('@login').its('response.statusCode').should('eq', 307);
            // check if the error message is displayed
            cy.get('.error-messages').should('exist');
        });
    });
    it('User should require all the input fields', () => {

        // clicks submit button
        cy.findByRole('button', { name: /sign in/i }).click();
        // check if the error message is displayed
        cy.get('.error-messages').should('exist');
        // check for response status code
        cy.wait('@login').its('response.statusCode').should('eq', 307);
    });

});

