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
  it('can send the reset password email', () => {});

  /**
   * Check that the form fields are uneditable while the request is pending
   */
  it('can not edit the form while submitting', () => {});

  describe('Handles Errors', () => {
    it('can not submit when the fields are empty', () => {});

    it('can not submit when the email is invalid', () => {});

    /**
     * Check that the correct toast appears when receiving a 5xx response
     */
    it('displays a toast on server errors', () => {});

    /**
     * Check that the correct toast appears on network error
     */
    it('displays a toast on network errors', () => {});
  });
});
