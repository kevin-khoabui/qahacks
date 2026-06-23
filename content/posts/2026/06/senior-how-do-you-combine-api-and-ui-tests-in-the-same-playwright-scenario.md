---
title: "(Senior) How do you combine API and UI tests in the same Playwright scenario?"
difficulty: "Advanced"
target_role: ["Automation_QA_Engineer"]
category: ["Technical"]
sub_category: "Automation"
question_type: "Code-challenge"
core_testing_type: "Automation"
domain: "Enterprise-Software"
platform: "Cross-platform"
tool_stack: "Playwright"
tags: ["automation", "coding-challenge", "interview-prep", "tech-strategy"]
---

## Overview
Integrating API calls within a Playwright UI test scenario is a crucial technique for optimizing test execution, setting up complex test preconditions, or validating post-UI actions without full UI traversal. This approach enhances test stability, speed, and maintainability by leveraging Playwright's robust `request` context.

### Interview Question:
(Senior) How do you combine API and UI tests in the same Playwright scenario?

### Expert Answer:
Combining API and UI tests within a single Playwright scenario is a best practice for creating robust, efficient, and stable end-to-end tests. The core mechanism for achieving this in Playwright is by leveraging its built-in `request` context, which provides a dedicated API client alongside the browser automation capabilities.

Here’s the architectural and implementation breakdown:

1.  **Utilize Playwright's `request` Fixture:**
    Playwright provides the `request` fixture, an instance of `APIRequestContext`, directly within your `test` functions. This allows you to perform HTTP calls independent of the browser's network.

    ```typescript
    import { test, expect } from '@playwright/test';

    test('API setup, UI interaction, API validation', async ({ page, request }) => {
        // ... test logic
    });
    ```

2.  **API for Test Preconditions and Setup:**
    The most common use case is to rapidly set up complex test data or application states via API calls before interacting with the UI. This bypasses tedious and often brittle UI navigation for setup, significantly speeding up tests and improving reliability.

    ```typescript
    // Example: Create a user via API
    const createResponse = await request.post('/api/users', {
        data: { username: 'apiUser', email: 'api@example.com', password: 'password' },
        headers: { 'Authorization': `Bearer ${process.env.API_TOKEN}` }
    });
    expect(createResponse.ok()).toBeTruthy();
    const newUser = await createResponse.json();
    const userId = newUser.id; // Get data for subsequent steps
    ```

3.  **Seamless UI Interaction:**
    Once the backend state is prepared via API, proceed with standard Playwright UI automation to interact with the application.

    ```typescript
    await page.goto('/login');
    await page.fill('#email', 'api@example.com');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
    ```

4.  **API for Post-UI Validation and Teardown:**
    After UI interactions, use API calls to validate that the changes reflect correctly in the backend or to perform efficient cleanup. This provides deeper validation than UI checks alone.

    ```typescript
    // Example: Verify user status updated via API after UI login
    const getUserResponse = await request.get(`/api/users/${userId}`);
    expect(getUserResponse.ok()).toBeTruthy();
    const userData = await getUserResponse.json();
    expect(userData.status).toBe('active'); // Validate backend state

    // Example: Clean up test data via API
    await request.delete(`/api/users/${userId}`);
    expect((await request.get(`/api/users/${userId}`)).status()).toBe(404);
    ```

**Framework Best Practices:**

*   **Helper Utilities/Service Layers:** Encapsulate repetitive API calls in dedicated helper functions or a "Service Layer" class (e.g., `UserService.ts`). This mirrors the Page Object Model for UI, promoting code reusability, readability, and maintainability.
*   **Authentication Management:** Manage API authentication (e.g., JWT tokens) by obtaining them from an initial login API call and then including them in `Authorization` headers for subsequent requests. For UI, you might inject tokens into `localStorage` via `page.evaluate()` to bypass login screens in certain scenarios.
*   **`baseURL` Configuration:** Define `baseURL` in `playwright.config.ts` for both UI and API requests to simplify URL construction.
*   **Data Isolation:** Always strive for test independence. Use API calls to create unique test data at the start of a test and clean it up at the end, ensuring tests don't interfere with each other.
*   **Error Handling and Assertions:** Implement robust error handling and assertions for API responses, checking status codes, headers, and response bodies to ensure expected outcomes.

This combined strategy significantly reduces test flakiness, optimizes test execution time by avoiding slow UI interactions for setup, and provides a more comprehensive, reliable validation of business logic across different application layers.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
"In modern, complex distributed systems, the cornerstone of an efficient and reliable automation strategy lies in our ability to validate interactions across multiple layers, not just the UI. Pure UI-driven testing often introduces bottlenecks and flakiness, diminishing our engineering efficiency. This is precisely why combining API and UI tests within a single scenario, especially using a robust framework like Playwright, becomes absolutely critical for scaling our testing efforts and ensuring true end-to-end coverage."

[The Core Execution]
"Our approach centers around leveraging Playwright's native `request` context, which is a powerful `APIRequestContext` fixture available directly within our test functions. This allows us to make direct HTTP calls—GET, POST, PUT, DELETE—parallel to, or preceding, any UI actions. For instance, instead of navigating through five UI screens to set up a specific user state, we can make a direct API call to create that user, obtain an ID or session token, and then inject that state into the browser context if needed, or proceed immediately to the relevant UI page. We encapsulate these API interactions within dedicated helper modules or `ApiActions` classes, mirroring our Page Object Model for UI, ensuring maintainability and reusability. This modularity allows us to, for example, create an order via API, then navigate to the UI to verify its presence, or conversely, perform an action in the UI and then use an API call to assert the underlying data state change. We typically manage authentication tokens obtained from initial API logins, passing them as headers for subsequent API calls, ensuring a secure and authentic context for all interactions."

[The Punchline]
"This hybrid testing strategy significantly reduces test execution time, boosts test stability by isolating fragile UI flows, and crucially, allows us to validate the entire system's behavior, not just the superficial UI layer. The ultimate ROI is a highly resilient, faster feedback loop in our CI/CD pipelines, giving our development teams immediate confidence in their deployments and ultimately, delivering higher quality software to our customers with unparalleled speed and reliability."