// validate that the user can register
import {faker} from '@faker-js/faker';
import constants from '.././helper/constants';

describe('Validate Register page', { tags: '@register' },() => {
    
    beforeEach(() => {
      // create login session
      cy.intercept('POST', '**/users').as('register').visit('/register');
    });
  
    it('User should be able to submit the register form', () => {
      // validate that the user can register form
      cy.findByPlaceholderText(constants.usernamePlaceholder).type(
        faker.internet.userName().toLowerCase().replace(/\W/g, '_').substr(0, 20)
      );
      // type email
      cy.findByPlaceholderText(constants.emailPlaceholder).type(
        faker.internet.exampleEmail().toLowerCase()
      );
      // type password
      cy.findByPlaceholderText(constants.createPasswordPlaceHolder).type('Pa$$w0rd!');
      // clicks submit button
      cy.findByRole('button', { name: /sign up/i }).click();
      // wait for the request to complete
      cy.wait('@register').its('response.statusCode').should('equal', 307);
      // check if the user is redirected to home page
      cy.location('pathname').should('be.equal', '/');
    });
  
    it('User should be able to require all the fields', () => {
      // clicks submit button
      cy.findByRole('button', { name: /sign up/i }).click();
      // check if the error message is displayed
      cy.wait('@register').its('response.statusCode').should('equal', 307);
      // check for response status code
      cy.get('.error-messages').within(() => {
        cy.findAllByRole('listitem').should('have.length.greaterThan', 0);
      });
    });
  
    it('should require the username', () => {
      // type email
      cy.findByPlaceholderText(constants.emailPlaceholder).type(
        faker.internet.exampleEmail().toLowerCase()
      );
        // type password
      cy.findByPlaceholderText(constants.createPasswordPlaceHolder).type(
        faker.internet.password()
      );
      // clicks submit button
      cy.findByRole('button', { name: /sign up/i }).click();
        // check if the error message is displayed
      cy.wait('@register').its('response.statusCode').should('equal', 307);
      cy.get('.error-messages').within(() => {
        cy.findByRole('listitem').should('contain.text', 'username');
      });
    });
  
    it('should require the email', () => {
      // type username
      cy.findByPlaceholderText(constants.usernamePlaceholder).type(
        faker.internet.userName().toLowerCase().replace(/\W/g, '_').substr(0, 20)
      );
        // type password
      cy.findByPlaceholderText(constants.createPasswordPlaceHolder).type(
        faker.internet.password()
      );
        // clicks submit button
      cy.findByRole('button', { name: /sign up/i }).click();
        // check if the error message is displayed
      cy.wait('@register').its('response.statusCode').should('equal', 307);
        
      cy.get('.error-messages').within(() => {
        cy.findByRole('listitem').should('contain.text', 'email');
      });
    });
  
    it('User should require the password', () => {
      // type username
      cy.findByPlaceholderText(constants.usernamePlaceholder).type(
        faker.internet.userName().toLowerCase().replace(/\W/g, '_').substr(0, 20)
      );
      // type email
      cy.findByPlaceholderText(constants.emailPlaceholder).type(
        faker.internet.email().toLowerCase()
      );
      // clicks submit button
      cy.findByRole('button', { name: /sign up/i }).click();
      cy.wait('@register').its('response.statusCode').should('equal', 307);
      cy.get('.error-messages').within(() => {
        cy.findByRole('listitem').should('contain.text', 'password');
      });
    });
  
    it('User should be able to navigate to login page', () => {
      // clicks login link
      cy.findByRole('link', { name: /have an account/i }).click();
      // check if the user is redirected to login page
      cy.location('pathname').should('be.equal', '/login');
    });
});    
