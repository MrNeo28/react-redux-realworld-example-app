// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/// <reference types='cypress' />
/// <reference types='cypress-tags' />
import '@testing-library/cypress/add-commands';
import { faker } from '@faker-js/faker';

// -- Login User using the API using cy.session --
Cypress.Commands.add('login', () => {
    cy.fixture("test_data").then(data => {
        const email = data.email;
        const password = data.password;
        cy.session([email, password], () => {
            cy.visit('/')
              .request(
                {
                    method: 'POST',
                    url: `${data.apiUrl}/users/login`,
                    body: {
                        user: { email, password }}
                }).then((body) => {
                    window.localStorage.setItem('jwt', body.body.user.token)
                });
        });
    });
    cy.visit('/');
});

// -- Create Article using the API --
Cypress.Commands.add('createArticle', () => {
    cy.fixture("test_data").then(data => {
        cy.request({
            method: 'POST',
            url: `${data.apiUrl}/articles`,
            body: {
                article: {
                    title: faker.company.catchPhrase(),
                    description: faker.commerce.productDescription(),
                    body: faker.lorem.paragraph(),
                    tagList: [faker.commerce.productName()]
                },
            },
            headers: {
                authorization: `Token ${localStorage.getItem('jwt')}`,
              },
        }).its('body.article');
    })
});
                    