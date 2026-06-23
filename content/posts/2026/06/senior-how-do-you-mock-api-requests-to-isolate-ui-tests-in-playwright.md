---
title: "(Senior) How do you mock API requests to isolate UI tests in Playwright?"
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
Effectively mocking API requests in Playwright is crucial for creating fast, stable, and deterministic UI tests that are isolated from backend dependencies. This strategy is fundamental for robust automation frameworks and efficient CI/CD pipelines.

### Interview Question:
(Senior) How do you mock API requests to isolate UI tests in Playwright?

### Expert Answer:
Playwright provides the `page.route()` method, a powerful primitive for intercepting and modifying network requests. To isolate UI tests, we leverage this method to mock API responses, ensuring deterministic and fast execution by bypassing actual backend calls.

The core implementation involves:
1.  **Request Interception**: Using `page.route(url, handler)`. The `url` argument can be a string, glob pattern, regular expression, or a function, allowing precise targeting of API endpoints (e.g., `**/api/users`). The `handler` is an asynchronous function that receives a `Route` object, representing the intercepted request.
2.  **Response Fulfillment**: Within the `handler`, we use `route.fulfill()` to provide a custom response. This object accepts `status`, `contentType`, and `body` (typically a JSON stringified object).
    *   `route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });`
    *   For simulating error conditions, `status: 400` or `route.abort('failed')` can be used.
    *   `route.continue()` allows the request to proceed to the actual backend, useful for partial mocking or debugging specific scenarios.
3.  **Framework Integration**:
    *   **Dedicated Mocks Module**: Establish a `src/mocks` directory containing functions, each responsible for configuring mocks for a specific API endpoint or a set of related endpoints for a given test scenario. These functions typically accept the `page` object as an argument.
    *   **Contextual Mocks**: For dynamic data or varying scenarios (e.g., empty state vs. data-filled state), these mock functions can accept additional parameters (e.g., `mockUserList(page, { isEmpty: true })`).
    *   **Test Setup**: Apply mocks in `test.beforeEach()` hooks for suite-wide isolation, or directly within individual `test()` cases for granular control. Navigation (`page.goto()`) should consistently occur *after* mocks are enabled.

```javascript
// src/mocks/userMocks.js
export const mockUserList = async (page, users = [{ id: 'u1', name: 'Mock User' }]) => {
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(users)
    });
  });
};

// tests/userManagement.spec.js
import { test, expect } from '@playwright/test';
import { mockUserList } from '../src/mocks/userMocks';

test.describe('User Management UI', () => {
  test.beforeEach(async ({ page }) => {
    await mockUserList(page); // Apply standard mock for this suite
    await page.goto('/users'); // Navigate after mocks are set
  });

  test('should display mocked user data', async ({ page }) => {
    await expect(page.locator('text=Mock User')).toBeVisible();
  });

  test('should display empty state if no users', async ({ page }) => {
    await page.unroute('**/api/users'); // Remove previous mock
    await mockUserList(page, []); // Apply empty user mock
    await page.reload(); // Refresh page to trigger the new mock
    await expect(page.locator('text=No users found')).toBeVisible();
  });
});
```
This approach guarantees test determinism, eliminates flakiness due to backend instability, and significantly boosts execution speed, making UI tests robust and reliable for CI/CD environments.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]: In today's fast-paced CI/CD pipelines, the ability to run UI tests rapidly and reliably, independent of backend services, is paramount for engineering efficiency and ensuring release quality. Relying on live backend APIs introduces significant flakiness, slows down execution, and creates environmental dependencies that hinder scalable automation. This is precisely where effective API mocking becomes a critical strategy.

[The Core Execution]: For isolating Playwright UI tests, we leverage Playwright's robust `page.route()` method. This powerful primitive allows us to intercept any network request originating from the browser and, crucially, to fully control its response. The process involves defining patterns, typically using glob patterns or regular expressions, to match the specific API endpoints we intend to mock – for instance, `**/api/users` for a user list endpoint. Once intercepted, the `route` object provides methods like `fulfill`, enabling us to dictate the exact HTTP status code, response headers, and the JSON body that the UI expects. This means we can craft scenarios ranging from a successful data retrieval to an empty state, or even various error conditions like a 404 or 500, all without touching the actual backend. Our framework integrates this by establishing a dedicated `src/mocks` module, where we encapsulate reusable mock functions. These functions take the `page` object as an argument and dynamically set up the routing rules. We then invoke these specific mock functions within our Playwright tests, typically within `test.beforeEach` for suite-wide consistency, or directly within individual `test` cases for fine-grained scenario testing. It's crucial to set up these mocks *before* navigating the page, ensuring the UI loads with the mocked data from the outset. We can even dynamically pass parameters to these mock functions to alter the response data, simulating different data sets or edge cases.

[The Punchline]: Ultimately, by meticulously implementing this API mocking strategy with Playwright, we transform our UI tests into truly isolated, deterministic units. This foundational practice not only eradicates flakiness caused by external dependencies but also dramatically accelerates test execution, providing faster feedback loops for developers. It's a key enabler for building a resilient, high-performing automation suite, delivering higher confidence in our releases and a significant return on investment through reduced debugging efforts and more efficient development cycles.