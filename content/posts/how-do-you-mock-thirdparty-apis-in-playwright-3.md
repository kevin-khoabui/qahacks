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
tool_stack: "None"
tags: ["automation", "coding-challenge", "interview-prep", "tech-strategy"]
---

## Overview
Mocking third-party APIs in Playwright is a fundamental technique for achieving stable, fast, and isolated end-to-end tests. It mitigates external dependencies, allowing for deterministic test execution and comprehensive error scenario validation without hitting live services.

### Interview Question:
How do you mock third-party APIs in Playwright?

### Expert Answer:
Effectively mocking third-party APIs in Playwright is achieved primarily through its powerful network interception capabilities, specifically using `page.route()`. This method allows us to intercept, modify, or completely mock network requests before they reach their destination, ensuring tests are isolated, fast, and deterministic.

Here's the technical breakdown:

1.  **`page.route(url, handler)`**: This is the core API.
    *   `url`: Can be a string, a regular expression, or a glob pattern. For third-party APIs, a `RegExp` is often preferred to match a base URL and various endpoints (e.g., `/api/v1/users(.*)`).
    *   `handler`: An asynchronous function that receives a `Route` object. This function defines how to handle the intercepted request.

2.  **Handling the Request**: Inside the handler, we typically use one of two methods on the `Route` object:
    *   **`route.fulfill(options)`**: This is used to respond to the request with custom data.
        *   `status`: HTTP status code (e.g., 200, 404, 500).
        *   `headers`: An object of HTTP headers.
        *   `contentType`: The `Content-Type` header (e.g., `'application/json'`).
        *   `body`: The response body, typically a JSON string for API responses, or raw text.
        *   `path`: Specifies a local file to serve as the response body.
    *   **`route.abort(errorCode)`**: This allows us to simulate network errors or prevent a request from going out. `errorCode` can be `'failed'`, `'accessdenied'`, etc.
    *   **`route.continue()`**: If we only want to inspect a request without modifying it, or want to mock only specific requests while allowing others to pass through, we can call `route.continue()`.

**Implementation Pattern & Best Practices:**

*   **Centralized Mocks**: Encapsulate common mock responses in dedicated helper functions or fixtures. This promotes reusability and maintainability.
    ```typescript
    // mocks/auth.ts
    export const mockSuccessfulLogin = async (page: Page) => {
      await page.route('**/auth/login', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ token: 'mock-jwt-token', user: { id: 1, name: 'Test User' } }),
        });
      });
    };
    ```
*   **Dynamic Mocks**: For more complex scenarios, the `handler` function can inspect `route.request()` to get details like URL, method, and post data. This allows for dynamic responses based on request parameters.
    ```typescript
    await page.route('**/items/*', route => {
      const itemId = route.request().url().split('/').pop();
      if (itemId === '123') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: '123', name: 'Mock Item' }) });
      } else {
        route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'Item not found' }) });
      }
    });
    ```
*   **Test-Specific Mocks**: Apply mocks within individual test blocks (`test()`) or `test.beforeEach()` hooks to ensure isolation between tests.
*   **Fixture-Based Mocks**: For shared mocking logic across multiple tests, define Playwright test fixtures.
    ```typescript
    // playwright.config.ts or a custom fixture file
    import { test as baseTest } from '@playwright/test';
    export const test = baseTest.extend<{ loggedInPage: Page }>({
      loggedInPage: async ({ page }, use) => {
        await mockSuccessfulLogin(page); // Call the centralized mock function
        await page.goto('/login');
        await page.locator('#username').fill('test');
        await page.locator('#password').fill('test');
        await page.click('#login-button');
        await page.waitForURL('/dashboard');
        await use(page);
      },
    });
    // In a test file:
    // test('should show dashboard for logged-in user', async ({ loggedInPage }) => { /* ... */ });
    ```
*   **Error Simulation**: Crucial for robustness testing (e.g., network timeout, 500 server errors).
    ```typescript
    await page.route('**/api/data', route => {
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Internal Server Error' }) });
    });
    ```

By leveraging `page.route()`, Playwright allows us to create highly controlled testing environments, significantly enhancing test reliability, execution speed, and the ability to cover complex edge cases with precision.

### Speaking Blueprint (3-Minute Verbal Response):

In modern test automation, especially with frameworks like Playwright, isolating tests from external dependencies, particularly third-party APIs, is absolutely critical for achieving true test stability and velocity. This challenge is precisely what Playwright's network interception capabilities, through `page.route()`, are designed to address.

My approach centers around leveraging `page.route()` to intercept and then programmatically respond to network requests. When we encounter a third-party API call, we first identify its URL pattern – often using a regular expression to ensure we catch all relevant endpoints and their parameters. Once intercepted, we use the `route.fulfill()` method within our handler function. This powerful mechanism allows us to define the precise HTTP `status` code, custom `headers`, and crucially, the entire `body` of the response. This means we can simulate anything from a perfect 200 OK with predefined, valid data, to a 404 Not Found, a 500 Server Error, or even an empty array, depending on the specific test scenario we're validating. For example, to simulate an external service returning a specific error, we'd simply fulfill the route with a 500 status and a corresponding error message in the JSON body. We encapsulate these mocking strategies within dedicated helper functions or Playwright fixtures, like a `mockSuccessfulAuth` fixture that provides a valid JWT token, or an `emptyProductCatalog` fixture. This promotes reusability across our test suite, keeping our individual tests focused and clean, while the complex mock logic is managed centrally. We also implement dynamic mocking where the response body can be generated on-the-fly based on the incoming request parameters, enabling even more realistic, yet controlled, simulations.

Ultimately, effective API mocking in Playwright transforms external flakiness and unpredictability into internal control and determinism. It enables rapid, parallelized test execution by removing the need to hit slow or rate-limited external services, significantly reduces CI/CD pipeline times, and fundamentally elevates the reliability and scalability of our entire automation suite. This direct control over dependencies translates into a higher ROI for our engineering efforts by delivering faster feedback and more robust software.