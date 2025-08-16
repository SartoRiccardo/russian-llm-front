/**
 * Tests for the login page, implemented in @src/pages/PasswordResetPage.tsx
 * and accessible through @src/pages/LoginPage.tsx
 */
describe('Forgot Password Page', () => {
  /**
   * Check that this page can be accessed though the login page, that a
   * correct email can be entered, and that the button at the end takes
   * the user back to the login screen. This is the only test that
   * organically navigates to the page.
   */
  it('can send the reset password email', () => {
    cy.visit('/login');
    cy.get('[data-cy="forgot-password"]').click();
    cy.location('pathname').should('eq', '/forgot-password');

    cy.intercept(
      'POST',
      `${Cypress.env('VITE_API_BASE_URL')}/forgot-password`,
      {
        statusCode: 204,
      },
    ).as('forgotPassword');

    cy.get('[data-cy="f-forgot-password"]').as('forgotPasswordForm');
    cy.get('@forgotPasswordForm')
      .find('input[name="email"]')
      .type('test@test.com');
    cy.get('@forgotPasswordForm').submit();
    cy.wait('@forgotPassword');

    cy.get('@forgotPasswordForm').should('not.exist');
    cy.get('[data-cy="forgot-password-success-message"]').should('be.visible');
    cy.get('[data-cy="forgot-password-login-link"]').click();
    cy.location('pathname').should('eq', '/login');
  });

  /**
   * Check that the form fields are uneditable while the request is pending
   */
  it('can not edit the form while submitting', () => {
    cy.visit('/forgot-password');
    cy.intercept(
      'POST',
      `${Cypress.env('VITE_API_BASE_URL')}/forgot-password`,
      {
        delay: 1000,
        statusCode: 204,
      },
    ).as('forgotPassword');

    cy.get('[data-cy="f-forgot-password"]').as('forgotPasswordForm');
    cy.get('@forgotPasswordForm').find('input[name="email"]').as('emailInput');
    cy.get('@forgotPasswordForm')
      .find('button[type="submit"]')
      .as('submitButton');

    cy.get('@emailInput').type('test@test.com');
    cy.get('@forgotPasswordForm').submit();

    cy.get('@emailInput').should('be.disabled');
    cy.get('@submitButton').should('be.disabled');
    cy.wait('@forgotPassword');
  });

  describe('Handles Errors', () => {
    it('can not submit when the fields are empty', () => {
      cy.visit('/forgot-password');
      cy.get('[data-cy="f-forgot-password"]').as('forgotPasswordForm');
      cy.get('@forgotPasswordForm').submit();
      cy.get('[data-cy="err-email"]').should('be.visible');
    });

    it('can not submit when the email is invalid', () => {
      cy.visit('/forgot-password');
      cy.get('[data-cy="f-forgot-password"]').as('forgotPasswordForm');
      cy.get('@forgotPasswordForm')
        .find('input[name="email"]')
        .type('invalid-email');
      cy.get('@forgotPasswordForm').submit();
      cy.get('[data-cy="err-email"]').should('be.visible');
    });

    it('displays a toast on server errors', () => {
      cy.visit('/forgot-password');
      cy.intercept(
        'POST',
        `${Cypress.env('VITE_API_BASE_URL')}/forgot-password`,
        { statusCode: 500 },
      ).as('forgotPasswordServerError');

      cy.get('[data-cy="f-forgot-password"]').as('forgotPasswordForm');
      cy.get('@forgotPasswordForm')
        .find('input[name="email"]')
        .type('test@test.com');
      cy.get('@forgotPasswordForm').submit();
      cy.wait('@forgotPasswordServerError');

      cy.get('[data-cy="t-forgot-password-error"]').should('be.visible');
      cy.get('[data-cy^="t-"]').should('have.length', 1);
    });

    it('displays a toast on network errors', () => {
      cy.visit('/forgot-password');
      cy.intercept(
        'POST',
        `${Cypress.env('VITE_API_BASE_URL')}/forgot-password`,
        {
          forceNetworkError: true,
        },
      ).as('forgotPasswordNetworkError');

      cy.get('[data-cy="f-forgot-password"]').as('forgotPasswordForm');
      cy.get('@forgotPasswordForm')
        .find('input[name="email"]')
        .type('test@test.com');
      cy.get('@forgotPasswordForm').submit();
      cy.wait('@forgotPasswordNetworkError');

      cy.get('[data-cy="t-forgot-password-error"]').should('be.visible');
      cy.get('[data-cy^="t-"]').should('have.length', 1);
    });
  });
});
