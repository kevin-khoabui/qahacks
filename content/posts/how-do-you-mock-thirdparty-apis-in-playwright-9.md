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
Mocking third-party APIs is a critical technique in modern automation testing to ensure test stability, speed, and comprehensive coverage. This allows test suites to run predictably and quickly, free from external service dependencies, and enables the simulation of various API states including errors.

### Interview Question:
How do you mock third-party APIs in Playwright?

### Expert Answer:
Playwright's `page.route()` API is the cornerstone for effectively mocking third-party APIs. This powerful capability allows us to intercept network requests made by the browser and respond with custom data, effectively isolating our tests from external dependencies. This is crucial for test stability, speed, and for simulating edge cases that are difficult to trigger in a live environment.

The `page.route(url, handler)` method takes a URL pattern (string, glob, or regex) and an asynchronous handler function. Inside the handler, we can inspect the `route.request()` object for details like method, headers, and post data, and then call `route.fulfill()` to provide a custom response. Alternatively, `route.abort()` can simulate network failures, or `route.continue()` can allow the request to proceed as normal.

**Implementation Scenarios & Best Practices:**

1.  **Static JSON Responses:** For common scenarios, we can hardcode specific JSON payloads.
    ```typescript
    await page.route('**/api/users', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 1, name: 'Mock User' }]),
      });
    });
    ```
    *Best Practice:* Centralize mock data in separate JSON files or utility functions to keep tests clean and maintainable.

2.  **Dynamic Responses based on Request:** For more complex interactions, we can inspect the incoming request's body or headers.
    ```typescript
    await page.route('**/api/orders', async route => {
      if (route.request().method() === 'POST') {
        const payload = route.request().postDataJSON();
        if (payload.item === 'premium') {
          await route.fulfill({ status: 201, body: JSON.stringify({ orderId: 'P-123' }) });
        } else {
          await route.fulfill({ status: 400, body: 'Invalid Item' });
        }
      } else {
        await route.continue(); // Let GET requests pass
      }
    });
    ```
    *Best Practice:* Use specific URL patterns to prevent unintended interceptions. Leverage `route.request().postDataJSON()` or `postData()` for request body inspection.

3.  **Error Simulation:** To test UI resilience, we can simulate various HTTP error codes.
    ```typescript
    await page.route('**/api/fail-service', async route => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });
    ```
    *Best Practice:* Ensure mocks are torn down correctly. Playwright automatically cleans up routes associated with a `page` or `context` when they are closed, but for specific tests, ensure routes are precisely scoped.

**Framework Architecture Integration:**
In a robust automation framework, mocking logic should be abstracted. We typically create `NetworkMocker` utility classes or integrate mocking directly into our Page Object Model (POM) methods where specific API calls are made. Test fixtures (`test.beforeEach`, `test.afterEach`) are ideal for setting up and tearing down routes per test or test suite, ensuring a clean state. This promotes reusability, reduces boilerplate, and makes mock configurations highly readable and manageable. For example, a base test fixture could expose methods to `mockApiCall(url, data)` making it declarative.

By systematically applying `page.route()`, we achieve predictable test environments, enabling thorough validation of application behavior without relying on external services, significantly enhancing testing efficiency and reliability.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
"In modern CI/CD pipelines, ensuring rapid and stable end-to-end test execution is absolutely paramount for maintaining deployment velocity and product quality. A significant hurdle we often encounter is the inherent unreliability and latency introduced by external third-party API dependencies. This is precisely where effective API mocking strategies in our Playwright automation framework become indispensable."

[The Core Execution]
"Our approach for handling these external APIs in Playwright primarily leverages its powerful `page.route()` API. This method acts as a sophisticated network interceptor, allowing us to programmatically catch any outgoing HTTP/HTTPS requests that match a predefined URL pattern—whether that's a simple string, a glob, or a regular expression. Once intercepted, we gain full control. We can inspect the incoming request, examining its method, headers, and crucially, its payload. Based on these insights, we then use `route.fulfill()` to provide a custom, predetermined response. This enables several critical scenarios: from serving static JSON payloads for predictable data scenarios, to dynamically generating responses based on the request's content for more complex state manipulation. Furthermore, it's invaluable for simulating adverse conditions like network errors, 500 internal server errors, or 403 forbidden responses, allowing us to robustly test our application's error handling and UI resilience. Architecturally, we encapsulate these mocking configurations within dedicated `network-mocks` utility modules or even integrate them directly into our Playwright fixtures. This provides a clean, declarative way to apply specific mock behaviors for individual tests or entire suites, ensuring a consistent and isolated test environment."

[The Punchline]
"Ultimately, this comprehensive strategy for mocking third-party APIs not only drastically improves the stability and execution speed of our test suite by eliminating external flakiness, but it also empowers our teams to conduct far more extensive and reliable testing of UI behavior under various backend conditions, leading to significantly higher confidence in our releases and a tangible return on our engineering investment."