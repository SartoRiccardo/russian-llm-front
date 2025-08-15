/**
 * Tests for the login page, implemented in @src/pages/LoginPage.tsx
 */
describe('Login Page', () => {
  /**
   * Check that logging in with correct credentials works
   */
  it('logs in successfully', () => {});

  /**
   * Check that the form fields are uneditable while the request is pending
   */
  it('can not edit the form while submitting', () => {});

  describe('Handles Errors', () => {
    /**
     * Check that the correct toast appears when submitting with incorrect credentials
     */
    it('displays a toast when the credentials are incorrect', () => {});

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
