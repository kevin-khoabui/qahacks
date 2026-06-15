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
Mocking third-party APIs in Playwright is crucial for creating deterministic, fast, and stable end-to-end tests by eliminating external dependencies. This capability allows automation engineers to simulate various API responses, isolate test environments, and focus purely on UI and integration logic without network flakiness.

### Interview Question:
How do you mock third-party APIs in Playwright?

### Expert Answer:
Effective mocking of third-party APIs in Playwright centers on its powerful network interception API, `page.route()`. This method allows us to intercept network requests, fulfill them with custom data, redirect them, or modify them before they reach their destination, providing full control over the test environment.

Here's a breakdown of the core implementation and best practices:

**1. Basic Static Response Mocking:**
The simplest approach is to fulfill a specific URL pattern with a predefined JSON payload.

```typescript
await page.route('**/api/users', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Mock User', email: 'mock@example.com' }]),
  });
});
```

**2. Dynamic Response Mocking:**
For more complex scenarios, the `fulfill` callback can inspect the request (method, headers, body) and return a dynamic response. This is essential for simulating POST requests that return created entities or GET requests with query parameters.

```typescript
await page.route('**/api/products', async (route) => {
  if (route.request().method() === 'POST') {
    const requestBody = JSON.parse(route.request().postData() || '{}');
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: Math.floor(Math.random() * 1000) + 1, ...requestBody }),
    });
  } else if (route.request().url().includes('category=electronics')) {
    // Conditional GET response
    route.fulfill({ /* specific electronics data */ });
  } else {
    route.continue(); // Allow non-mocked requests to proceed
  }
});
```

**3. Simulating Error States:**
Mocking error responses is vital for testing UI resilience and error handling.

```typescript
await page.route('**/api/orders', (route) => {
  route.fulfill({
    status: 500, // Internal Server Error
    contentType: 'application/json',
    body: JSON.stringify({ message: 'Service unavailable' }),
  });
});

await page.route('**/api/auth/login', (route) => {
  route.fulfill({
    status: 401, // Unauthorized
    contentType: 'application/json',
    body: JSON.stringify({ message: 'Invalid credentials' }),
  });
});
```

**4. Delay Simulation:**
To test loading states or UI feedback during long-running requests, introduce artificial delays.

```typescript
await page.route('**/api/data', async (route) => {
  await new Promise(f => setTimeout(f, 2000)); // 2-second delay
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ message: 'Data loaded after delay' }),
  });
});
```

**5. Framework Integration and Best Practices:**
*   **Centralized Mock Definitions:** Define mock data and routing logic in a dedicated `mockService.ts` or `network-mocks.ts` file. This promotes reusability and maintainability.
*   **Test Fixtures:** Leverage Playwright's `test.extend` to create custom fixtures that set up specific mocks for a suite or test case. This ensures mocks are applied consistently and cleaned up automatically.

    ```typescript
    // fixtures/mocking.ts
    import { test as base } from '@playwright/test';
    export const test = base.extend<{ mockUsers: void }>({
      mockUsers: [async ({ page }, use) => {
        await page.route('**/api/users', r => r.fulfill({ status: 200, body: '[]' }));
        await use(); // Proceed with the test
      }, { auto: false }], // Set auto:true for global mocks, false for explicit per test
    });

    // In a test file:
    // import { test } from '../fixtures/mocking';
    // test('should display no users', async ({ page, mockUsers }) => { /* ... */ });
    ```
*   **Granularity:** Design mocks to be as granular as needed for a given test scenario. Avoid overly broad mocks that might unintentionally affect other tests.
*   **Clear Naming:** Use descriptive names for mock files or functions to indicate what they're simulating.
*   **Assertions:** Always assert that the UI behaves correctly under mocked conditions.

By employing `page.route()`, Playwright allows for comprehensive and flexible API mocking, leading to highly reliable and efficient automation suites.

### Speaking Blueprint (3-Minute Verbal Response):

[The Hook]
In modern microservices architectures, external dependencies—especially third-party APIs—are a significant source of test flakiness and slow execution. To build truly robust, scalable, and fast automation suites, particularly within a CI/CD pipeline, we absolutely must decouple our tests from these external factors. Playwright excels here, providing powerful mechanisms for precise API mocking.

[The Core Execution]
At its core, Playwright's approach to API mocking revolves around the `page.route()` API. This is a foundational capability that allows us to intercept any network request originating from the browser, inspect it, and then either fulfill it with custom data, redirect it, or simply allow it to proceed.

The implementation patterns are quite versatile. For static responses, say, fetching a list of users, we can simply match a URL pattern and fulfill the request with a predefined JSON payload. This is perfect for scenarios where the data doesn't change based on the request.

However, for more dynamic interactions, like a POST request to create a resource, we can leverage the callback function within `page.route()`. This callback gives us access to the incoming request object, allowing us to parse its body, inspect headers, and then craft a custom, dynamic response—perhaps returning a newly generated ID, or simulating a specific error code like a 401 Unauthorized or a 500 Internal Server Error to validate our UI's error handling. We can even introduce artificial delays to simulate slow network conditions and verify loading states.

From a framework architecture standpoint, we typically centralize our mock definitions. This means creating dedicated files or modules, perhaps within a `network-mocks` directory, where all the common API interception logic resides. Then, we integrate these mocks using Playwright's `test.extend` feature. By defining custom fixtures, we can activate specific sets of mocks for particular test suites or individual tests, ensuring that our test environment is precisely tailored and deterministic for each scenario. This approach makes mocks highly reusable, manageable, and ensures clean teardown.

[The Punchline]
Ultimately, mastering API mocking in Playwright is not just about writing robust tests; it's about elevating our overall engineering velocity. It provides the critical isolation needed for stable, fast, and deterministic test runs, significantly reducing false positives, accelerating feedback loops for developers, and ultimately boosting confidence in our deployment pipeline. It’s a non-negotiable strategy for achieving true end-to-end test reliability and maximizing our automation ROI.