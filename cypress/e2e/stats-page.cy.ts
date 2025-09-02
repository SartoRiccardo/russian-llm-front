describe('Stats and Vocabulary Page', () => {
  beforeEach(() => {
    cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/stats`, {
      fixture: 'russian-llm-api/stats.json',
    }).as('getStats');
  });

  describe('Stats Page', () => {
    it('loads the page correctly', () => {
      cy.visit('/stats');
      cy.wait('@getStats');

      cy.get('[data-cy=skill-list]').as('skillList');
      cy.get('@skillList').should('be.visible');
      cy.get('@skillList')
        .find('[data-cy=skill-item]')
        .should('have.length', 4);

      cy.get('[data-cy=words-link]').should('be.visible');
    });

    it('navigates to the vocabulary page', () => {
      cy.visit('/stats');
      cy.wait('@getStats');

      cy.get('[data-cy=words-link]').click();
      cy.url().should('include', '/vocabulary');
      cy.get('[data-cy=word-skill]').should('have.length', 3);
    });
  });

  describe('Vocabulary Page', () => {
    beforeEach(() => {
      cy.visit('/vocabulary');
      cy.wait('@getStats');
    });

    it('expands a word skill to show its subcategories', () => {
      cy.get('[data-cy=word-skill]').first().click();

      cy.get('[data-cy=subcategory-section]').should('be.visible');
      // From the fixture, the first skill (verbs) has 2 subcategories
      cy.get('[data-cy=subcategory-section]')
        .find('[data-cy^=subcategory-]')
        .should('have.length', 2);
    });

    it('shows a modal with rules when a subcategory is clicked', () => {
      cy.get('[data-cy=word-skill]').first().click();
      // From the fixture, the first subcategory of the first skill is 'present-tense'
      cy.get('[data-cy=subcategory-present-tense]').click();

      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=grammar-rules]').should('be.visible');
      // From the fixture, the first subcategory of the first skill has 2 rules.
      cy.get('[data-cy=grammar-rules]')
        .find('[data-cy=rule-item]')
        .should('have.length', 2);
    });
  });

  describe('Error Handling', () => {
    it('shows an error page on server errors (Stats Page)', () => {
      cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/stats`, {
        statusCode: 500,
      }).as('getStatsError');
      cy.visit('/stats');
      cy.wait('@getStatsError');

      cy.get('[data-cy=page-error]').should('be.visible');
    });

    it('retries on network errors (Stats Page)', () => {
      cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/stats`, {
        forceNetworkError: true,
      }).as('getStatsNetworkError');
      cy.clock();
      cy.visit('/stats');

      cy.wait('@getStatsNetworkError');
      cy.tick(2000);
      cy.wait('@getStatsNetworkError');

      cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/stats`, {
        fixture: 'russian-llm-api/stats.json',
      }).as('getStatsSuccess');
      cy.tick(2000);
      cy.wait('@getStatsSuccess');

      cy.get('[data-cy=skill-list]').should('be.visible');
    });

    it('shows a toast and retries on server errors (Vocabulary Page)', () => {
      cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/stats`, {
        statusCode: 503,
      }).as('getStatsError');
      cy.clock();
      cy.visit('/vocabulary');

      cy.wait('@getStatsError');
      cy.get('[data-cy=t-vocab-server-error]').should('be.visible');

      // Check for retry with exponential backoff
      cy.tick(1000);
      cy.wait('@getStatsError');
      cy.tick(2000);
      cy.wait('@getStatsError');
    });

    it('redirects to login on unauthorized error and returns after login', () => {
      cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/stats`, {
        statusCode: 401,
      }).as('getStatsUnauthorized');
      cy.visit('/stats');
      cy.wait('@getStatsUnauthorized');

      cy.url().should('include', '/login?redirect=%2Fstats');

      cy.intercept('POST', `${Cypress.env('VITE_API_BASE_URL')}/login`, {
        fixture: 'russian-llm-api/login-success.json',
      }).as('loginRequest');
      cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/stats`, {
        fixture: 'russian-llm-api/stats.json',
      }).as('getStats');

      cy.get('input[name=email]').type('test@example.com');
      cy.get('input[name=password]').type('password123');
      cy.get('[data-cy=f-login]').submit();

      cy.wait('@loginRequest');
      cy.url().should('include', '/stats');
      cy.wait('@getStats');
      cy.get('[data-cy=skill-list]').should('be.visible');
    });
  });
});
