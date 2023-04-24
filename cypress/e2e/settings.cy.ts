import {faker} from '@faker-js/faker';
import constants from '.././helper/constants';

describe('Validate setting page',  { tags: '@settings' }, () => {
    beforeEach(() => {
        // create login session
        cy.login();
        // navigate to settings page
        cy.findByRole('link', {
            name: /settings/i,
          }).click();
       // intercept PUT request to update user
        cy.intercept('PUT', '**/user').as('updateUser');
    });

    afterEach(() => {
        cy.location('pathname').should('equal', '/');
    });

    it('should be able to update user settings', () => {
        // update user settings 
        // clear the existing data and type new data

        cy.findByPlaceholderText(constants.imagePlaceholder)
            .clear()
            .type(faker.image.avatar());

        // updates bio
        cy.findByPlaceholderText(constants.bioPlaceholder)
            .clear()
            .type(faker.lorem.sentence());
        // clicks on submit button
        cy.findByRole('button', {name: constants.submitButton}).click();
        // wait for the request to complete
        cy.wait('@updateUser').its('response.statusCode').should('eq', 307);    
    });

    it('should be able to update password', () => {
        // update password
        cy.findByPlaceholderText(constants.passwordPlaceholder).type('newpassword');
        cy.findByRole('button', {name: constants.submitButton}).click();
        // wait for the request to complete
        cy.wait('@updateUser').its('response.statusCode').should('eq', 307);
    });

    it('should be able to logout', () => {
        // logout
        cy.findByRole('button', {name: 'Or click here to logout.'}).click();
    });
});