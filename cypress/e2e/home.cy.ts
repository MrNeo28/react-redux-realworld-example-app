// validate home page

// ** Home page **
describe('Validate Home page', { tags: '@home_page' },() => {
    beforeEach(() => {
      // create login session
      cy.intercept('**/articles?**')
        .as('getAllArticles')
        .intercept('**/tags')
        .as('getAllTags')
        .visit('/');
    });
  
    it('User should be able to show the app name', () => {
      // validate that the user can see the app name
      cy.get('.banner').within(() => {
        cy.findByRole('heading', { level: 1, name: /conduit/i }).should(
          'be.visible'
        );
        cy.findByText('A place to share your knowledge.').should('be.visible');
      });
    });
  
    it('User should have a header navbar', () => {
      // validate that the user can see the header navbar
      cy.findByRole('navigation').within(() => {
        cy.findByRole('link', { name: /conduit/i }).should(
          'have.attr',
          'href',
          '/'
        );
          // validate that the user can see the home link
        cy.findByRole('link', { name: /home/i }).should('have.attr', 'href', '/');
          // validate that the user can see the sign in link
        cy.findByRole('link', { name: /sign in/i }).should(
          'have.attr',
          'href',
          '/login'
        );
        // validate that the user can see the sign up link
        cy.findByRole('link', { name: /sign up/i }).should(
          'have.attr',
          'href',
          '/register'
        );
      });
    });
  
    it('should render the list of articles', () => {
    // validate that the user can see the list of articles
     cy.get('.feed-toggle > .nav > .nav-item > .nav-link').should('be.visible');
    // validate that the user can see the global feed link
      cy.wait('@getAllArticles')
        .its('response.body')
        .then((body) => {
          cy.get('.article-preview').should('have.length.greaterThan', 1);
  
          Cypress._.each(body.articles, (article, index) => {
            cy.get('.article-preview')
              .eq(index)
              .within(() => {
                // validate that the user can see the article details
                cy.findByRole('img', { name: article.author.username });
                cy.findByText(article.author.username);
                cy.findByRole('heading').should('have.text', article.title);
                cy.get('p').should('have.text', article.description);
                cy.findByRole('list')
                  .children()
                  .should('have.length', article.tagList.length);
                cy.findByRole('list').within(() => {
                  Cypress._.each(article.tagList, (tag) => {
                    cy.findByText(tag);
                  });
                });
              });
          });
        });
    });
  
    it('should render the list of tags', () => {
      // validate that the user can see the list of tags
      cy.wait('@getAllTags')
        .its('response.body')
        .then((body) => {
          cy.get('.sidebar').within(() => {
            cy.findByText('Popular Tags').should('be.visible');
          });
        });
    });
  
    it('should show the pagination', () => {
      // validate that the user can see the pagination
      cy.wait('@getAllArticles')
        .its('response.body')
        .then((body) => {
          cy.get('.pagination').within(() => {
            cy.findAllByRole('listitem').should('have.length.above', 2);
          });
        });
    });
});
  