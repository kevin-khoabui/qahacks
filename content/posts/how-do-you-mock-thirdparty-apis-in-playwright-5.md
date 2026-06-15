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
Mocking third-party APIs is fundamental for creating stable, fast, and deterministic end-to-end tests by isolating the system under test from external dependencies. Playwright provides robust network interception capabilities that are essential for simulating various API responses and ensuring reliable automation.

### Interview Question:
How do you mock third-party APIs in Playwright?

### Expert Answer:
Effectively mocking third-party APIs in Playwright is crucial for achieving fast, stable, and deterministic end-to-end tests, isolating the System Under Test (SUT) from external volatility. Playwright's `page.route()` API is the primary mechanism for network interception and manipulation.

The core implementation involves:

1.  **Intercepting Requests with `page.route()`:**
    This method allows specifying a URL pattern (string, regex, or glob) and a handler function or an object to fulfill the request.

    ```typescript
    await page.route('**/api/users', async route => {
        // ... fulfillment logic ...
    });
    ```
    The `page.route()` call should typically be placed before the action that triggers the network request.

2.  **Fulfilling Requests with `route.fulfill()`:**
    Inside the `route()` handler, `route.fulfill()` is used to respond to the intercepted request with custom data, status codes, and headers.

    *   **Static Mocking:** For simple, consistent responses.
        ```typescript
        await page.route('**/api/users', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{ id: 1, name: 'Mock User' }]),
            });
        });
        ```

    *   **Dynamic/Conditional Mocking:** To simulate various scenarios (success, error, empty data) based on the original request's properties (e.g., path, query parameters, POST body). The `route.request()` object provides access to these details.

        ```typescript
        await page.route('**/api/products/**', async route => {
            const request = route.request();
            const url = new URL(request.url());
            const productId = url.pathname.split('/').pop();

            if (productId === '123') {
                await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 123, name: 'Product A' }) });
            } else if (productId === '404') {
                await route.fulfill({ status: 404, body: 'Not Found' });
            } else {
                await route.continue(); // Let other requests pass
            }
        });
        ```
        For POST/PUT requests, `request.postDataJSON()` or `request.postData()` can be used to inspect the request body and tailor responses accordingly.

**Framework Integration & Best Practices:**

*   **Modularization:** Encapsulate mock logic within dedicated `mockService` files or helper functions (e.g., `setupUserMocks(page, scenario)`). This promotes reusability and maintainability.
*   **Test Fixtures (`test.extend`):** Leverage Playwright's fixture system to create custom fixtures that set up common mock configurations for tests. This abstracts the setup boilerplate.
    ```typescript
    import { test as baseTest } from '@playwright/test';

    type MyFixtures = {
      mockApi: (scenario: 'success' | 'notFound') => Promise<void>;
    };

    export const test = baseTest.extend<MyFixtures>({
      mockApi: async ({ page }, use) => {
        const mockFn = async (scenario) => {
          await page.route('**/api/data', async route => {
            if (scenario === 'success') {
              await route.fulfill({ status: 200, contentType: 'application/json', body: '{"key": "value"}' });
            } else {
              await route.fulfill({ status: 404, body: 'Not Found' });
            }
          });
        };
        await use(mockFn);
      },
    });

    // Usage: test('my test', async ({ page, mockApi }) => { await mockApi('success'); /* ... */ });
    ```
*   **External Data:** Store complex mock payloads in external JSON files. This keeps tests clean and allows easy modification of mock data.
*   **Scenario-Based Mocks:** Design mocks to support different test scenarios (e.g., `emptyState`, `errorState`, `fullDataSet`).
*   **Request Continuation:** Use `route.continue()` for requests that don't need mocking or for partial mocking where some requests pass through.
*   **Global vs. Test-Specific Mocks:** Use `page.route()` within individual `test()` blocks for test-specific mocks, or set them up in a `beforeEach` hook or fixture for broader application. Always ensure mocks are scoped to avoid interference.

This robust approach to API mocking in Playwright ensures comprehensive, reliable, and efficient testing of complex applications.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
"In modern E2E automation, especially for applications relying heavily on external services, the ability to effectively mock third-party APIs is not just a nice-to-have, it's a foundational pillar for test stability, speed, and overall engineering efficiency. Playwright, with its powerful network interception capabilities, provides us with elegant solutions to this challenge, ensuring our test suites are deterministic and resilient to external system fluctuations."

[The Core Execution]
"Our approach centers around Playwright's `page.route()` API. This allows us to intercept any network request originating from the browser and define custom handling logic. When we encounter a request destined for a third-party API that we wish to mock, we use `page.route()` with a specific URL pattern – be it a glob, a string, or a regular expression – to catch it.

Once intercepted, we leverage `route.fulfill()`. This method is incredibly versatile. For simple, consistent responses, we can provide static JSON bodies, a `200` status code, and appropriate headers. However, where it truly shines is in dynamic mocking. We can write a handler function that inspects the incoming `route.request()`. This allows us to examine the request method, headers, query parameters, or even the POST body using `request.postDataJSON()`. Based on this information, we can then dynamically tailor the response – perhaps simulating a successful data retrieval for a specific `productId`, an empty array for another scenario, or even a `404` or `500` error state.

From a framework architecture perspective, we modularize this. We create dedicated 'mock services' or utility functions that encapsulate these `page.route()` setups. Furthermore, we extensively use Playwright's `test.extend` fixture system to abstract the mock setup boilerplate. This allows us to declare, for instance, a `mockApi` fixture that can be configured on a per-test basis to provide different mock scenarios – 'success', 'userNotFound', 'serverError' – simply by passing an argument. For complex mock payloads, we externalize them into JSON files, keeping our test code clean and focused on the interaction logic."

[The Punchline]
"This disciplined approach to API mocking significantly elevates our E2E testing strategy. It decouples our tests from flaky external services, slashes execution times, and makes our test suite incredibly reliable and deterministic. Ultimately, it translates directly into faster feedback cycles in CI/CD, higher confidence in our deployments, and a substantial return on our automation investment by ensuring our test results are always reflective of our application's true behavior, not just the state of external systems."