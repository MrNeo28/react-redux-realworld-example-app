// import helper functions
import { faker } from '@faker-js/faker';
import constants from '.././helper/constants';

// ** Editor page **
describe('Add New article', { tags: '@editor' },() => {
  beforeEach(() => {
    // create login session
    cy.login();
    cy.intercept('POST', '**/articles').as('createArticle');
    // navigate to editor page
    cy.findByRole('link', {
      name: /new post/i,
    }).click();
  });

  it('User should be able to submit a new article', () => {
    // fill the form
    cy.findByPlaceholderText(constants.titlePlaceholder).type(faker.lorem.words());
    cy.findByPlaceholderText(constants.descriptionPlaceholder).type(
      faker.lorem.sentence(),
      { delay: 1 }
    );
    cy.findByPlaceholderText(constants.bodyPlaceholder).type(faker.lorem.paragraphs(), {
      delay: 1,
    });
    cy.findByPlaceholderText(constants.tagPlaceholder).type(
      'react{enter}redux{enter}lorem ipsum{enter}'
    );
    // submit the form
    cy.findByRole('button', { name: constants.submitArticleButton }).click();
    // validate that the user is on the article page
    cy.wait('@createArticle').its('response.statusCode').should('equal', 307);
    cy.location('pathname').should('match', /\/article\/[\w-]+/);
  });

  it('should validate the form', () => {
    // submit the form
    cy.findByRole('button', { name: constants.submitArticleButton }).click();
    // validate that the user is on the article page
    cy.wait('@createArticle').its('response.statusCode').should('equal', 307);
    // cy.get('.error-messages').within(() => {
    //   cy.findAllByRole('listitem').should('have.length', 3);
    // });
  });

  it('should add or remove tags', () => {
    cy.get('.tag-list').as('tagList').should('be.empty');
    cy.findByPlaceholderText(constants.tagPlaceholder).type(
      'lorem{enter}ipsum{enter}dolor{enter}sit{enter}amet{enter}'
    );
    cy.get('@tagList').children().should('have.length', 5);
    cy.get('@tagList').within(() => {
      cy.findByText('dolor').find('i').click();
      cy.findByText('sit').find('i').click();
    });
    cy.get('@tagList').children().should('have.length', 3);
  });
});