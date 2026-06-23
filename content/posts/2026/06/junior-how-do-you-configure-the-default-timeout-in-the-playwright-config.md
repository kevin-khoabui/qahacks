---
title: "(Junior) How do you configure the default timeout in the Playwright config?"
difficulty: "Intermediate"
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
Effectively managing timeouts is fundamental for stable and reliable UI automation tests, preventing flaky failures and optimizing execution speed. This topic delves into Playwright's core configuration for default timeouts, a critical aspect for maintaining robust test suites in any automation framework.

### Interview Question:
(Junior) How do you configure the default timeout in the Playwright config?

### Expert Answer:
Configuring the default timeout in Playwright is primarily done through the `timeout` property within the `playwright.config.ts` file. This global setting dictates the maximum time (in milliseconds) a test can run, encompassing all actions and assertions within that test, before Playwright terminates it as a failure.

Here's how you define it:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Global timeout for each test in milliseconds.
  timeout: 60 * 1000, // 60 seconds

  // Expect timeout for assertions, also in milliseconds.
  // This is separate from the test timeout.
  expect: {
    timeout: 5 * 1000, // 5 seconds for assertions
  },

  // Other configurations...
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

**Key Timeout Types and Hierarchy:**

1.  **`timeout` (Global Test Timeout):** Set at the root level of `defineConfig`. This is the overall limit for a single `test()` block. If a test exceeds this, it fails.
2.  **`expect.timeout` (Assertion Timeout):** Located within the `expect` object in `defineConfig`. This specifies the maximum time `expect` calls (e.g., `expect(locator).toBeVisible()`) will wait for a condition to be met before failing. This is crucial for handling dynamic UI elements.
3.  **Action Timeouts:** Many Playwright actions (e.g., `page.click()`, `page.waitForSelector()`) have their own default timeouts, typically 30 seconds. These can be overridden inline: `await page.click('button', { timeout: 10000 });`.
4.  **Navigation Timeouts:** Operations like `page.goto()` also have a default timeout (typically 30 seconds) which can be overridden: `await page.goto('https://example.com', { timeout: 45000 });`.

**Best Practices:**
*   **Start Moderate:** Begin with a reasonable global `timeout` (e.g., 60 seconds) and `expect.timeout` (e.g., 5 seconds) to catch genuine performance issues or deadlocks.
*   **Granular Overrides:** Leverage inline action-specific timeouts for specific cases where an element is known to take longer (e.g., a complex data load). This avoids unnecessarily inflating global timeouts for all tests.
*   **Distinguish `timeout` vs. `expect.timeout`:** Understand that `expect.timeout` only governs how long assertions wait, while the main `timeout` covers the entire test execution including setup, actions, and all assertions.
*   **Avoid Excessive Values:** Overly generous timeouts can mask underlying performance problems or prevent quick feedback on broken tests.

This stratified approach to timeout configuration allows for both global test stability and fine-grained control over specific interactions, leading to more reliable and efficient automation suites.

### Speaking Blueprint (3-Minute Verbal Response):
In modern enterprise-grade automation, managing test stability and execution efficiency is paramount, and Playwright's robust configuration for timeouts is a cornerstone of achieving that. Neglecting proper timeout strategies often leads to flaky tests, which erode confidence and slow down development cycles. Playwright addresses this by providing a highly configurable and hierarchical timeout mechanism right within its `playwright.config.ts` file, allowing us to strike a balance between test resilience and prompt feedback.

At the heart of Playwright's timeout management is the `playwright.config.ts` file. This is where we define the global `timeout` property, typically within the root `defineConfig` object. For instance, setting `timeout: 60 * 1000` establishes a 60-second limit for each individual test to complete its entire lifecycle, including all actions, navigations, and assertions. Critically, we also have the `expect.timeout` property, nested within an `expect` object, which specifically governs how long Playwright's `expect` assertions will wait for a condition to be met before failing. This distinction is vital: the global `timeout` is for the entire test, while `expect.timeout` focuses purely on the waiting period for an assertion. Beyond these global settings, Playwright also offers the flexibility to override timeouts at a more granular level directly within specific actions or navigations, like `page.click('button', { timeout: 10000 })`, giving us precise control when certain elements or operations are known to take longer than usual.

This granular control over timeouts, from global test limits and assertion-specific waits to action-level overrides, is critical for building resilient and efficient test suites. It ensures that our automation is robust enough to handle dynamic UI elements and network latencies without being overly permissive and masking genuine performance issues. By leveraging this sophisticated timeout management, we ensure optimal feedback loops in CI/CD, significantly reduce test flakiness, and ultimately drive a higher ROI for our test automation efforts by delivering stable, trustworthy, and rapid results.