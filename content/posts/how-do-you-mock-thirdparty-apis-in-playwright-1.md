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
Mocking third-party APIs is a critical technique in modern automation frameworks like Playwright to ensure test stability, speed, and isolation from external dependencies. This capability allows engineers to simulate various API responses, enabling comprehensive testing of UI behavior under diverse backend conditions without actual external calls.

### Interview Question:
How do you mock third-party APIs in Playwright?

### Expert Answer:
In Playwright, the primary mechanism for mocking third-party APIs is the `page.route()` API. This powerful feature allows us to intercept network requests, inspect them, and then fulfill them with custom responses, effectively bypassing the actual network call.

The general approach involves:

1.  **Intercepting Requests:** Using `page.route(url, handler)`. The `url` can be a string, a regular expression, or a glob pattern to match the requests we want to intercept.
2.  **Handling the Request:** The `handler` is an asynchronous function that receives a `Route` object. This object provides methods to analyze the intercepted request and fulfill it with a mock response.

Here's a breakdown of common strategies and implementation details:

**Core `page.route()` Usage:**

```typescript
// Example: Mocking a specific third-party API endpoint
await page.route('**/api/v1/thirdparty/data', async route => {
  // Option 1: Fulfill with a static JSON object
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ message: 'Mocked data from third party' }),
  });

  // Option 2: Fulfill from a local JSON file for larger payloads
  // const mockData = require('./mockData.json');
  // await route.fulfill({
  //   status: 200,
  //   contentType: 'application/json',
  //   body: JSON.stringify(mockData),
  // });
});
```

**Advanced Mocking Scenarios:**

*   **Conditional Mocking:** We can inspect the request method, headers, or body to provide different mocks.

    ```typescript
    await page.route('**/api/v1/users', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 201, body: 'User created' });
      } else if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify([{ id: 1, name: 'Mock User' }]) });
      } else {
        await route.continue(); // Let other methods go through
      }
    });
    ```

*   **Error Simulation:** Simulating API errors (e.g., 401 Unauthorized, 500 Internal Server Error) is crucial for robust UI testing.

    ```typescript
    await page.route('**/api/v1/protected', async route => {
      await route.fulfill({ status: 401, body: 'Unauthorized' });
    });
    ```

*   **Delaying Responses:** Simulating slow network conditions for loading states.

    ```typescript
    await page.route('**/api/v1/products', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
      await route.fulfill({ status: 200, body: JSON.stringify([]) });
    });
    ```

*   **Reusing Mocks with Fixtures:** For larger frameworks, it's best to encapsulate mocking logic within custom Playwright fixtures or helper functions. This promotes reusability and maintainability.

    ```typescript
    // In a custom fixture, e.g., 'testMocks.ts'
    import { test as baseTest } from '@playwright/test';

    type MyFixtures = {
      mockThirdPartyApi: (page: Page, scenario: 'success' | 'error') => Promise<void>;
    };

    export const test = baseTest.extend<MyFixtures>({
      mockThirdPartyApi: async ({ page }, use) => {
        await use(async (pageToMock, scenario) => {
          if (scenario === 'success') {
            await pageToMock.route('**/api/v1/external-service', r => r.fulfill({ status: 200, body: 'OK' }));
          } else if (scenario === 'error') {
            await pageToMock.route('**/api/v1/external-service', r => r.fulfill({ status: 500, body: 'Server Error' }));
          }
        });
      },
    });

    // In a test file
    // test('should handle external service error', async ({ page, mockThirdPartyApi }) => {
    //   await mockThirdPartyApi(page, 'error');
    //   await page.goto('/my-app');
    //   // Assert error message on UI
    // });
    ```

**Best Practices for Framework Integration:**

1.  **Centralized Mock Definitions:** Store mock data and routing logic in a dedicated `mocks` directory or a service layer.
2.  **Clear Naming Conventions:** Ensure mock files and functions clearly indicate the API endpoint and the scenario they represent (e.g., `getUsersSuccess.json`, `postUserError.ts`).
3.  **Scoped Mocks:** Apply `page.route()` within specific tests or `beforeEach` hooks to ensure mocks are active only when needed, avoiding unintended side effects.
4.  **`route.continue()` for Non-Mocked Requests:** If a request isn't meant to be mocked, ensure `route.continue()` is called to allow it to proceed to the actual network.
5.  **Avoid Over-Mocking:** While essential for isolation, ensure a balance. Critical end-to-end flows should occasionally test against real integrated environments to validate true system behavior.
6.  **Teardown:** Playwright automatically clears routes at the end of each test, but explicit `page.unroute()` can be used if dynamic unrouting is required within a single test.

This approach significantly enhances test reliability, speed, and the ability to thoroughly test complex UI scenarios tied to varied API responses.

### Speaking Blueprint (3-Minute Verbal Response):

[The Hook]
"When architecting robust automation suites, one of the biggest challenges, and often a bottleneck to testing scalability and engineering efficiency, is dealing with third-party API dependencies. Real-world applications constantly interact with external services, and relying on these for every test run can introduce flakiness, slow down execution, and make it impossible to simulate specific edge cases like network errors or very specific data payloads. This is precisely where mocking capabilities, like those brilliantly offered by Playwright, become indispensable."

[The Core Execution]
"In Playwright, our go-to mechanism for effectively mocking third-party APIs is the `page.route()` API. It's incredibly powerful because it allows us to intercept any network request originating from the browser, inspect it, and then fulfill it with a custom response without ever hitting the actual network. The fundamental process involves defining a route pattern, which can be a URL string, a glob pattern, or even a regular expression to match the API calls we want to intercept. Once a request matches, we provide an asynchronous handler function that receives a `Route` object. Within this handler, we can analyze the incoming `Request` object—checking its method, headers, or body—and then use `route.fulfill()` to send back a predetermined status code, custom headers, and a body, often sourcing this from static JSON files for stable data, or generating dynamic responses for more complex scenarios like pagination or error conditions. For instance, simulating a 500 Internal Server Error is as simple as fulfilling with `status: 500`. We typically integrate this into our framework by creating dedicated 'mocking fixtures' or helper functions that configure these routes before a test runs, providing a clean, reusable interface for various test scenarios."

[The Punchline]
"This strategy ensures our tests are deterministic, incredibly fast, and completely isolated from the vagaries of external services. It empowers us to thoroughly validate UI behavior for every conceivable backend state—from successful data retrieval to network timeouts or authentication failures—without incurring real-world costs or delays. Ultimately, this leads to significantly faster CI/CD cycles, a more stable test suite, and a substantial boost in overall engineering velocity and confidence in our releases, delivering a clear ROI on our automation investment."