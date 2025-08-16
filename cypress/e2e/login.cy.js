/**
 * Tests for the login page, implemented in @src/pages/LoginPage.tsx
 */
describe('Login Page', () => {
  beforeEach(() => {
    cy.visit(`/login`);

    // Alias common selectors
    cy.get('[data-cy="f-login"]').as('loginForm');
    cy.get('@loginForm').find('input[name="email"]').as('emailInput');
    cy.get('@loginForm').find('input[name="password"]').as('passwordInput');
    cy.get('@loginForm').find('button[type="submit"]').as('submitButton');
  });

  /**
   * Check that logging in with correct credentials works and redirects to "/".
   */
  it('logs in successfully', () => {
    cy.intercept('POST', `${Cypress.env('VITE_API_BASE_URL')}/login`, {
      fixture: 'russian-llm-api/login-success.json',
      statusCode: 200,
    }).as('loginSuccess');

    cy.get('@emailInput').type('test@test.com');
    cy.get('@passwordInput').type('password');
    cy.get('@loginForm').submit();
    cy.wait('@loginSuccess');
    cy.location('pathname').should('eq', '/');
  });

  /**
   * Check that the form fields are uneditable while the request is pending
   */
  it('can not edit the form while submitting', () => {
    cy.intercept('POST', `${Cypress.env('VITE_API_BASE_URL')}/login`, {
      delay: 1000,
      fixture: 'russian-llm-api/login-success.json',
      statusCode: 200,
    }).as('loginPending');

    cy.get('@emailInput').type('test@test.com');
    cy.get('@passwordInput').type('password');
    cy.get('@loginForm').submit();

    cy.get('@emailInput').should('be.disabled');
    cy.get('@passwordInput').should('be.disabled');
    cy.get('@submitButton').should('be.disabled');
    cy.wait('@loginPending');
  });

  describe('Handles Errors', () => {
    /**
     * Check that the correct toast appears when submitting with incorrect credentials
     */
    it('displays a toast when the credentials are incorrect', () => {
      cy.intercept('POST', `${Cypress.env('VITE_API_BASE_URL')}/login`, {
        statusCode: 422,
      }).as('loginIncorrectCredentials');

      cy.get('@emailInput').type('wrong@test.com');
      cy.get('@passwordInput').type('wrongpassword');
      cy.get('@loginForm').submit();
      cy.wait('@loginIncorrectCredentials');

      cy.get('[data-cy="t-wrong-credentials"]').as('errorToast');
      cy.get('@errorToast').should('be.visible');
      cy.get('[data-cy^="t-"]').should('have.length', 1); // Check for only one toast
    });

    it('can not submit when the fields are empty', () => {
      cy.get('@loginForm').submit();
      //! Add data-cy attributes to these error messages instead of checking for content
      cy.get('@loginForm').contains('Email is required').should('be.visible');
      cy.get('@loginForm')
        .contains('Password is required')
        .should('be.visible');
    });

    it('can not submit when the email is invalid', () => {
      cy.get('@emailInput').type('invalid-email');
      cy.get('@loginForm').submit();
      cy.get('@loginForm')
        .contains('Invalid email address')
        .should('be.visible');
    });

    /**
     * Check that the correct toast appears when receiving a 5xx response
     */
    it('displays a toast on server errors', () => {
      // Mock a server error response
      cy.intercept('POST', `${Cypress.env('VITE_API_BASE_URL')}/login`, {
        statusCode: 500,
      }).as('loginServerError');

      cy.get('@emailInput').type('test@test.com');
      cy.get('@passwordInput').type('password');
      cy.get('@loginForm').submit();
      cy.wait('@loginServerError');

      cy.get('[data-cy="t-wrong-credentials"]').as('errorToast');
      cy.get('@errorToast').should('be.visible');
      cy.get('[data-cy^="t-"]').should('have.length', 1); // Check for only one toast
    });

    /**
     * Check that the correct toast appears on network error
     */
    it('displays a toast on network errors', () => {
      // Mock a network error
      cy.intercept('POST', `${Cypress.env('VITE_API_BASE_URL')}/login`, {
        forceNetworkError: true,
      }).as('loginNetworkError');

      cy.get('@emailInput').type('test@test.com');
      cy.get('@passwordInput').type('password');
      cy.get('@loginForm').submit();
      cy.wait('@loginNetworkError');

      cy.get('[data-cy="t-wrong-credentials"]').as('errorToast');
      cy.get('@errorToast').should('be.visible');
      cy.get('[data-cy^="t-"]').should('have.length', 1); // Check for only one toast
    });
  });
});
