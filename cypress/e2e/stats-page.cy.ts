describe('Stats Page', () => {
  describe('Authenticated user', () => {
    beforeEach(() => {
      cy.login();
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

      it('redirects to login on unauthorized error and returns after login', () => {
        cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/stats`, {
          statusCode: 401,
        }).as('getStatsUnauthorized');
        cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/logout`, {
          statusCode: 200,
        }).as('getLogout');

        cy.visit('/stats');
        cy.wait('@getStatsUnauthorized');
        cy.wait('@getLogout');

        cy.url().should(
          'include',
          `/login?redirect=${encodeURIComponent('/stats')}`,
        );

        cy.intercept('POST', `${Cypress.env('VITE_API_BASE_URL')}/login`, {
          fixture: 'russian-llm-api/login-success.json',
        }).as('loginRequest');
        cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/stats`, {
          fixture: 'russian-llm-api/stats.json',
        }).as('getStats');

        cy.get('[data-cy=f-login] input[name=email]').type('test@example.com');
        cy.get('[data-cy=f-login] input[name=password]').type('password123');
        cy.get('[data-cy=f-login]').submit();

        cy.wait('@loginRequest');
        cy.url().should('include', '/stats');
        cy.wait('@getStats');
        cy.get('[data-cy=skill-list]').should('be.visible');
      });
    });
  });

  describe('Unauthenticated user', () => {
    describe('Stats Page', () => {
      it('redirects to /login if the user is not logged in (via API)', () => {
        cy.login();
        // Override the login check to simulate a logged-out user
        cy.intercept(
          'GET',
          `${Cypress.env('VITE_API_BASE_URL')}/check-login-status`,
          {
            statusCode: 401,
            body: {
              message: 'Unauthorized',
            },
          },
        ).as('checkLoginStatusUnauthorized');

        cy.visit('/stats');
        cy.wait('@checkLoginStatusUnauthorized');
        cy.location('pathname').should('eq', '/login');
      });

      it('redirects to /login if the user is not logged in (via localStorage)', () => {
        cy.clearLocalStorage();
        cy.visit('/stats');
        cy.location('pathname').should('eq', '/login');
      });
    });
  });
});
