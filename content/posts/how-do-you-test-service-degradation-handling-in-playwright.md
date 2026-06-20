---
title: "How do you test service degradation handling in Playwright?"
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
Testing service degradation in Playwright involves simulating various network conditions and API responses to validate an application's resilience. This requires sophisticated network interception, state management, and robust assertion strategies within the automation framework.

### Interview Question:
How do you test service degradation handling in Playwright?

### Expert Answer:
Testing service degradation handling in Playwright primarily leverages its powerful `page.route()` API to intercept and manipulate network requests, combined with thoughtful UI assertion strategies.

1.  **Network Mocking and Stubbing (`page.route()`):**
    This is the core mechanism. We intercept specific API calls and programmatically return custom responses to simulate various backend issues or network conditions.
    *   **HTTP Status Errors:** Simulate 500 (Internal Server Error), 503 (Service Unavailable), or 401/403 (Unauthorized/Forbidden) responses.
        ```javascript
        await page.route('**/api/critical-data', route => {
          route.fulfill({
            status: 500,
            body: 'Internal Server Error',
            contentType: 'text/plain'
          });
        });
        ```
    *   **Delayed Responses/Latency:** Introduce artificial delays to mimic slow networks, overloaded services, or timeouts.
        ```javascript
        await page.route('**/api/products', async route => {
          await new Promise(f => setTimeout(f, 5000)); // 5-second delay
          route.fulfill({
            status: 200,
            body: JSON.stringify({ products: [] }),
            contentType: 'application/json'
          });
        });
        ```
    *   **Empty/Malformed Data:** Return empty arrays, null values, or incorrectly structured JSON to test client-side data parsing and fallback logic.
        ```javascript
        await page.route('**/api/user-profile', route => {
          route.fulfill({
            status: 200,
            body: JSON.stringify({ name: null, email: '' }),
            contentType: 'application/json'
          });
        });
        ```
    *   **Network Abort:** Simulate a complete connection failure by aborting the request.
        ```javascript
        await page.route('**/api/config', route => route.abort());
        ```

2.  **UI State and Behavior Validation:**
    After setting up the degradation scenario, the next critical step is to assert how the application's UI and functionality react.
    *   **Error Messages:** `expect(page.locator('.error-banner')).toBeVisible();`
    *   **Fallback UIs/Skeletons:** `expect(page.locator('.skeleton-loader')).toBeVisible();`
    *   **Disabled Functionality:** `expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();`
    *   **Partial Content/Stale Data:** Validate that previously loaded data is retained or appropriately marked.
    *   **Retry Mechanisms:** Verify if retry buttons or refresh options appear and function as expected.

3.  **Framework Integration and Best Practices:**
    *   **Custom Test Fixtures:** Utilize Playwright's `test.extend` to create reusable fixtures that encapsulate common `page.route()` setups for degradation, making tests DRY and maintainable.
    *   **Network Abstraction Layer:** Develop a dedicated utility class or module (e.g., `NetworkSimulator`) that abstracts the `page.route()` calls into more business-readable methods like `simulateServiceDown('critical-service')` or `addLatency('checkout-api', 3000)`.
    *   **Clear Scenarios:** Each test case should focus on a specific degradation scenario (e.g., "login_service_500_error_displays_message").
    *   **Test Isolation:** Ensure each test starts with a clean slate to prevent interference from previous degradation routes.

This comprehensive approach allows for robust validation of an application's resilience and graceful degradation under various adverse service conditions.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
"In today's highly distributed microservices architectures, ensuring an application gracefully handles service degradation isn't just a 'nice-to-have'; it's absolutely fundamental to maintaining user experience, safeguarding data integrity, and ensuring overall business continuity. Our automation strategy, particularly with Playwright, is meticulously engineered to proactively validate this resilience across all critical pathways within our system."

[The Core Execution]
"To achieve this, we leverage Playwright's exceptionally powerful network interception capabilities. Our primary mechanism involves `page.route()`, which allows us to intercept specific HTTP requests and programmatically manipulate their responses before they even reach the browser. For instance, we can simulate a backend service experiencing an outage by intercepting an API call – let's say to `/api/critical-data` – and then fulfilling that request with a `500 Internal Server Error` status code and a custom error body. Similarly, we can introduce artificial latency by inserting an `await new Promise(f => setTimeout(f, 5000))` within our route handler, effectively mimicking a slow network or an overloaded service, and then return either a successful but delayed response or even an empty data set. We've found it highly effective to encapsulate these common degradation patterns within a dedicated `NetworkSimulator` utility class, providing methods like `simulateServiceDown()` or `addLatency()`. This abstraction makes our test suites remarkably cleaner and highly reusable. Within our E2E tests, we'd simply call, for example, `networkSimulator.simulateServiceDown('/api/products')` before navigating to the relevant page. Post-simulation, our assertions then focus intently on validating the UI's precise reaction: checking for the presence of specific error banners, verifying that data is gracefully degraded or replaced with skeleton loaders, ensuring retry buttons appear and are functional, or confirming that critical functionalities become disabled as expected. This structured approach helps us isolate and test specific failure scenarios comprehensively."

[The Punchline]
"This systematic and programmatic approach allows us to not only catch potential breakdowns and race conditions very early in the SDLC but also to continuously validate the robustness of our application's error handling and fallback mechanisms within a controlled environment. It’s about building profound confidence in our system's resilience under adverse conditions, which directly translates into a superior, uninterrupted user experience and a significant reduction in production incidents—ultimately providing a tangible and measurable return on investment for our engineering efforts."