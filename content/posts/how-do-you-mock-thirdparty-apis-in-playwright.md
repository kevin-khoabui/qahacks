---
title: "How do you mock third-party APIs in Playwright?"
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
Mocking third-party APIs in Playwright is a fundamental strategy for building resilient, fast, and stable end-to-end automation tests. It allows test suites to run independently of external services, ensuring predictable behavior and accelerating execution cycles by eliminating network latency and external system dependencies.

### Interview Question:
How do you mock third-party APIs in Playwright?

### Expert Answer:
Effectively mocking third-party APIs in Playwright is paramount for achieving test isolation, stability, and high execution velocity. The core mechanism Playwright provides for this is `page.route()`, which allows intercepting network requests and fulfilling them with custom responses.

**Core Implementation Strategy:**

1.  **Identify Endpoints:** Pinpoint the specific URLs or URL patterns of the third-party APIs that need to be mocked. This often involves observing network traffic during manual testing or inspecting application code.
2.  **Define Mock Data:** Create realistic mock JSON responses representing various scenarios (success, specific data sets, errors, empty states). These should ideally be stored as structured fixture files (e.g., `src/test-data/api-mocks/users-success.json`) within your automation framework.
3.  **Implement `page.route()`:** In your Playwright test, typically within a `beforeEach` hook or directly within the test, use `page.route()` to set up the interception.

    ```typescript
    import { test, expect } from '@playwright/test';
    import * as path from 'path';

    test.beforeEach(async ({ page }) => {
        // Mock a successful user fetch from a third-party API
        await page.route('**/api/thirdparty/users*', async route => {
            const mockData = require(path.join(__dirname, '../test-data/api-mocks/users-success.json'));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockData),
            });
        });

        // Mock an error response for a different API
        await page.route('**/api/thirdparty/payments*', async route => {
            const errorData = { error: 'Payment service unavailable', code: 500 };
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify(errorData),
            });
        });
    });

    test('should display user data from mock API', async ({ page }) => {
        await page.goto('/dashboard'); // Assuming this page makes the API call
        await expect(page.locator('.user-name')).toHaveText('John Doe');
        // ... assertions based on mocked data
    });
    ```

**Advanced Techniques & Framework Best Practices:**

*   **Conditional Routing:** Decide whether to fulfill or `route.continue()` based on request properties (headers, body, method). This enables dynamic mocking based on application logic.
    ```typescript
    await page.route('**/api/items*', async route => {
        const requestBody = route.request().postDataJSON();
        if (requestBody?.type === 'premium') {
            await route.fulfill({ status: 200, body: JSON.stringify({ items: ['Premium Item A'] }) });
        } else {
            await route.continue(); // Allow non-premium requests to proceed
        }
    });
    ```
*   **Centralized Mocking Service:** Encapsulate complex mocking logic into reusable utility functions or a dedicated `MockApiService` class. This improves test readability and maintainability. For example: `mockApiService.setupUsersSuccess(page)`.
*   **Dynamic Data Generation:** For highly variable test data, leverage libraries like Faker.js or a custom data builder pattern to generate mock payloads on the fly, rather than relying solely on static JSON files.
*   **Request & Response Assertion:** Use `page.waitForRequest()` and `page.waitForResponse()` to not only mock but also verify that the application under test (AUT) sent the correct request payload and processed the mocked response as expected.
*   **Error & Edge Case Simulation:** Actively test various API failure modes (e.g., 401 Unauthorized, 404 Not Found, 429 Too Many Requests, network timeouts) to validate the AUT's robustness and error handling UI.
*   **Isolation and Cleanup:** Ensure each test or test suite configures its own specific mocks, preventing cross-test pollution. Playwright's `test.beforeEach` and `test.afterEach` are crucial here for setting up and implicitly tearing down routes.

By implementing these strategies, we create a resilient automation framework that can thoroughly validate UI behavior under various API conditions without incurring the performance penalties or flakiness associated with real external dependencies.

### Speaking Blueprint (3-Minute Verbal Response):

**[The Hook]**
"One of the most significant challenges in building robust, scalable automation frameworks today, especially with modern front-end applications, is managing external dependencies, particularly third-party API calls. For our Playwright-based E2E tests, the ability to effectively mock these external services is absolutely critical for achieving fast, stable, and truly isolated test executions within our CI/CD pipeline, rather than waiting on flaky external systems or accumulating technical debt."

**[The Core Execution]**
"My approach to mocking third-party APIs in Playwright leverages its powerful `page.route()` mechanism. Conceptually, it's about intercepting specific network requests that would normally go out to a third-party service and programmatically fulfilling them with predefined or dynamically generated responses.

Typically, we start by identifying the exact API endpoints we need to control – often using glob patterns or regular expressions within the `page.route()` call. For instance, if we're hitting a `/users` endpoint from an external service, we'd write something like `await page.route('**/api/thirdparty/users*', async route => { ... })`.

Inside that async route handler, we use `route.fulfill()` to dictate the exact HTTP status code, content type, and most importantly, the response body. This response body is usually loaded from well-structured JSON fixture files stored in our test data directory – say, `test-data/mocks/users-success.json` – or dynamically generated based on test parameters. This allows us to simulate success scenarios, various error states like 404s or 500s, or even network timeouts.

A key best practice here is to centralize this mocking logic into reusable utility functions or a dedicated `MockService` class. This means a test doesn't directly deal with `page.route()`, but rather calls something like `mockApiService.setupUserMock(page, 'success')` or `mockApiService.setupPaymentFailure(page)`. This pattern ensures clean, readable tests and highly maintainable mocking configurations. Furthermore, for complex data, we'll often employ a data builder pattern within our framework to programmatically generate mock payloads, avoiding static, monolithic JSON files that are difficult to adapt. We also make extensive use of `page.waitForRequest()` and `page.waitForResponse()` to not just mock but also *assert* that our application made the correct outgoing calls, even if we're intercepting the response."

**[The Punchline]**
"Ultimately, by meticulously controlling these external API interactions, we decouple our UI tests from the complexities and unreliability of external systems. This directly translates to significant engineering ROI: our test suites become faster, more deterministic, and less prone to environmental flakiness, dramatically improving our feedback loops, increasing developer confidence, and ensuring that our CI/CD pipeline can deliver high-quality releases with unparalleled speed and stability."