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
Mocking third-party APIs is a crucial strategy in modern automation frameworks like Playwright to ensure test determinism, accelerate execution, and isolate application under test logic from external network dependencies. This technique significantly enhances the reliability and efficiency of end-to-end and integration test suites.

### Interview Question:
How do you mock third-party APIs in Playwright?

### Expert Answer:
In Playwright, robust API mocking for third-party services is achieved primarily through its `page.route()` API. This powerful feature allows us to intercept network requests and fulfill them with custom responses, effectively isolating our application from external dependencies and ensuring test stability and speed.

Here's a breakdown of the implementation:

1.  **Request Interception:**
    The `page.route(url, handler)` method is the core. The `url` argument can be a string, a regular expression, or a glob pattern to match specific API endpoints. The `handler` is an async function that receives a `route` object, providing control over the intercepted request.

    ```typescript
    await page.route('**/api/thirdparty/*', async route => {
        // ... custom response logic
    });
    ```

2.  **Custom Response Fulfillment:**
    Inside the `handler`, we use `route.fulfill(options)` to provide the mock response. The `options` object allows specifying:
    *   `status`: HTTP status code (e.g., `200`, `404`, `500`).
    *   `contentType`: MIME type of the response (e.g., `'application/json'`).
    *   `body`: The response body, typically a JSON string.
    *   `headers`: Custom HTTP headers.

    ```typescript
    // Example: Mocking a successful GET request
    await page.route('**/users', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 1, name: 'Mock User' }]),
      });
    });

    // Example: Mocking an error response
    await page.route('**/items', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });
    ```

3.  **Dynamic Mocking & Request Inspection:**
    The `route` object also provides access to the original request details via `route.request()`. This enables dynamic mocking based on request parameters (e.g., URL query params, POST body).

    ```typescript
    await page.route('**/products/*', async route => {
      const productId = route.request().url().split('/').pop();
      if (productId === '123') {
        await route.fulfill({ /* specific mock for product 123 */ });
      } else {
        await route.fulfill({ /* generic mock */ });
      }
    });
    ```

4.  **Handling Different HTTP Methods:**
    We can inspect `route.request().method()` to provide different mocks for `GET`, `POST`, `PUT`, `DELETE` to the same endpoint.

5.  **Unroute for Cleanup:**
    For specific tests requiring a mock, it's good practice to `await page.unroute(url)` after the test to prevent interference with subsequent tests, though Playwright's `beforeEach`/`afterEach` context usually handles this cleanly per test.

**Automation Best Practices:**
*   **Centralized Mock Definitions:** Store mock data (JSON files) and routing logic in a dedicated `mocks` or `api-stubs` directory within your framework. This promotes reusability and maintainability.
*   **Test Data Management:** Integrate with a test data factory pattern to generate dynamic mock data, making tests more robust to schema changes.
*   **Scenario-Based Mocks:** Create distinct mocking setups for different test scenarios (e.g., `userLoggedInMock.ts`, `productOutOfStockMock.ts`) to easily apply relevant stubs.
*   **Playwright Fixtures:** Leverage Playwright's fixture system to encapsulate complex routing logic, providing clean, reusable mock setups across tests.
*   **Performance:** Mocking bypasses actual network calls, drastically reducing test execution time and flakiness caused by slow or unavailable third-party services.

By employing `page.route()`, we achieve a highly controlled, stable, and fast testing environment, critical for robust CI/CD pipelines.

### Speaking Blueprint (3-Minute Verbal Response):

[The Hook]
One of the most significant challenges in building scalable and reliable automation frameworks, especially in modern microservices architectures, is managing external dependencies—specifically, flaky or slow third-party APIs. If we don't effectively isolate our tests from these external factors, our test suites become inherently brittle, slow, and non-deterministic, ultimately eroding confidence in our CI/CD pipeline. This is precisely where Playwright's powerful network interception capabilities shine, enabling us to mock third-party APIs with precision and efficiency.

[The Core Execution]
Our approach leverages Playwright's `page.route()` API. When faced with a third-party API call, for instance, to an authentication provider or a payment gateway, we use `page.route()` to intercept that specific network request before it ever leaves the browser context. This method takes a URL pattern, which can be a string, a glob, or a regular expression, along with an asynchronous handler function. Inside this handler, we gain full control over the intercepted request. We then use `route.fulfill()` to provide a custom response. This isn't just about static JSON; we can dynamically set the HTTP status code—think 200 for success, 404 for not found, or 500 for a server error—specify the content type, and, crucially, craft a custom response body. This allows us to simulate a vast array of scenarios: successful data retrieval, empty data sets, various error conditions, or even delayed responses for performance testing, all without ever touching the actual external service. We often centralize our mock definitions and data in dedicated directories, sometimes even using Playwright fixtures, to ensure reusability and maintainability across our test suite, making it easy to swap mock responses based on the test scenario.

[The Punchline]
The strategic implementation of API mocking with Playwright's `page.route()` is absolutely foundational for achieving true test determinism and accelerating test execution. It means our tests run faster because they're not waiting on real network calls, they're more reliable because they're immune to external service outages or rate limits, and crucially, they provide precise feedback on our application's logic, not the status of a third-party service. This level of control and isolation ultimately translates into higher engineering efficiency, faster development cycles, and a significantly higher return on investment for our automation efforts.