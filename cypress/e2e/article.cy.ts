// import helper functions
import { faker } from '@faker-js/faker';
import constants from '.././helper/constants';

// ** Article page **
describe('Validate Article page', { tags: '@article' },() => {
  beforeEach(() => {
    // create login session
    cy.intercept('GET', '**/articles?*')
      .as('getAllArticles')
      .intercept('GET', '**/articles/*/comments')
      .as('getCommentsForArticle')
      .intercept('GET', '/articles/*')
      .as('getArticle')
      .visit('/');
    // navigate to first article
    cy.wait('@getAllArticles').get('.preview-link').first().click();
  });

  it('should show the article', () => {
    // wait for the request to complete
    cy.wait('@getAllArticles')
      .its('response.body.articles')
      .then((article) => {
        // validate that the user is on article page
        cy.findByRole('heading', { name: article.title }).should('be.visible');
        // validate that the user can see the article
        cy.get('.article-meta')
          .find('img')
          .should('be.visible');
        cy.get('.author').should('be.visible');
        cy.get('.article-content .col-xs-12')
          .children()
          .first()
          .should('not.be.empty');
      });
  });

  it('should require to be logged to comment', () => {
    cy.findByText(/to add comments on this article/i).should('be.visible');
  });
});

// ** Article page (authenticated) **
// IMPORTANT: This test suite is skipped by default. To run it, remove the 'x' from 'xit'
describe('Article page (authenticated)', () => {

  beforeEach(() => {
    // create login session
    cy.intercept('GET', '**/articles?*')
      .as('getAllArticles')
      .intercept('GET', '**/articles/*/comments')
      .as('getCommentsForArticle')
      .intercept('GET', '**/articles/*')
      .as('getArticle')
      .intercept('POST', '**/articles/*/comments')
      .as('createComment')
      .intercept('DELETE', '**/articles/*/comments/*')
      .as('deleteComment')
      .login();
    // navigate to first article
    cy.wait('@getAllArticles').get('.preview-link').first().click();


  });

 xit('should show the comment box', () => {
  // wait for the request to complete and validate that the user can see the comment box
    cy.wait(['@getArticle', '@getCommentsForArticle']);
    cy.get('.comment-form').should('exist');
  });

  xit('should add a new comment', () => {
    // wait for the request to complete and validate that the user can add a new comment
    const comment = faker.lorem.paragraph();
    cy.wait(['@getArticle', '@getCommentsForArticle']);
    cy.findByPlaceholderText(constants.commentPlaceholder).type(comment);
    cy.findByRole('button', { name: constants.postCommentButton }).click();
    cy.wait('@createComment').its('response.statusCode').should('equal', 200);
    cy.wait(100)
      .get('.card:not(form)')
      .first()
      .within(() => {
        cy.findByText(comment).should('exist');
      });
  });

  xit('should validate the comment box', () => {
    cy.wait(['@getArticle', '@getCommentsForArticle']);

    cy.findByRole('button', { name: constants.postCommentButton }).click();

    cy.wait('@createComment').its('response.statusCode').should('equal', 422);

    cy.get('.error-messages').within(() => {
      cy.findAllByRole('listitem').should('have.length', 1);
    });
  });

  xit('should remove my own comment', () => {
    const comment = faker.lorem.sentence();

    cy.wait(['@getArticle', '@getCommentsForArticle']);

    cy.findByPlaceholderText(constants.commentPlaceholder).type(comment);

    cy.findByRole('button', { name: constants.postCommentButton }).click();

    cy.wait('@createComment');

    cy.findByText(comment)
      .as('comment')
      .parent()
      .parent()
      .find('.mod-options i')
      .click();

    cy.wait('@deleteComment').its('response.statusCode').should('equal', 307);

    cy.findByText(comment).should('not.exist');
  });
});
