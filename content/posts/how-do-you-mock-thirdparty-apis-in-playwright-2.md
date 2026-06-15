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
Mocking third-party APIs in Playwright is a critical technique for achieving stable, fast, and isolated end-to-end tests by decoupling them from external dependencies. This capability allows engineers to simulate various API responses, ensuring comprehensive test coverage for all application states without incurring network overhead or reliance on external services.

### Interview Question:
How do you mock third-party APIs in Playwright?

### Expert Answer:
Mocking third-party APIs in Playwright is fundamentally achieved using the `page.route()` API. This powerful method allows us to intercept network requests matching specific patterns and respond with predefined data, status codes, or even dynamic content, effectively decoupling our tests from actual external service calls.

Here's a breakdown of the implementation and architectural considerations:

1.  **Core Mechanism: `page.route(url, handler)`**
    Playwright’s `page.route()` method is central. It takes a URL pattern (string, regex, or glob pattern) and an async handler function. The handler function receives a `Route` object, which provides methods like `fulfill()` to send a mock response.

    ```typescript
    import { test, expect } from '@playwright/test';

    test('should display mocked data from a third-party API', async ({ page }) => {
        // 1. Intercept the API call
        await page.route('**/api/users/1', async route => {
            // 2. Fulfill the request with mock data
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 1,
                    name: 'Mock User',
                    email: 'mock.user@example.com'
                }),
            });
        });

        await page.goto('/my-app-page'); // Navigate to a page that triggers this API call
        await expect(page.locator('#user-name')).toHaveText('Mock User');
    });
    ```

2.  **Dynamic Response Handling:**
    For more complex scenarios, the `handler` function can inspect the incoming request (`route.request()`) to dynamically determine the mock response. This is useful for handling different query parameters, request bodies, or simulating various success/failure paths.

    ```typescript
    await page.route('**/api/products*', async route => {
        const url = new URL(route.request().url());
        const productId = url.searchParams.get('id');

        if (productId === '123') {
            await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 123, name: 'Mock Product A' }) });
        } else if (productId === '404') {
            await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ message: 'Product not found' }) });
        } else {
            await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Internal server error' }) });
        }
    });
    ```

3.  **Simulating Network Conditions:**
    The `fulfill` method can also simulate network latency using the `delay` option, crucial for testing UI responsiveness.

    ```typescript
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Delayed response' }),
        delay: 2000 // Simulate 2 seconds of network delay
    });
    ```

4.  **Framework Integration & Best Practices:**
    *   **Dedicated Mocks Module:** Centralize mock data and routing logic in a `mocks` directory (e.g., `data/apiMocks.ts`). This promotes reusability and maintainability.
    *   **Playwright Fixtures:** Utilize custom Playwright fixtures (`test.use`) to set up and tear down routes before/after tests or test groups. This ensures isolation and clean state.
    *   **`page.unroute()`:** Explicitly unroute specific handlers or all handlers for a given URL pattern using `await page.unroute('**/api/users/*')` or `await page.unroute()`. This is essential to prevent mocks from affecting subsequent tests, especially in a `beforeEach`/`afterEach` hook.
    *   **Scenario-Based Mocks:** Define different sets of mocks for distinct test scenarios (e.g., `userLoggedInMocks`, `emptyStateMocks`).
    *   **Partial Mocking:** For endpoints where only certain fields need to be controlled, fetch the actual response first, modify it, and then fulfill. Use `route.continue()` to allow the request to proceed to the actual server, then process the response.

    ```typescript
    // Example using a custom fixture
    // In playwright.config.ts or a separate fixture file
    import { test as base } from '@playwright/test';

    type MyFixtures = {
      mockApi: (url: string, response: object, status?: number) => Promise<void>;
    };

    export const test = base.extend<MyFixtures>({
      mockApi: async ({ page }, use) => {
        const mockFn = async (url: string, response: object, status: number = 200) => {
          await page.route(url, route => route.fulfill({
            status,
            contentType: 'application/json',
            body: JSON.stringify(response),
          }));
        };
        await use(mockFn);
        // Teardown: Unroute all mocks set up by this fixture after the test
        await page.unroute('**/*');
      },
    });

    // In a test file
    test('uses mockApi fixture', async ({ page, mockApi }) => {
        await mockApi('**/api/data', { data: 'mocked' });
        await page.goto('/');
        // ... assertions
    });
    ```
By systematically applying `page.route()` with careful consideration for framework integration, we can build a robust, maintainable, and highly efficient test automation suite.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
In today's fast-paced CI/CD environments, the reliability and speed of our end-to-end tests are paramount. A common bottleneck, and indeed a significant source of flakiness, arises from external dependencies—specifically, third-party APIs. To truly achieve shift-left testing and ensure our Playwright suite is both lightning-fast and consistently stable, we absolutely must decouple our tests from these external services.

[The Core Execution]
The core mechanism we leverage in Playwright for this is the `page.route()` API. This powerful feature allows us to intercept any network request originating from our application under test, matching specific URL patterns, and then programmatically respond to them.
Let's walk through how this works. We define a route using `await page.route('**/api/external-service/*', async route => { ... })`. The first argument is a URL pattern – it can be a string, a regular expression, or a glob, giving us immense flexibility to target exactly what we need. The second argument is an asynchronous handler function that receives a `Route` object. Inside this handler, we typically use `await route.fulfill()` to send our custom mock response. This allows us to dictate the HTTP status code, the content type, and most importantly, the JSON body, simulating perfect success scenarios, various error states like 404s or 500s, or even network latency with the `delay` option.
For a robust framework, we'll abstract this into dedicated modules, perhaps `apiMocks.ts`, where we define different mock data sets for various test scenarios, such as "logged-in user" or "empty state." We then integrate these mocks using custom Playwright test fixtures. This ensures that our mocks are set up before each relevant test or test suite and, crucially, torn down afterward using `page.unroute()` to prevent test pollution and maintain strict isolation. This structured approach means our tests are hermetic, executing quickly, and providing consistent results regardless of external service availability or data state.

[The Punchline]
Ultimately, effective API mocking with Playwright isn't just a technical detail; it's a strategic imperative. It significantly boosts our test suite's stability and execution speed, enabling earlier detection of defects and contributing directly to a higher ROI on our test automation efforts. This capability empowers our engineering teams to build, test, and deploy with unparalleled confidence and velocity.