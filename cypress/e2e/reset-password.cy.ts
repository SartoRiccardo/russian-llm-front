/**
 * Tests the reset password page, implemented in @src/pages/PasswordResetPage.tsx
 */
describe('Reset Password Page', () => {
  /**
   * Check that a correct flow where the user types 2 passwords
   * up to standard works and submits correctly, and the button takes
   * the user back to the home page.
   */
  it('can reset the password', () => {});

  /**
   * Check that if the user is already logged in navigating to this
   * page redirects to settings. Use the login helper command.
   */
  it('redirects to settings if logged in', () => {});

  describe('Handles Errors', () => {
    it("doesn't show the form when an invalid token is provided", () => {});

    it("doesn't show the form when the token is missing", () => {});

    /**
     * Test submitting a password with:
     * 1. Missing required characters (uppercase, lowercase, etc...)
     * 2. Mismatch between the two password fields
     */
    it('cannot submit on validation errors', () => {});

    /**
     * Test submitting when one field is empty, one by one
     */
    it('cannot submit when either field is empty', () => {});

    it('shows exactly one error toast on server errors', () => {});

    /**
     * Test having the initial token validation be valid but when actually submitting
     * the new password have it be invalid (for example, it expired in the meanwhile)
     */
    it('shows an error toast on token validation errors', () => {});
  });
});
