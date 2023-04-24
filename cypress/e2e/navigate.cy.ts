// validate that the user can navigate around the site
import {faker} from '@faker-js/faker';
import constants from '.././helper/constants';

describe('Validate navigation', { tags: '@navigate' },() => {

    beforeEach(() => {
        // create login session
        cy.intercept('**/articles?*')
          .as('getAllArticles')
          .intercept('**/tags')
          .as('getAllTags')
          .intercept('**/articles/*/comments')
          .as('getCommentsForArticle')
          .intercept('**/articles/*')
          .as('getArticle')
          .visit('/');
      });
    
    it('User should be able to navigate to login page', () => {
        // navigate to login page
        cy.findByRole('link', {
            name: /sign in/i,
          }).click();
        // validate that the user is on login page
        cy.location('pathname').should('equal', '/login');
        // validate that the user can see the login form
        cy.findByRole('heading', {name: /sign in/i,});
    });

    it('User should be able to navigate to register page', () => {
        // navigate to register page
        cy.findByRole('link', {
            name: /sign up/i,
          }).click();
        // validate that the user is on register page
        cy.location('pathname').should('equal', '/register');
        // validate that the user can see the register form
        cy.findByRole('heading', {name: /sign up/i,});
    });

    it('User should be able to navigate to home page', () => {
        // navigate to home page
        cy.findByRole('link', {
            name: /home/i,
          }).click();
        // validate that the user is on home page
        cy.location('pathname').should('equal', '/');
        // validate that the user can see the home page
        cy.findByRole('heading', {name: /conduit/i,});
    });

    it('Use should be to navigate to first article', () => {
        // navigate to first article
        cy.get('.preview-link')
        .first()
        .within(() => {
          // click on the first article
          cy.findByText('Read more...').click();
          // wait for the request to complete
          cy.wait(['@getArticle', '@getCommentsForArticle']);
            // validate that the user is on the article page
          cy.location('pathname').should('match', /\/article\/[\w-]+/);
        });
    });

    it('User should be able to navigate by tags', () => {
        // navigate by tags
        cy.wait('@getAllTags')
           // get the tags from the response
          .its('response.body')
          .then(({ tags }) => {
            // click on a random tag
            let tag = tags[Math.floor(Math.random() * tags.length)];
            cy.get('.sidebar').findByText(tag).click();
            cy.wait('@getAllArticles');
            // validate that the tag is active
            cy.get('.feed-toggle').findByText(tag).should('have.class', 'active');
            cy.get('.pagination').findByText('2').click();
            // validate that the tag is still active
            cy.wait('@getAllArticles');
            tag = tags[Math.floor(Math.random() * tags.length)];
            cy.get('.sidebar').findByText(tag).click();
            cy.wait('@getAllArticles');
        });
    });
});


describe('Validate navigation with user login', () => {
    beforeEach(() => {
        cy.intercept('**/articles?*')
          .as('getAllArticles')
          .intercept('**/tags')
          .as('getAllTags')
          .intercept(`**/profiles/*`)
          .as('getProfile')
          .login();
      });
    it("User should be able to navigate to settings page", () => {
        // navigate to settings page
        cy.findByRole('link', {
            name: /settings/i,
          }).click();
        // validate that the user is on settings page
        cy.location('pathname').should('equal', '/settings');
        // validate that the user can see the settings page
        cy.findByRole('heading', {name: /your settings/i,});
    });

    it("User should be able to navigate to profile page", () => {
        // navigate to profile page
        cy.fixture('test_data').then((data) => {
            cy.findByRole('link', {
                name: RegExp(data.username, 'i'),
              }).click();
            // validate that the user is on profile page
            // cy.location('pathname').should('contains', `/${data.username}`);
            // validate that the user can see the profile page
            cy.get('.user-info').within(() => {
                cy.findByRole('img', Cypress.env('username')).should('be.visible');
          
                cy.findByRole('heading', Cypress.env('username')).should('be.visible');
            });
        });
    });

    it("User should be able to navigate to new article page", () => {
        // navigate to new article page
        cy.wait('@getAllTags');
        // click on the new post button
        cy.findByRole('link', {
            name: /new post/i,
        })
        .click();
        cy.location('pathname').should('equal', '/editor');
    });
}); 