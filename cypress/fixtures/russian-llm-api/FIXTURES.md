# Russian LLM API Fixtures

## `login-success.json`

Mocks a successful login response.

- **Status Code:** 200 OK
- **Used in:**
  - `cypress/e2e/login.cy.js`: Login Page -- logs in successfully
  - `cypress/e2e/login.cy.js`: Login Page -- can not edit the form while submitting
  - `cy.login`: Custom function

## `check-login-status-success.json`

Mocks a successful check-login-status response.

- **Status Code:** 200 OK
- **Used in:**
  - `cypress/e2e/login.cy.js`: Login Page -- redirects the user to the home page if visited while logged in

## `exercises.json`

Mocks a successful response for the exercises list.

- **Used in:**
  - `cypress/e2e/exercises-page.cy.ts`: Exercises Page -- loads the page correctly
  - `cypress/e2e/exercises-page.cy.ts`: Exercises Page -- navigates to an exercise page when clicked
  - `cypress/e2e/exercises-page.cy.ts`: Exercises Page -- retries on network errors
  - `cypress/e2e/exercises-page.cy.ts`: Exercises Page -- redirects to login on unauthorized error and returns after login

## `stats.json`

Mocks a successful response for the stats page.

- **Used in:**
  - `cypress/e2e/stats-page.cy.ts`: Stats Page -- loads the page correctly
  - `cypress/e2e/stats-page.cy.ts`: Stats Page -- navigates to the vocabulary page
  - `cypress/e2e/stats-page.cy.ts`: Vocabulary Page -- expands a word skill to show its subcategories
  - `cypress/e2e/stats-page.cy.ts`: Vocabulary Page -- shows a modal with rules when a subcategory is clicked
  - `cypress/e2e/stats-page.cy.ts`: Error Handling -- retries on network errors (Stats Page)
  - `cypress/e2e/stats-page.cy.ts`: Error Handling -- redirects to login on unauthorized error and returns after login
  - `cypress/e2e/vocabulary-page.cy.ts`: Happy Path -- loads the first page and appends the next on scroll
  - `cypress/e2e/vocabulary-page.cy.ts`: Happy Path -- expands a category to show correctly sorted words
  - `cypress/e2e/vocabulary-page.cy.ts`: Happy Path -- shows a modal with word variants when the info button is clicked
  - `cypress/e2e/vocabulary-page.cy.ts`: Happy Path -- replaces modal content with highlighted rules and handles returning

## `words-page-1.json`

Mocks a successful response for the first page of the vocabulary words.

- **Used in:**
  - `cypress/e2e/vocabulary-page.cy.ts`: Happy Path -- loads the first page and appends the next on scroll
  - `cypress/e2e/vocabulary-page.cy.ts`: Happy Path -- expands a category to show correctly sorted words
  - `cypress/e2e/vocabulary-page.cy.ts`: Happy Path -- shows a modal with word variants when the info button is clicked
  - `cypress/e2e/vocabulary-page.cy.ts`: Happy Path -- replaces modal content with highlighted rules and handles returning
  - `cypress/e2e/vocabulary-page.cy.ts`: Error Handling and Edge Cases -- hides rule buttons when stats data is unavailable
  - `cypress/e2e/vocabulary-page.cy.ts`: Error Handling and Edge Cases -- retries with exponential backoff on server errors

## `words-page-2.json`

Mocks a successful response for the second page of the vocabulary words.

- **Used in:**
  - `cypress/e2e/vocabulary-page.cy.ts`: Happy Path -- loads the first page and appends the next on scroll

## `words-page-3.json`

Mocks a successful response for the third page of the vocabulary words.

- **Used in:**
  - `cypress/e2e/vocabulary-page.cy.ts`: Happy Path -- loads the first page and appends the next on scroll
