---
title: "How do you verify token expiration handling in Cypress?"
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
Verifying token expiration in end-to-end automation with Cypress presents a unique challenge, requiring sophisticated control over application state, network requests, and simulated time. The goal is to deterministically trigger and validate the application's response to an expired authentication token without actual real-world waiting.

### Interview Question:
How do you verify token expiration handling in Cypress?

### Expert Answer:
Verifying token expiration handling in Cypress requires a strategic combination of manipulating client-side state, controlling network responses, and simulating time. A robust approach ensures both the client-side's reaction and potential server-side rejections are covered.

1.  **Network Interception (`cy.intercept()` for Backend Rejection Simulation):**
    This is often the most direct and reliable method to simulate server-side token expiration.
    *   **Initial Setup:** Perform a regular login to obtain a valid authentication token.
    *   **Intercept Authorized Requests:** Configure `cy.intercept()` to specifically target API endpoints that would require authorization *after* the token should have expired. For these intercepts, force a `401 Unauthorized` status code or a specific error payload indicating token invalidity/expiration.
    ```javascript
    // Assume cy.login() custom command handles initial authentication
    cy.login().then(() => {
        cy.intercept('GET', '/api/protected-resource', {
            statusCode: 401,
            body: { message: 'Token expired. Please re-authenticate.' },
            headers: { 'x-expired': 'true' }
        }).as('expiredTokenResponse');

        // Trigger an action that makes the intercepted API call
        cy.visit('/dashboard');

        // Assert on the intercept and expected UI/redirect behavior
        cy.wait('@expiredTokenResponse');
        cy.url().should('include', '/login');
        cy.contains('Token expired. Please re-authenticate.').should('be.visible');
    });
    ```
    *   This approach directly tests the application's response to a definitive "expired token" signal from the backend.

2.  **Clock Manipulation (`cy.clock()` for Client-Side Expiration):**
    This method is crucial when client-side logic performs validity checks based on token issuance/expiration timestamps.
    *   **Login & Time Capture:** Log in, then immediately capture the current time and identify the token's expected expiration.
    *   **Advance Time:** Use `cy.clock().tick()` to fast-forward Cypress's internal clock past the token's expiration time.
    ```javascript
    cy.login().then(() => {
        // Assume 'auth' in localStorage contains 'token' and 'expiresAt' (timestamp)
        cy.window().then((win) => {
            const authData = JSON.parse(win.localStorage.getItem('auth'));
            const expiresAt = authData.expiresAt;
            const now = Date.now();
            const timeToAdvance = expiresAt - now + 5000; // 5 seconds past actual expiry

            cy.clock(now).then((clock) => {
                clock.tick(timeToAdvance);
            });
        });
        // Now, trigger an action. Client-side logic should deem token expired.
        cy.get('[data-cy="some-protected-action-button"]').click();
        cy.url().should('include', '/login');
        // You might also intercept the subsequent API call to confirm a 401
    });
    ```
    *   This tests how the client-side reacts to an internally perceived expired token, potentially attempting a refresh or redirecting.

3.  **Direct `localStorage`/`sessionStorage` Manipulation:**
    For quick checks or specific edge cases, you can directly inject an expired or invalid token.
    ```javascript
    cy.login(); // Get a valid state, then override the token
    cy.window().then((win) => {
        let auth = JSON.parse(win.localStorage.getItem('auth'));
        // Modify the token to be invalid/expired (e.g., replace with known expired JWT, or alter 'exp' claim)
        auth.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.X4k20_4K-4Q-V-7_Q-0_Q-9_Q-1_Q-1_Q'; // Example: JWT with past 'exp'
        win.localStorage.setItem('auth', JSON.stringify(auth));
    });
    cy.visit('/dashboard'); // App should detect expired token on page load
    cy.url().should('include', '/login');
    ```

**Best Practices:**
*   **Custom Commands:** Encapsulate login, token setting, and clock manipulation into reusable Cypress custom commands.
*   **Combination:** For comprehensive testing, combine `cy.clock()` (to trigger client-side checks) with `cy.intercept()` (to ensure the backend also rejects requests with the now-expired token) to cover both client and server aspects.
*   **Clear State:** Always clear `localStorage`, `sessionStorage`, and cookies (`cy.clearLocalStorage()`, `cy.clearCookies()`) between tests to prevent contamination.

This multi-faceted approach ensures that token expiration handling is thoroughly verified, covering various scenarios and improving the robustness of the authentication system.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
In today's complex microservices landscape, ensuring robust authentication and authorization isn't just a functional requirement; it's a critical aspect of our security posture and overall user experience. For us, automating the verification of token expiration isn't just about catching bugs; it's a significant contributor to engineering efficiency by detecting potential security and usability flaws early in our CI/CD pipeline.

[The Core Execution]
When tackling token expiration in Cypress, my primary strategy revolves around orchestrating network behavior and precise time manipulation. My go-to approach involves leveraging `cy.intercept()` extensively. After an initial successful login, where we'd acquire a valid JWT, we then immediately configure `cy.intercept()` to return a `401 Unauthorized` status code or a specific token-expired error payload for subsequent API calls that require authorization. This directly mimics the server rejecting an invalid or expired token. We then trigger the UI action that would typically make that protected API call, immediately verifying the client-side's reaction – does it correctly redirect to the login page? Does it display an appropriate error message to the user? This ensures our application gracefully handles backend token rejections.

Complementing this, for scenarios where the client-side itself checks token validity based on timestamps, we utilize `cy.clock()`. We perform an initial login, capturing the valid token and its expiration time. Then, using `cy.clock().tick(desired_expiration_duration_ms)`, we advance Cypress's internal clock past that token's expiry. Once the clock has ticked, any subsequent client-side logic that evaluates token validity will perceive the token as expired. We then trigger an action requiring authentication, verifying the system's client-side response—whether it attempts a refresh, silently fails, or explicitly prompts the user to re-authenticate. Often, combining these, we might even ensure that after `cy.clock().tick()`, if the client attempts a token refresh, `cy.intercept()` is already poised to confirm the server's expected 401 for that truly expired token. This provides comprehensive coverage, ensuring both client-side and server-side expiration handling are robustly tested.

[The Punchline]
This deliberate and controlled manipulation of time and network state within Cypress allows us to create precise, repeatable, and extremely fast token expiration scenarios. It’s about shifting left on security-critical features, transforming what could otherwise be a long-running or unreliable test into a deterministic, CI/CD-friendly quality gate that significantly enhances our technical scalability and the overall maintainability of our authentication flows across the enterprise.