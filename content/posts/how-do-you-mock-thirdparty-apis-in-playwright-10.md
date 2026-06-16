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
Mocking third-party APIs in Playwright is crucial for creating deterministic, fast, and stable end-to-end tests that are independent of external services. This strategy isolates the system under test, enabling comprehensive coverage of various UI states and error handling.

### Interview Question:
How do you mock third-party APIs in Playwright?

### Expert Answer:
Effectively mocking third-party APIs in Playwright primarily leverages the `page.route()` method, which allows us to intercept network requests and fulfill them with custom responses. This is fundamental for isolating tests and achieving consistent, reliable execution.

Here's a structured approach:

1.  **Intercepting Requests with `page.route()`**:
    The core mechanism involves setting up a route handler before navigating to the page or performing actions that trigger the API call.

    ```typescript
    await page.route('**/api/external-service/*', async route => {
        // Log the intercepted request for debugging
        console.log(`Intercepted: ${route.request().url()}`);

        // Fulfill the request with a custom response
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                mockData: 'successfully retrieved from mock',
                items: [
                    { id: 1, name: 'Mock Item A' },
                    { id: 2, name: 'Mock Item B' }
                ]
            }),
            headers: {
                'x-mock-header': 'Playwright-Mock'
            }
        });
    });
    ```
    The glob pattern `**/api/external-service/*` allows matching any URL containing `/api/external-service/`.

2.  **Handling Different Scenarios**:
    *   **Success Scenarios**: Return a `status: 200` with the expected JSON payload, simulating successful data retrieval or operation.
    *   **Error Scenarios**: Return non-200 statuses (`status: 401`, `404`, `500`) with appropriate error messages in the body to test UI error handling and recovery.
    *   **Empty States**: Return an empty array or object as JSON to test how the UI renders when no data is available.
    *   **Loading States (Delay)**: Introduce a `setTimeout` within `route.fulfill` to simulate network latency, allowing testing of loading spinners or skeleton screens.

3.  **Conditional Mocking**:
    For APIs with multiple endpoints or varying responses based on request parameters (e.g., query params, request body), you can add conditional logic within the route handler.

    ```typescript
    await page.route('**/api/data-endpoint', async route => {
        const requestBody = route.request().postDataJSON(); // For POST requests
        const url = route.request().url();

        if (url.includes('id=123')) {
            await route.fulfill({ status: 200, body: JSON.stringify({ specificData: 'for_id_123' }) });
        } else if (requestBody && requestBody.type === 'premium') {
            await route.fulfill({ status: 200, body: JSON.stringify({ premiumContent: [] }) });
        } else {
            await route.fulfill({ status: 200, body: JSON.stringify({ defaultData: 'standard' }) });
        }
    });
    ```

4.  **Framework Integration and Best Practices**:
    *   **Dedicated Mock Files**: Store mock JSON payloads in separate files (e.g., `mocks/api/success.json`, `mocks/api/error.json`) and load them using `fs.readFileSync` for better maintainability.
    *   **Helper Functions**: Encapsulate common mocking patterns into reusable helper functions or utilities within your test framework to avoid duplication and improve readability.
    *   **Teardown**: Ensure routes are properly closed if they're specific to a single test or test block, though Playwright usually cleans up routes between tests when `page` is created per test.
    *   **Hybrid Approach**: For extremely complex scenarios with intricate state management or dependencies, consider dedicated mock servers (e.g., Mock Service Worker, WireMock, MS Teams Dev Proxy) that run alongside your tests. Playwright can then be configured to point to these local mock servers instead of the real third-party services.

By strategically implementing `page.route()`, automation teams gain granular control over external API responses, leading to more resilient, faster, and reliable test suites.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
In modern CI/CD pipelines, ensuring robust and scalable end-to-end tests that are completely independent of external dependencies is paramount for engineering efficiency and speed. When we're talking about automating with Playwright, a critical aspect of achieving this independence, especially for complex applications, is the ability to effectively mock third-party APIs.

[The Core Execution]
Our primary mechanism for this in Playwright is the `page.route()` method. This powerful feature allows us to intercept any network request originating from the browser, identify if it targets a third-party service, and then fulfill it with a custom response. For instance, if our application makes a call to an external payment gateway or a data analytics service, we can set up a route handler like this: `await page.route('**/api/payment/*', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ transactionId: 'mock123' }) }));`. This lets us simulate successful transactions, various error states like a 401 unauthorized, or even an empty data response to thoroughly test our UI's behavior under diverse conditions. We can also introduce conditional logic within these handlers, examining the request URL or body to return different mock payloads based on specific parameters, allowing us to cover a multitude of complex scenarios. Furthermore, we often centralize these mock payloads into dedicated JSON files and abstract the mocking logic into reusable helper functions within our framework. For highly complex, stateful third-party interactions, we might integrate with a local mock server like Mock Service Worker, where Playwright then routes its traffic, providing an even richer, shared mocking environment.

[The Punchline]
Ultimately, this strategic approach to API mocking dramatically improves test stability by removing external flakiness, significantly reduces execution time by avoiding real network calls, and allows our test suite to be truly independent and deterministic. This yields a substantial return on our automation engineering investment, enabling faster feedback cycles and greater confidence in our deployments.