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
Mocking third-party APIs in Playwright is a fundamental strategy for achieving stable, fast, and isolated end-to-end tests. It eliminates flakiness caused by external dependencies and enables comprehensive scenario testing without relying on live services.

### Interview Question:
How do you mock third-party APIs in Playwright?

### Expert Answer:
Effectively mocking third-party APIs in Playwright is crucial for creating deterministic, resilient, and fast-executing automation suites. Playwright's `page.route()` API is the primary mechanism for achieving this, allowing interception and fulfillment of network requests.

**Core Mechanism: `page.route()`**
The `page.route()` method enables interception of network requests matching a specified URL pattern. You can then provide a custom response, bypassing the actual network call.

**Implementation Steps & Details:**
1.  **Identify Endpoints:** Determine the specific API endpoints (URLs) of third-party services that your application interacts with and needs to be mocked.
2.  **Define Mock Data:** Create static JSON response payloads that represent various scenarios (e.g., successful response, error state, empty data). These can be inline objects or loaded from dedicated JSON files for better organization.
3.  **Route Configuration:** Within your Playwright test (often in a `test.beforeEach` hook or directly within a test), use `page.route()`:
    ```typescript
    await page.route('**/api/thirdparty/data', async route => {
      // Example: Load data from a file for advanced scenarios
      // const mockData = JSON.parse(fs.readFileSync('tests/mocks/success_data.json', 'utf8'));
      
      // Or define inline for simplicity:
      const mockData = { 
        id: 'mock-123', 
        status: 'active', 
        payload: 'simulated data' 
      };

      await route.fulfill({
        status: 200, // HTTP status code
        contentType: 'application/json',
        json: mockData, // Use 'json' property for JSON objects
        // body: JSON.stringify(mockData) // Alternatively, for raw string body
      });
    });
    ```
    *   **URL Pattern:** The first argument to `page.route()` can be a string, a glob pattern (e.g., `**/api/**`), or a regular expression. More specific patterns take precedence.
    *   **Handler Function:** The second argument is an asynchronous function that receives a `Route` object. This object provides methods like `fulfill()` to send a mock response, `abort()` to block the request, or `continue()` to allow it to proceed to the actual network.
    *   **`route.fulfill()`:** This method is key. It accepts an object with properties like `status`, `contentType`, `body`, `json`, and `headers` to construct the mock HTTP response.

**Advanced Patterns & Best Practices:**
*   **Conditional Mocking:** Intercept requests and dynamically decide the mock response based on request headers, body, or URL parameters. This allows simulating complex business logic for different test cases.
*   **Data-Driven Mocks:** Store different mock data sets in a dedicated `mocks` directory, loading them programmatically based on the test scenario. This enhances test readability and maintainability.
*   **Mock Server Integration:** For highly complex or shared mocking requirements, integrate with dedicated mock servers like Mock Service Worker (MSW) or WireMock. Playwright can then `page.route()` requests to hit this local mock server, providing a robust and reusable mocking layer that can also be used during development.
*   **Cleanup:** Playwright automatically unregisters routes at the end of each test, but explicit `route.abort()` can be used within the handler for specific scenarios.
*   **Framework Integration:** Encapsulate mocking logic within helper functions or Playwright fixtures to ensure reusability and maintain a clean test codebase, adhering to principles like the Page Object Model where applicable for UI interactions.

By leveraging `page.route()`, teams gain full control over external dependencies, leading to faster execution, consistent test results, and the ability to thoroughly test edge cases and error handling scenarios that would be difficult or impossible with live third-party services.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
In modern test automation, especially with frameworks like Playwright, our ability to deliver reliable, fast, and scalable tests hinges critically on decoupling from external dependencies. This is where API mocking becomes indispensable, transforming flaky integration tests into deterministic, high-velocity unit-like UI tests.

[The Core Execution]
My approach specifically leverages Playwright's powerful `page.route()` API for this. When faced with a third-party dependency, say an authentication service or a data provider that impacts test stability or speed, I first identify the exact API endpoint patterns that need interception. Then, typically within a `test.beforeEach` hook to ensure test isolation, I configure `page.route()`. This method takes a URL pattern – which can be a precise string, a glob, or a regular expression – and an asynchronous handler function. Inside this handler, the core action is calling `route.fulfill()`. This is where we dictate the mock response: specifying the HTTP status code, the `contentType` like `application/json`, and critically, the `json` payload representing our predefined mock data. For example, if we're testing a user profile page, instead of hitting a live user service, I'd intercept `**/api/v1/users/*` and `route.fulfill` with a predefined JSON payload representing a mock user. This allows us to simulate various scenarios – a successful user fetch, an empty user list, or even a 500 error – all within the isolated context of our test without actual network latency or external service flakiness. For more complex, shared mocking needs, I've also integrated this with tools like Mock Service Worker, where Playwright routes requests to a local MSW server, providing an even more sophisticated and maintainable layer of mock data management, applicable across different test types and even development environments.

[The Punchline]
Ultimately, a robust API mocking strategy in Playwright isn't just about making tests pass; it's about shifting left, enabling developers to test features without backend readiness, boosting CI/CD throughput, and fundamentally driving engineering efficiency and maintainability by ensuring our test suite is fast, reliable, and truly independent.