// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// When adding a command remember to add the type definition in cypress/support/index.d.ts as well

Cypress.Commands.add('login', () => {
  const now = new Date();
  const future = new Date(now.getTime() + 3600 * 1000); // 1 hour from now
  localStorage.setItem('sessionexpire', future.toISOString());

  cy.intercept('GET', '**/check-login-status', {
    statusCode: 200,
    body: {
      username: 'testuser',
      sessionExpire: Date.now() + 3600 * 1000,
    },
  }).as('checkLoginStatus');
});
