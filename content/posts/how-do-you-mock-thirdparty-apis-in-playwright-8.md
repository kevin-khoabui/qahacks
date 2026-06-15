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
Mocking third-party APIs in Playwright is a fundamental technique for isolating UI tests from external dependencies, ensuring reliable, fast, and reproducible test execution. This approach mitigates the unpredictability of external services, allowing for robust validation of application behavior under diverse data and error conditions.

### Interview Question:
How do you mock third-party APIs in Playwright?

### Expert Answer:
In Playwright, the primary mechanism for mocking third-party APIs is the `page.route()` method. This powerful API allows us to intercept network requests made by the browser and respond with custom data, effectively isolating our tests from actual backend or external service calls.

**Core Implementation Steps:**

1.  **Request Interception:** Use `page.route(url, handler)` to match outgoing requests. The `url` can be a string, a glob pattern, a regular expression, or a function for more granular control. For third-party APIs, using a regex or glob that matches the external domain and endpoint is common.

2.  **Custom Response Fulfillment:** Within the `handler` function, we receive a `Route` object. To mock the response, we call `route.fulfill(options)`. The `options` object is crucial:
    *   `status`: (Number) The HTTP status code (e.g., `200`, `404`, `500`).
    *   `contentType`: (String) The MIME type of the response (e.g., `'application/json'`).
    *   `body`: (String) The actual response body, typically a JSON string.
    *   `path`: (String) Alternatively, specify a path to a local file (e.g., a `.json` fixture) to serve as the response body. This is highly recommended for larger or complex payloads as it improves readability and maintainability.
    *   `headers`: (Object) Custom response headers.

**Example Implementation:**

```typescript
// pages/basePage.ts (utility for common mocks)
export class BasePage {
  constructor(protected page: Page) {}

  async mockThirdPartyUserService(data: any[] = [{ id: 'mock-1', name: 'Test User' }]) {
    await this.page.route('**/api/external/users*', async route => {
      console.log(`Mocking user service: ${route.request().url()}`);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data),
      });
    });
  }

  async mockThirdPartyAuthService(status: number = 200, body: object = { token: 'mock-token' }) {
    await this.page.route('**/api/auth/token*', async route => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });
  }
}

// tests/user-dashboard.spec.ts
import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/basePage';

test.describe('User Dashboard', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    // Mock successful auth and user data before each test
    await basePage.mockThirdPartyAuthService();
    await basePage.mockThirdPartyUserService([
      { id: 'user-a', name: 'Alice' },
      { id: 'user-b', name: 'Bob' },
    ]);
    await page.goto('/dashboard'); // Navigate to the page after mocks are set
  });

  test('should display mocked user list', async ({ page }) => {
    await expect(page.locator('text=Alice')).toBeVisible();
    await expect(page.locator('text=Bob')).toBeVisible();
  });

  test('should handle empty user list gracefully', async ({ page }) => {
    // Override the general user mock for this specific test
    await page.route('**/api/external/users*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '[]', // Empty array
      });
    });
    await page.reload(); // Reload to apply the new mock
    await expect(page.locator('text=No users found')).toBeVisible();
  });
});
```

**Framework Design & Best Practices:**

1.  **Centralized Mock Utilities:** Abstract `page.route()` calls into dedicated utility functions or a "Mocking Service" class (like `BasePage` above). This promotes reusability, reduces test code duplication, and makes mock definitions easier to manage.
2.  **Fixture Management:** Store mock JSON responses in a structured `fixtures/api` directory. This keeps test data version-controlled, clean, and decoupled from the test logic.
3.  **Test-Specific Overrides:** Allow individual tests to override or extend global mocks, catering to specific scenario validation (e.g., simulating a 401 error or an empty data set).
4.  **Clarity and Granularity:** Only mock the endpoints relevant to the test scenario. Avoid over-mocking, which can make tests brittle or hide real integration issues.
5.  **Unrouting:** Playwright automatically cleans up routes after a test if they are defined within `test.beforeEach` or the test block itself. For more explicit control or dynamic routing, `route.continue()` (to allow non-mocked requests to proceed) and `page.unroute()` (to remove a specific route handler) are available.

By implementing these strategies, we achieve robust, high-speed UI tests that are resilient to external service fluctuations and enable comprehensive validation of various application states.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
One of the paramount challenges in modern automation testing, especially within CI/CD pipelines, is dealing with external dependencies. Unpredictable third-party APIs can cause flaky tests, slow down execution, and make debugging a nightmare. Our goal is always to build a test suite that is fast, reliable, and entirely independent, and that's precisely where Playwright's API mocking capabilities become indispensable.

[The Core Execution]
In Playwright, our primary mechanism for achieving this is the `page.route()` API. This powerful method allows us to intercept any network request made by the browser – be it an XHR, Fetch, or even image requests – and crucially, to fulfill it with our own predefined response.

When we encounter a request destined for a third-party API, we use `page.route()` with a targeted URL pattern, which can be a glob, a regex, or a function, to ensure we only intercept the desired calls. Inside the handler function, we receive a `Route` object. It's then that we call `route.fulfill()`, specifying the exact HTTP status code, `contentType` like `application/json`, and either a direct `body` as a JSON string or, more elegantly, a `path` to a local JSON fixture file. This enables us to simulate everything from successful data retrieval, various error states like a 401 Unauthorized or a 500 Internal Server Error, to even scenarios with empty data sets.

From a framework design perspective, we abstract these `page.route()` calls into dedicated utility functions or a "Mocking Service" class. For example, a test might simply call `mockUserService.getUsers(page, mockData)` to set up a specific user list without directly interacting with Playwright's low-level API. We manage all our mock JSON data within a structured `fixtures` directory, keeping it version-controlled and highly maintainable. This approach centralizes our mock definitions, reduces duplication across tests, and allows for easy test-specific overrides when unique scenarios are needed.

[The Punchline]
Ultimately, by expertly leveraging Playwright's API mocking, we significantly enhance the stability and speed of our test suites, drastically reducing execution times within our CI/CD pipelines. This paradigm shifts our testing focus from external service availability to purely validating our frontend's behavior against a controlled, consistent environment, delivering a measurable ROI in terms of engineering efficiency, faster feedback loops, and ultimately, a higher quality product.