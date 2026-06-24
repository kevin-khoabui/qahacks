---
title: "How do you share state between tests in Cypress?"
difficulty: "Intermediate"
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
Sharing state between Cypress tests is a nuanced topic, primarily emphasizing test isolation as a best practice while acknowledging legitimate use cases for efficiency and framework architecture. It challenges engineers to balance test independence with the need to persist certain data across test runs or spec files.

### Interview Question:
How do you share state between tests in Cypress?

### Expert Answer:
While Cypress strongly advocates for test isolation, which typically means each test should be independent and recreate its own state, there are valid scenarios where sharing specific, controlled state becomes necessary for efficiency or architectural reasons. The approach depends heavily on the scope and type of state.

1.  **Within a single spec file (intra-spec):**
    *   **`before()` and `beforeEach()` hooks:** Data defined or generated in these hooks can be accessible to all `it()` blocks within the same `describe()` suite. This is the most common way to share state like generated user data or API responses.
        ```javascript
        let sharedData;
        describe('User tests', () => {
          before(() => {
            cy.request('/api/createUser').then(response => {
              sharedData = response.body.userId;
            });
          });
          it('should use shared user ID', () => {
            cy.visit(`/users/${sharedData}`);
          });
        });
        ```
    *   **Aliasing (`.as()`):** Commands can be aliased and then referenced later using `@aliasName`. This is excellent for sharing results of commands within a test or a `beforeEach` hook.
        ```javascript
        it('should get a post and display it', () => {
          cy.request('/api/posts/1').as('post');
          cy.get('@post').its('body').should('have.property', 'title');
        });
        ```
    *   **`cy.wrap()`:** Allows passing a subject to the next command in a chain, effectively wrapping a value for further command processing.

2.  **Between spec files (inter-spec):**
    *   **`cy.writeFile()` and `cy.readFile()`:** This is the most robust and recommended method for persisting dynamic data (e.g., a generated order ID from an API call) that needs to be consumed by a different spec file. Data can be written to a temporary JSON file in `cypress/fixtures` or a `tmp` directory and then read by subsequent tests.
        ```javascript
        // In spec-a.cy.js
        it('creates data and saves ID', () => {
          cy.request('POST', '/api/order').then((response) => {
            cy.writeFile('cypress/fixtures/orderId.json', { orderId: response.body.id });
          });
        });

        // In spec-b.cy.js
        it('uses saved ID', () => {
          cy.readFile('cypress/fixtures/orderId.json').then((data) => {
            cy.visit(`/order/${data.orderId}`);
          });
        });
        ```
        Remember to clear temporary files as part of your CI/CD setup or `after` hook if necessary.

3.  **Authentication/Session State:**
    *   **`cy.session()` (Cypress 12+):** This is the ideal and most powerful mechanism for caching and restoring authentication and browser session data across multiple tests or even spec files. It significantly speeds up tests by avoiding repeated login steps.
        ```javascript
        Cypress.Commands.add('login', (username, password) => {
          cy.session([username, password], () => { // Key can be an array of variables
            cy.visit('/login');
            cy.get('#username').type(username);
            cy.get('#password').type(password);
            cy.get('button[type="submit"]').click();
            cy.url().should('include', '/dashboard');
          });
        });

        // In spec file
        it('should perform actions as logged-in user', () => {
          cy.login('testUser', 'password123');
          cy.visit('/profile');
        });
        ```
        `cy.session()` caches the session state based on the provided key and restores it, bypassing the login UI for subsequent tests using the same key.

4.  **Static Configuration:**
    *   **`Cypress.env()`:** Environment variables defined in `cypress.config.js`, `cypress.json`, or passed via CLI are static and read-only. They are suitable for sharing non-dynamic configuration data (e.g., API keys, base URLs).

**Best Practices:**
*   **Prioritize isolation:** Only share state when absolutely necessary.
*   **API/DB setup:** Favor setting up test data via API calls or direct database manipulation in `before()` hooks over UI interactions.
*   **Cleanup:** Ensure any created state (e.g., files, database entries) is cleaned up, either after a suite, specific tests, or via CI/CD pipelines.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
In modern automation frameworks like Cypress, one of the perennial challenges is balancing test independence, which is crucial for reliability, with the pragmatic need for efficiency. Recreating complex test preconditions, such as user registration or setting up intricate data, for every single test case can significantly impact execution speed and, consequently, our CI/CD pipeline's agility. While strict isolation is often the ideal, there are architecturally sound strategies to share state judiciously when it yields substantial engineering ROI.

[The Core Execution]
When we discuss sharing state in Cypress, our primary consideration is the scope: is this state needed within a single test, across tests in the same spec file, or across entirely different spec files? For state required *within a single test or between tests in the same spec file*, we primarily leverage Cypress's robust command chaining and hook mechanisms. For instance, `before()` or `beforeEach()` hooks are excellent for generating data via an API call – perhaps creating a test user – and then making that generated user ID accessible to all subsequent `it` blocks. Similarly, aliasing with `.as()` allows us to capture the result of a command and reuse it later in the same test.

However, the more complex scenario arises when we need to persist dynamic state *between different spec files*, say, passing an `orderId` generated by an API test in `orders.cy.js` to a UI verification test in `checkout.cy.js`. For this, our go-to method is to utilize Node.js capabilities through `cy.writeFile()` and `cy.readFile()`. We'd write the dynamic data, like that `orderId`, to a temporary JSON file – perhaps in a `tmp` directory or `cypress/fixtures` – and then read it back in the subsequent spec file's `before` hook. This provides a clean, file-system-based persistence mechanism.

Crucially, for authentication and browser session management, which is a very common state-sharing requirement, Cypress provides the powerful `cy.session()` command, available since version 12. This command allows us to cache login states, preventing repeated UI logins for every single test. We define a login procedure, provide a unique key – often incorporating username and password – and Cypress handles the caching and restoration of the session, drastically speeding up tests, especially in applications with complex authentication flows.

[The Punchline]
Ultimately, our philosophy is to strike a delicate balance: championing rigorous test isolation to maintain robustness and prevent flaky tests, but strategically implementing state sharing where it truly optimizes performance and maintainability, ensuring our test suite remains fast, reliable, and continues to deliver maximum engineering efficiency without compromising the integrity of our test results.