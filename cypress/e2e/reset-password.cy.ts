/**
 * Tests the reset password page, implemented in @src/pages/PasswordResetPage.tsx
 */
describe('Reset Password Page', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      new RegExp(`${Cypress.env('VITE_API_BASE_URL')}/validate-token.*`),
      {
        statusCode: 204,
      },
    ).as('validateToken');
  });

  /**
   * Check that a correct flow where the user types 2 passwords
   * up to standard works and submits correctly, and the button takes
   * the user back to the home page.
   */
  it('can reset the password', () => {
    cy.visit('/password-reset?token=valid-token');
    cy.wait('@validateToken');

    cy.intercept('PUT', `${Cypress.env('VITE_API_BASE_URL')}/password-reset`, {
      statusCode: 204,
    }).as('resetPassword');

    cy.get('[data-cy="f-password-reset"]').as('resetPasswordForm');
    cy.get('@resetPasswordForm')
      .find('input[name="password"]')
      .type('NewPassword1!');
    cy.get('@resetPasswordForm')
      .find('input[name="repeatPassword"]')
      .type('NewPassword1!');
    cy.get('@resetPasswordForm').submit();
    cy.wait('@resetPassword');

    cy.get('@resetPasswordForm').should('not.exist');
    cy.get('[data-cy="password-changed-message"]').should('be.visible');
    cy.get('[data-cy="login-link-after-reset"]').click();
    cy.location('pathname').should('eq', '/login');
  });

  /**
   * Check that if the user is already logged in navigating to this
   * page redirects to settings. Use the login helper command.
   */
  it('redirects to settings if logged in', () => {
    cy.login();
    cy.visit('/password-reset?token=any-token');
    cy.wait('@validateToken');
    cy.location('pathname').should('eq', '/settings');
  });

  describe('Handles Errors', () => {
    it("doesn't show the form when an invalid token is provided", () => {
      cy.intercept(
        'GET',
        new RegExp(`${Cypress.env('VITE_API_BASE_URL')}/validate-token.*`),
        {
          statusCode: 422,
        },
      ).as('validateToken');

      cy.visit('/password-reset?token=invalid-token');
      cy.wait('@validateToken');
      cy.get('[data-cy="f-password-reset"]').should('not.exist');
      cy.get('[data-cy="invalid-token-message"]').should('be.visible');
    });

    it("doesn't show the form when the token is missing", () => {
      cy.visit('/password-reset');
      cy.get('[data-cy="f-password-reset"]').should('not.exist');
      cy.get('[data-cy="invalid-token-message"]').should('be.visible');
    });

    /**
     * Test submitting a password with:
     * 1. Missing required characters (uppercase, lowercase, etc...)
     * 2. Mismatch between the two password fields
     */
    it('cannot submit on validation errors', () => {
      cy.visit('/password-reset?token=valid-token');
      cy.wait('@validateToken');
      cy.get('[data-cy="f-password-reset"]').as('resetPasswordForm');

      const invalidPasswords = [
        'short',
        'nouppercase1!',
        'NOLOWERCASE1!',
        'NoDigit!',
        'NoSpecialChar1',
      ];

      cy.get('@resetPasswordForm')
        .find('input[name="password"]')
        .as('password');
      invalidPasswords.forEach((password) => {
        cy.get('@password').clear();
        cy.get('@password').type(password);
        cy.get('@resetPasswordForm').submit();
        cy.get('[data-cy="err-password"]').should('be.visible');
      });

      // Test mismatch between the two password fields
      cy.get('@password').clear();
      cy.get('@password').type('Password123!');
      cy.get('@resetPasswordForm')
        .find('input[name="repeatPassword"]')
        .type('Password123');
      cy.get('@resetPasswordForm').submit();
      cy.get('[data-cy="err-repeat-password"]').should('be.visible');
    });

    /**
     * Test submitting when one field is empty, one by one
     */
    it('cannot submit when either field is empty', () => {
      cy.visit('/password-reset?token=valid-token');
      cy.wait('@validateToken');
      cy.get('[data-cy="f-password-reset"]').as('resetPasswordForm');

      // Test empty password field
      cy.get('@resetPasswordForm')
        .find('input[name="repeatPassword"]')
        .type('Password123!');
      cy.get('@resetPasswordForm').submit();
      cy.get('[data-cy="err-password"]').should('be.visible');

      // Test empty repeat password field
      cy.get('@resetPasswordForm').find('input[name="password"]').clear();
      cy.get('@resetPasswordForm')
        .find('input[name="password"]')
        .type('Password123!');
      cy.get('@resetPasswordForm').find('input[name="repeatPassword"]').clear();
      cy.get('@resetPasswordForm').submit();
      cy.get('[data-cy="err-repeat-password"]').should('be.visible');
    });

    it('shows exactly one error toast on server errors', () => {
      cy.visit('/password-reset?token=valid-token');
      cy.wait('@validateToken');

      cy.intercept(
        'PUT',
        `${Cypress.env('VITE_API_BASE_URL')}/password-reset`,
        { statusCode: 500 },
      ).as('resetPasswordServerError');

      cy.get('[data-cy="f-password-reset"]').as('resetPasswordForm');
      cy.get('@resetPasswordForm')
        .find('input[name="password"]')
        .type('NewPassword1!');
      cy.get('@resetPasswordForm')
        .find('input[name="repeatPassword"]')
        .type('NewPassword1!');
      cy.get('@resetPasswordForm').submit();
      cy.wait('@resetPasswordServerError');

      //! Selector isn't matching anything. Are you sure you set this value correctly in the frontend?
      cy.get('[data-cy^="t-"]').should('have.length', 1);
    });

    it('shows exactly one error toast on network error', () => {
      cy.visit('/password-reset?token=valid-token');
      cy.wait('@validateToken');

      cy.intercept(
        'PUT',
        `${Cypress.env('VITE_API_BASE_URL')}/password-reset`,
        {
          forceNetworkError: true,
        },
      ).as('resetPasswordNetworkError');

      cy.get('[data-cy="f-password-reset"]').as('resetPasswordForm');
      cy.get('@resetPasswordForm')
        .find('input[name="password"]')
        .type('NewPassword1!');
      cy.get('@resetPasswordForm')
        .find('input[name="repeatPassword"]')
        .type('NewPassword1!');
      cy.get('@resetPasswordForm').submit();
      cy.wait('@resetPasswordNetworkError');

      //! Selector isn't matching anything. Are you sure you set this value correctly in the frontend?
      cy.get('[data-cy^="t-"]').should('have.length', 1);
    });

    /**
     * Test having the initial token validation be valid but when actually submitting
     * the new password have it be invalid (for example, it expired in the meanwhile)
     */
    it('hides the form on token validation errors upon submission', () => {
      cy.visit('/password-reset?token=valid-token');

      cy.intercept(
        'PUT',
        `${Cypress.env('VITE_API_BASE_URL')}/password-reset`,
        {
          statusCode: 422,
          body: { token: 'invalid' },
        },
      ).as('resetPasswordTokenError');

      cy.get('[data-cy="f-password-reset"]').as('resetPasswordForm');
      cy.get('@resetPasswordForm')
        .find('input[name="password"]')
        .type('NewPassword1!');
      cy.get('@resetPasswordForm')
        .find('input[name="repeatPassword"]')
        .type('NewPassword1!');
      cy.get('@resetPasswordForm').submit();
      cy.wait('@resetPasswordTokenError');

      cy.get('[data-cy="f-password-reset"]').should('not.exist');
      cy.get('[data-cy="invalid-token-message"]').should('be.visible');
    });
  });
});
