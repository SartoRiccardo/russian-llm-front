describe('Exercises Page', () => {
  describe('Authenticated user', () => {
    beforeEach(() => {
      cy.login();
      cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/exercises`, {
        fixture: 'russian-llm-api/exercises.json',
      }).as('getExercises');
    });

    describe('Happy Path', () => {
      it('loads the page correctly', () => {
        cy.visit('/exercises');
        cy.wait('@getExercises');

        cy.get('[data-cy=exercise-container]').as('container');
        cy.get('@container').should('be.visible');

        // The first group should be Alphabet
        cy.get('@container')
          .eq(0)
          .find('[data-cy=exercise][data-cy-type=alphabet]')
          .should('have.length', 2);

        // The second group should be Grammar
        cy.get('@container')
          .eq(1)
          .find('[data-cy=exercise][data-cy-type=grammar]')
          .should('have.length', 2);

        // Check that the locked exercise is handled correctly
        cy.get('[data-cy=exercise][data-cy-id="4"]').should(
          'have.attr',
          'data-locked',
          'true',
        );
      });

      it('navigates to an exercise page when clicked', () => {
        cy.visit('/exercises');
        cy.wait('@getExercises');

        // Click on the first exercise (id 1)
        cy.get('[data-cy=exercise][data-cy-id="1"]').click();
        cy.url().should('include', '/exercises/1');
      });
    });

    describe('Error Handling', () => {
      it('retries on network errors', () => {
        cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/exercises`, {
          forceNetworkError: true,
        }).as('getExercisesError');
        cy.clock();
        cy.visit('/exercises');

        cy.wait('@getExercisesError');
        cy.tick(2000);
        cy.wait('@getExercisesError');

        // Allow the call to succeed
        cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/exercises`, {
          fixture: 'russian-llm-api/exercises.json',
        }).as('getExercisesSuccess');
        cy.tick(2000);
        cy.wait('@getExercisesSuccess');

        cy.get('[data-cy=exercise]').should('have.length', 4);
      });

      it('shows an error page on server errors', () => {
        cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/exercises`, {
          statusCode: 500,
        }).as('getExercisesError');
        cy.visit('/exercises');
        cy.wait('@getExercisesError');

        cy.get('[data-cy=page-error]').should('be.visible');
      });

      it('redirects to login on unauthorized error and returns after login', () => {
        cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/exercises`, {
          statusCode: 401,
        }).as('getExercisesUnauthorized');
        cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/logout`, {
          statusCode: 200,
        }).as('getLogout');
        cy.visit('/exercises');
        cy.wait('@getExercisesUnauthorized');
        cy.wait('@getLogout');

        cy.location('pathname').should('eq', `/login`);
        cy.location('search').should(
          'eq',
          `?redirect=${encodeURIComponent('/exercises')}`,
        );

        // Mock login flow
        cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/exercises`, {
          fixture: 'russian-llm-api/exercises.json',
        }).as('getExercises');
        cy.intercept('POST', `${Cypress.env('VITE_API_BASE_URL')}/login`, {
          fixture: 'russian-llm-api/login-success.json',
          statusCode: 200,
        }).as('loginRequest');
        cy.get('[data-cy=f-login]')
          .find('input[name=email]')
          .type('test@example.com');
        cy.get('[data-cy=f-login]')
          .find('input[name=password]')
          .type('password123');
        cy.get('[data-cy=f-login]').submit();
        cy.wait('@loginRequest');

        // Should be redirected back
        cy.url().should('include', '/exercises');
        cy.wait('@getExercises');
        cy.get('[data-cy=exercise]').should('have.length', 4);
      });
    });
  });

  describe('Unauthenticated user', () => {
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
      cy.intercept('GET', `${Cypress.env('VITE_API_BASE_URL')}/logout`, {
        statusCode: 200,
      }).as('getLogout');

      cy.visit('/exercises');

      cy.wait('@checkLoginStatusUnauthorized');
      cy.wait('@getLogout');

      cy.location('pathname').should('eq', '/login');
    });

    it('redirects to /login if the user is not logged in (via localStorage)', () => {
      cy.clearLocalStorage();
      cy.visit('/exercises');
      cy.location('pathname').should('eq', '/login');
    });
  });
});
