---
title: "(Junior) How do you take screenshots when a test fails in Playwright?"
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
Ensuring comprehensive debugging information, especially visual artifacts like screenshots, is paramount for efficient test failure analysis in modern automation frameworks. Playwright provides built-in, highly configurable options for capturing screenshots upon test failure, significantly streamlining the defect identification process and enhancing reporting capabilities.

### Interview Question:
(Junior) How do you take screenshots when a test fails in Playwright?

### Expert Answer:
Playwright offers robust, built-in capabilities to automatically capture screenshots specifically when a test fails, which is a critical feature for effective debugging and reporting. The most straightforward and recommended approach involves configuring the `playwright.config.ts` file.

1.  **Configuration-Driven Approach (Recommended):**
    Playwright's `testOptions` object in `playwright.config.ts` allows you to define a global strategy for screenshot capture. The key property here is `screenshot`.

    ```typescript
    // playwright.config.ts
    import { defineConfig, devices } from '@playwright/test';

    export default defineConfig({
      testDir: './tests',
      timeout: 30 * 1000,
      fullyParallel: true,
      forbidOnly: !!process.env.CI,
      retries: process.env.CI ? 2 : 0,
      workers: process.env.CI ? 1 : undefined,
      reporter: 'html',

      use: {
        trace: 'on-first-retry',
        screenshot: 'only-on-failure', // CRITICAL: Captures screenshot only when a test fails
        video: 'retain-on-failure',    // Optional: Retain video on failure
        headless: true,                // Run tests in headless mode
      },

      projects: [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
        // ... other browser configurations
      ],
    });
    ```
    -   `screenshot: 'only-on-failure'` is the crucial setting. Playwright will automatically save a screenshot for any test that fails.
    -   The screenshots are typically saved in the `test-results` directory by default, alongside other artifacts like traces and videos.
    -   You can also specify `fullPage: true` within `screenshot` options if you need to capture the entire scrollable page content instead of just the viewport.

2.  **Programmatic Approach (for Custom Logic):**
    While the configuration-driven approach is generally sufficient, there might be scenarios requiring more granular control, such as taking multiple screenshots at different points on failure, or conditional logic based on the error type. This can be achieved using `test.afterEach` and inspecting the `testInfo` object.

    ```typescript
    // tests/example.spec.ts
    import { test, expect } from '@playwright/test';

    test.afterEach(async ({ page }, testInfo) => {
      if (testInfo.status === 'failed') {
        const screenshotPath = testInfo.outputPath(`failure-screenshot-${testInfo.title.replace(/\s/g, '-')}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        testInfo.attachments.push({ name: 'failure-screenshot', contentType: 'image/png', path: screenshotPath });
        console.log(`Screenshot saved to: ${screenshotPath}`);
      }
    });

    test('example test that fails', async ({ page }) => {
      await page.goto('https://playwright.dev/');
      await expect(page.locator('text=NonExistentElement')).toBeVisible(); // This will fail
    });
    ```
    -   `test.afterEach` is a hook that runs after each test, regardless of its outcome.
    -   `testInfo.status` allows checking if the test `failed`.
    -   `page.screenshot()` is used to explicitly take a screenshot, specifying a custom `path`.
    -   `testInfo.outputPath()` helps construct a path within the `test-results` directory.
    -   `testInfo.attachments.push()` is vital for associating the custom screenshot with the test in Playwright's HTML report and other reporters.

**Best Practices:**
*   **Consistency:** Stick to the `playwright.config.ts` approach unless specific, complex requirements dictate otherwise. It's cleaner and leverages Playwright's native reporting.
*   **Reporting Integration:** Playwright's HTML reporter automatically displays screenshots captured via `screenshot: 'only-on-failure'`. For custom screenshots, `testInfo.attachments.push()` ensures they are linked.
*   **CI/CD Artifacts:** Ensure that your CI/CD pipeline is configured to archive the `test-results` directory (or wherever artifacts are saved) so that screenshots are accessible even after the build completes.
*   **File Naming:** When using the programmatic approach, include relevant test metadata (e.g., test title, timestamp) in the filename for easier identification.

By leveraging these capabilities, teams can significantly reduce the time spent on root cause analysis, leading to faster bug fixes and a more robust testing pipeline.

### Speaking Blueprint (3-Minute Verbal Response):

In modern CI/CD pipelines, immediate visibility into test failures is paramount for rapid defect resolution and maintaining high engineering velocity. This is precisely where Playwright's capabilities for capturing screenshots on failure become indispensable.

At a foundational level, Playwright offers a remarkably elegant, configuration-driven approach embedded directly within its `playwright.config.ts` file. By simply setting the `screenshot` option to `'only-on-failure'` within our `use` block, Playwright intelligently monitors test execution. Should any assertion fail, or an unexpected error occur, it will automatically capture a full-page screenshot of the browser state at that precise moment. This artifact is then meticulously stored within our `test-results` directory, neatly organized by test run. This declarative method is highly efficient as it requires no manual `try-catch` blocks or explicit `page.screenshot()` calls within each test, ensuring consistency across our entire test suite without adding boilerplate. For scenarios demanding finer-grained control—perhaps capturing multiple screenshots at different stages of a complex failure, or conditionally based on error types—we can leverage a `test.afterEach` hook. Within this hook, we inspect the `testInfo.status` property. If it's `'failed'`, we then programmatically invoke `page.screenshot()` and, critically, push this custom artifact into `testInfo.attachments` to ensure it's seamlessly integrated into Playwright's comprehensive HTML report.

This systematic approach to failure diagnosis significantly boosts our team's productivity and ensures the robustness of our release pipeline. By providing clear visual evidence of the failed state, we drastically reduce the Mean Time To Identify (MTTI) defects, allowing our developers and QA engineers to pinpoint issues faster, leading to quicker resolutions and, ultimately, a higher ROI on our automation efforts.