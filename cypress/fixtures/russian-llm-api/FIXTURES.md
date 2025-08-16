# Russian LLM API Fixtures

This document describes the purpose and content of fixture files used for mocking the Russian LLM API.

## `login-success.json`

Mocks a successful login response.

- **Status Code:** 200 OK
- **Used in:**
  - `cypress/e2e/login.cy.js`: Login Page -- logs in successfully
  - `cypress/e2e/login.cy.js`: Login Page -- can not edit the form while submitting
