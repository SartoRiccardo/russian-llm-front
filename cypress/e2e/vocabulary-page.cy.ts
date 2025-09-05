describe('Vocabulary Page', () => {
  beforeEach(() => {
    cy.login();

    // Mock dependencies for the page
    cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/stats`, {
      fixture: 'russian-llm-api/stats.json',
    }).as('getStats');
    cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/words?page=1`, {
      fixture: 'russian-llm-api/words-page-1.json',
    }).as('getWordsPage1');
    cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/words?page=2`, {
      fixture: 'russian-llm-api/words-page-2.json',
    }).as('getWordsPage2');
    cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/words?page=3`, {
      fixture: 'russian-llm-api/words-page-3.json',
    }).as('getWordsPage3');
  });

  describe('Happy Path', () => {
    it('loads the first page and appends the next on scroll', () => {
      cy.visit('/vocabulary');
      cy.wait('@getStats');
      cy.wait('@getWordsPage1');

      cy.get('[data-cy=word-category]').should('have.length', 1);

      cy.get('[data-cy=loader]').scrollIntoView();
      cy.wait('@getWordsPage2');
      cy.get('[data-cy=word-category]').should('have.length', 2);

      cy.get('[data-cy=loader]').scrollIntoView();
      cy.wait('@getWordsPage3');
      cy.get('[data-cy=word-category]').should('have.length', 3);

      cy.get('[data-cy=loader]').should('not.exist');
    });

    it('expands a category to show correctly sorted words', () => {
      cy.visit('/vocabulary');
      cy.wait('@getWordsPage1');

      cy.get('[data-cy=word-item]').should('not.exist');
      cy.get('[data-cy=word-category]').first().click();
      cy.get('[data-cy=word-item]').should('have.length', 2);

      cy.get('[data-cy=word-item]')
        .first()
        .find('[data-cy=word-ru]')
        .should('have.text', 'чай');
      cy.get('[data-cy=word-item]')
        .last()
        .find('[data-cy=word-ru]')
        .should('have.text', 'кофе');
    });

    it('shows a modal with word variants when the info button is clicked', () => {
      cy.visit('/vocabulary');
      cy.wait('@getWordsPage1');
      cy.get('[data-cy=word-category]').first().click();

      cy.get('[data-cy=word-item]')
        .first()
        .find('[data-cy=word-info-button]')
        .click();

      cy.get('[data-cy=modal]').as('modal');
      cy.get('@modal').should('be.visible');
      cy.get('@modal').find('[data-cy=word-group]').should('be.visible');
      cy.get('@modal')
        .find('[data-cy=variant-item]')
        .should('have.length.at.least', 1);
    });

    it('replaces modal content with highlighted rules and handles returning', () => {
      cy.visit('/vocabulary');
      cy.wait('@getWordsPage1');
      cy.get('[data-cy=word-category]').first().click();
      cy.get('[data-cy=word-item]')
        .last()
        .find('[data-cy=word-info-button]')
        .click();

      cy.get('[data-cy=modal]').as('modal');
      cy.get('@modal').should('be.visible');

      cy.get('@modal')
        .find('[data-cy=variant-item]')
        .first()
        .find('[data-cy=variant-rules-button]')
        .click();

      cy.get('@modal').find('[data-cy=grammar-rules]').should('be.visible');
      cy.get('@modal')
        .find('[data-cy=highlighted-rule]')
        .should('have.length', 1);

      cy.get('@modal').find('[data-cy=modal-back-button]').click();
      cy.get('@modal').find('[data-cy=grammar-rules]').should('not.exist');
      cy.get('@modal').find('[data-cy=variant-item]').should('be.visible');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('hides rule buttons when stats data is unavailable', () => {
      cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/stats`, {
        forceNetworkError: true,
      }).as('getStatsError');
      cy.visit('/vocabulary');
      cy.wait('@getWordsPage1');

      cy.get('[data-cy=word-category]').first().click();
      cy.get('[data-cy=word-item]')
        .first()
        .find('[data-cy=word-info-button]')
        .click();

      cy.get('[data-cy=variant-rules-button]').should('not.exist');
    });

    it('retries with exponential backoff on server errors', () => {
      cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/words?page=1`, {
        statusCode: 503,
      }).as('getWordsError');
      cy.clock();
      cy.visit('/vocabulary');

      cy.wait('@getWordsError');
      cy.tick(1000);
      cy.wait('@getWordsError');
      cy.tick(2000);
      cy.wait('@getWordsError');

      cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/words?page=1`, {
        fixture: 'russian-llm-api/words-page-1.json',
      }).as('getWordsSuccess');
      cy.tick(4000);
      cy.wait('@getWordsSuccess');
      cy.get('[data-cy=word-category]').should('be.visible');
    });

    it('redirects to login on unauthorized error', () => {
      cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/words?page=1`, {
        statusCode: 401,
      }).as('getWordsUnauthorized');
      cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/logout`, {
        statusCode: 200,
      }).as('getLogout');
      cy.visit('/vocabulary');
      cy.wait('@getWordsUnauthorized');
      cy.wait('@getLogout');
      cy.url().should('include', '/login?redirect=%2Fvocabulary');
    });
  });
});
