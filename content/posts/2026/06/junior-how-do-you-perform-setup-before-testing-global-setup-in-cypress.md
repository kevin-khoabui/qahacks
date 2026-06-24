---
title: "(Junior) How do you perform setup before testing (global setup) in Cypress?"
difficulty: "Advanced"
target_role: ["Automation_QA_Engineer"]
category: ["Technical"]
sub_category: "Automation"
question_type: "Code-challenge"
core_testing_type: "Automation"
domain: "Enterprise-Software"
platform: "Cross-platform"
tool_stack: "Cypress"
tags: ["automation", "coding-challenge", "interview-prep", "tech-strategy"]
---

## Overview
Effective global setup in Cypress is crucial for ensuring a clean, consistent, and performant test environment across multiple test runs. This involves understanding Cypress's unique architecture for both client-side and Node.js-based setup tasks.

### Interview Question:
(Junior) How do you perform setup before testing (global setup) in Cypress?

### Expert Answer:
Performing global setup in Cypress requires understanding its dual execution environments: the browser context for tests and the Node.js context for server-side operations.

1.  **Client-Side Global Setup (`cypress/support/e2e.js` or `cypress/support/component.js`):**
    This file executes *once* before *all* test files in the browser context. It's ideal for:
    *   **Importing Custom Commands:** Extending Cypress's `cy` object.
        ```javascript
        // cypress/support/e2e.js
        import './commands'; // Your custom commands
        ```
    *   **Registering Global Listeners:** Handling uncaught exceptions to prevent test failures from application errors.
        ```javascript
        // cypress/support/e2e.js
        Cypress.on('uncaught:exception', (err, runnable) => {
          // Log or handle exceptions, but prevent Cypress from failing the test
          console.error('Uncaught exception:', err.message);
          return false;
        });
        ```
    *   **Global Overrides/Configuration:** Modifying default Cypress behaviors (e.g., `Cypress.config()`).
    *   **No `cy.visit()` here:** This file runs once at the start of Cypress; `cy.visit()` should be in `before`/`beforeEach` blocks.

2.  **Server-Side (Node.js) Setup (`cypress.config.js` with `setupNodeEvents`):**
    For operations that require Node.js access (e.g., database interactions, API calls to reset state, file system operations), we leverage `setupNodeEvents` (Cypress v10+) or `cypress/plugins/index.js` (Cypress v9 and below). This runs in the Node.js environment, separate from the browser.
    *   **Registering Tasks:** Define custom tasks that can be invoked from your tests using `cy.task()`.
        ```javascript
        // cypress.config.js (Cypress v10+)
        const { defineConfig } = require('cypress');
        module.exports = defineConfig({
          e2e: {
            setupNodeEvents(on, config) {
              on('task', {
                seedDatabase(users) {
                  // Connect to DB and seed data
                  console.log('Seeding database with:', users);
                  return null; // Tasks must return something or null
                },
                clearDatabase() {
                  // Clear test data
                  console.log('Clearing database');
                  return null;
                },
              });
              return config;
            },
            baseUrl: 'http://localhost:3000',
          },
        });
        ```
        Then, in a test:
        ```javascript
        // cypress/e2e/my-test.cy.js
        before(() => {
          cy.task('clearDatabase');
          cy.task('seedDatabase', [{ name: 'Test User' }]);
        });
        ```
    *   **Environment Variable Management:** Modifying `config.env` for dynamic environment setup.

3.  **Authentication/Session Management (`cy.session()` - Cypress v12+):**
    For maintaining user login state across multiple tests or spec files, `cy.session()` is a powerful "global-like" setup mechanism. It caches and restores session data, significantly speeding up tests by avoiding repeated logins.
    ```javascript
    // cypress/e2e/login-tests.cy.js
    beforeEach(() => {
      cy.session('adminUser', () => {
        cy.visit('/login');
        cy.get('#username').type('admin');
        cy.get('#password').type('password');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/dashboard');
      });
      // After session is restored/created, navigate to test specific URL
      cy.visit('/dashboard');
    });
    ```

**Best Practices:**
*   **Isolate Setup:** Aim for setup that is quick and leaves the application in a known, consistent state.
*   **Leverage `cy.task()`:** For non-UI interactions (DB, API, file system), always use `cy.task()` to perform operations in the Node.js context.
*   **Utilize `cy.session()`:** For authentication, this is a game-changer for speed and reliability.
*   **Clear State:** Ensure setup mechanisms effectively clear or reset state to prevent test interference.

### Speaking Blueprint (3-Minute Verbal Response):

[The Hook] In modern automation frameworks like Cypress, establishing a robust and efficient global setup mechanism is absolutely paramount for engineering efficiency and test scalability. It’s what ensures our test environments are consistent, reliable, and performant across the entire test suite, preventing flakiness and maximizing our return on investment.

[The Core Execution] From a technical standpoint, Cypress's architecture necessitates a layered approach to global setup due to its distinct browser and Node.js execution contexts. Initially, our client-side global setup begins in `cypress/support/e2e.js`. This file executes *once* before all spec files load in the browser and is perfect for bootstrapping client-side essentials like importing custom commands that extend Cypress's capabilities or registering global exception handlers to make our tests more resilient to unexpected application errors. Crucially, we avoid `cy.visit()` here, as it's a browser command and this file runs before any specific test context is established.

For any server-side interactions, such as database seeding, API calls to reset test data, or file system operations, we leverage the Node.js context through `setupNodeEvents` in our `cypress.config.js` file for Cypress v10 and above. Here, we define custom `cy.task()` functions. These tasks allow our browser-based tests to invoke Node.js code, enabling powerful pre-test data preparation or cleanup operations that are critical for isolated and repeatable tests. A significant advancement, especially for stateful operations like authentication, is `cy.session()`, introduced in Cypress v12. This command allows us to cache and restore user login states across multiple tests and even across different spec files, dramatically cutting down on redundant login steps and significantly accelerating our overall test execution time. Lastly, granular, localized setup is then efficiently managed within individual test files using `before` and `beforeEach` blocks for specific test suite or test case preconditions.

[The Punchline] This layered approach to setup, meticulously distinguishing between client-side bootstrapping, server-side data management via tasks, and intelligent session persistence, ensures that our test suites are not only fast and incredibly reliable but also inherently scalable and maintainable. This strategic implementation ultimately maximizes our engineering ROI by consistently delivering reproducible and trustworthy test results, which is foundational for rapid, confident software delivery.