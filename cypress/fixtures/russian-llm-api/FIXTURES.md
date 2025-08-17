# Russian LLM API Fixtures

## `login-success.json`

Mocks a successful login response.

- **Status Code:** 200 OK
- **Used in:**
  - `cypress/e2e/login.cy.js`: Login Page -- logs in successfully
  - `cypress/e2e/login.cy.js`: Login Page -- can not edit the form while submitting

## `check-login-status-success.json`

Mocks a successful check-login-status response.

- **Status Code:** 200 OK
- **Used in:**
  - `cypress/e2e/login.cy.js`: Login Page -- redirects the user to the home page if visited while logged in
