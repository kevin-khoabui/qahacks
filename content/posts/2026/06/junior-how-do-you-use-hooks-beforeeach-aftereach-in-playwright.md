---
title: "(Junior) How do you use hooks (beforeEach, afterEach) in Playwright?"
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
Playwright's `beforeEach` and `afterEach` hooks are fundamental for managing test prerequisites and post-test cleanup, enabling robust, isolated, and repeatable test execution. They are critical for establishing a consistent test environment and ensuring proper state management across individual test cases within a suite.

### Interview Question:
(Junior) How do you use hooks (beforeEach, afterEach) in Playwright?

### Expert Answer:
In Playwright, `beforeEach` and `afterEach` are powerful test lifecycle hooks provided by the `@playwright/test` runner. They are crucial for ensuring test isolation, reducing boilerplate, and enhancing the maintainability of our automation suites.

**`test.beforeEach(async ({ page, context }) => { ... });`**
This hook executes before *each individual test* within the current test file or scope. Its primary purpose is to set up a consistent state for every test, ensuring that each test starts from a known, clean slate.

**Common use cases for `beforeEach`:**
1.  **Navigation:** Navigating to a specific base URL or login page.
    ```typescript
    test.beforeEach(async ({ page }) => {
      await page.goto('https://myapp.com/login');
    });
    ```
2.  **Authentication:** Performing a login sequence to ensure the user is authenticated for subsequent tests. This often involves interacting with UI elements or making API calls to set authentication tokens.
    ```typescript
    test.beforeEach(async ({ page }) => {
      await page.goto('https://myapp.com/login');
      await page.fill('#username', 'testuser');
      await page.fill('#password', 'password123');
      await page.click('#login-button');
      await page.waitForURL('https://myapp.com/dashboard');
    });
    ```
3.  **Data Setup:** Seeding specific test data into a database or mock API responses if using network interception.
4.  **Context/Page Initialization:** While Playwright fixtures (`page`, `context`) handle much of this, `beforeEach` allows specific configurations on these objects before a test starts.

**`test.afterEach(async ({ page }, testInfo) => { ... });`**
This hook executes after *each individual test* finishes, regardless of whether the test passed or failed. Its role is to clean up any resources or state modified by the test, preventing side effects from impacting subsequent tests.

**Common use cases for `afterEach`:**
1.  **Logging Out/Session Cleanup:** Clearing cookies, local storage, or performing a logout action to ensure no session data persists.
    ```typescript
    test.afterEach(async ({ page }) => {
      await page.evaluate(() => localStorage.clear());
      await page.context().clearCookies();
    });
    ```
2.  **Screenshot on Failure:** Capturing a screenshot automatically if a test fails, which is invaluable for debugging. The `testInfo` object provides details about the test's outcome.
    ```typescript
    test.afterEach(async ({ page }, testInfo) => {
      if (testInfo.status === 'failed') {
        await page.screenshot({ path: `test-results/${testInfo.title}-failure.png` });
      }
    });
    ```
3.  **Data Teardown:** Cleaning up test data created during the `beforeEach` or the test itself.
4.  **Resource Release:** Closing any external connections or processes opened specifically for the test.

**Best Practices:**
*   **Isolation:** Use `beforeEach`/`afterEach` to ensure each test runs in an isolated environment, making them reliable and reproducible.
*   **Readability:** Keep tests focused on actual test logic by abstracting common setup/teardown into hooks.
*   **Custom Fixtures:** For more complex, reusable setup logic across multiple files, leverage Playwright's `test.extend` to create custom fixtures. This provides a more powerful and dependency-injectable approach than just hooks.
*   **Error Handling:** Ensure `afterEach` logic is robust and doesn't fail itself, especially when cleaning up after a failing test.

These hooks are fundamental for building robust, maintainable, and efficient Playwright test suites, ensuring that tests are atomic and their outcomes are predictable.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
In modern automation frameworks like Playwright, effectively leveraging lifecycle hooks is absolutely fundamental to building scalable, maintainable, and highly efficient test suites. It’s about more than just running tests; it’s about engineering an environment where tests are consistently reliable and their results are unambiguous.

[The Core Execution]
Specifically, `beforeEach` and `afterEach` in Playwright are our primary mechanisms for managing test setup and teardown at a granular, test-level scope. Consider `beforeEach`: this hook executes once before *each individual test* within a given file or scope. My typical implementation involves standardizing initial browser state – for instance, navigating to a specific application page, executing a common login flow to ensure a user is authenticated, or even setting up API mocks to guarantee a consistent test environment. This dramatically reduces boilerplate within the test itself, making tests cleaner and focused purely on the 'what' of the test rather than the 'how' of its preparation.

Conversely, `afterEach` runs after *each individual test*, regardless of its outcome. This is where we implement crucial cleanup operations. Common uses include logging out, clearing session storage to prevent state leakage, or crucially, taking a screenshot upon test failure for immediate diagnostics. This ensures that tests are truly isolated, preventing state leakage and guaranteeing repeatability across subsequent runs. For more advanced, reusable scenarios that involve complex setup like creating a database record and then referencing it across multiple tests, we often combine these hooks with custom fixtures through `test.extend`. This allows us to inject pre-configured objects or states directly into our tests, abstracting away setup details even further.

[The Punchline]
Ultimately, a disciplined approach to `beforeEach` and `afterEach` isn't just about syntax; it's about engineering discipline. It underpins our ability to develop reliable, fast, and isolated tests, directly contributing to faster feedback cycles, reduced debugging time, and a significantly higher ROI on our automation efforts across the entire development lifecycle.