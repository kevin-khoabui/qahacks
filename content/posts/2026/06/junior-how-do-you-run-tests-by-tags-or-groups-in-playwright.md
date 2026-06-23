---
title: "(Junior) How do you run tests by tags or groups in Playwright?"
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
This question probes a candidate's understanding of test organization and selective execution within Playwright, a critical capability for optimizing CI/CD pipelines and managing large test suites. Efficiently running tests by tags allows teams to target specific test categories like smoke, regression, or critical path tests, directly impacting feedback speed and resource utilization.

### Interview Question:
(Junior) How do you run tests by tags or groups in Playwright?

### Expert Answer:
In Playwright, running tests by tags or groups is a fundamental capability achieved primarily through its native tagging system and command-line interface (CLI) options. This allows for highly selective test execution, crucial for efficient CI/CD and targeted debugging.

First, you define tags directly within your test files using the `test.describe` or `test` functions. Tags are specified as an array of strings in the `tag` option:

```typescript
// Example: Tagging a test suite
test.describe('Authentication Tests', { tag: ['@smoke', '@login'] }, () => {
  test('should allow user to login', async ({ page }) => {
    // Test steps for login
  });

  // Example: Tagging an individual test
  test('should handle invalid credentials', { tag: '@regression' }, async ({ page }) => {
    // Test steps for invalid login
  });
});
```

To execute tests based on these tags, Playwright leverages its CLI with the `--grep` or `--grep-invert` options. These options filter tests based on their title and tags.

1.  **Running tests with specific tags:**
    The `--grep` option is used to include tests matching a regular expression. When tags are defined, Playwright internally concatenates the test title and its tags, making them discoverable by `grep`.
    To run all tests tagged with `@smoke` and `@login`:
    ```bash
    npx playwright test --grep "@smoke|@login"
    ```
    Note that this uses a regex OR operator (`|`) to match either tag. To match tests that have *both* tags, you'd typically need more sophisticated filtering or ensure unique tag combinations (e.g., `@smoke-login`).

2.  **Excluding tests with specific tags:**
    The `--grep-invert` option excludes tests matching the specified regular expression.
    To run all tests *except* those tagged with `@wip` (work in progress):
    ```bash
    npx playwright test --grep-invert "@wip"
    ```

3.  **Combining inclusion and exclusion:**
    You can combine both options for precise control. For example, run `@regression` tests but exclude those marked as `@flaky`:
    ```bash
    npx playwright test --grep "@regression" --grep-invert "@flaky"
    ```

4.  **Configuring tags in `playwright.config.ts`:**
    For CI/CD environments or common test groups, you can define `grep` and `grepInvert` directly within your `playwright.config.ts` for different projects or globally.
    ```typescript
    import { defineConfig, devices } from '@playwright/test';

    export default defineConfig({
      projects: [
        {
          name: 'smoke',
          testMatch: /.*\.spec\.ts/,
          grep: /@smoke/, // Only run tests tagged with @smoke
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'regression',
          testMatch: /.*\.spec\.ts/,
          grep: /@regression/,
          grepInvert: /@wip/, // Run regression, but exclude @wip
          use: { ...devices['Desktop Chrome'] },
        },
      ],
    });
    ```
    To run a specific project from the config:
    ```bash
    npx playwright test --project=smoke
    ```

This systematic approach ensures tests can be executed with maximum flexibility and efficiency, crucial for maintaining fast feedback loops in agile development.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
In modern CI/CD pipelines, efficiently executing targeted test suites is paramount for rapid feedback and optimizing resource consumption. As our test suites grow, the ability to selectively run specific groups of tests—be it smoke, regression, or critical path—becomes a non-negotiable feature for any robust automation framework. Playwright addresses this beautifully with its native tagging system.

[The Core Execution]
At its core, Playwright allows us to define tags directly within our test files, either at the `test.describe` block level for entire suites or for individual `test` cases. You simply pass an array of strings to the `tag` option, like `test.describe('...', { tag: ['@smoke', '@login'] }, ...)` or `test('...', { tag: '@regression' }, ...`. Once tagged, we leverage Playwright's command-line interface for execution. The `--grep` option is our primary tool for inclusion; for instance, `npx playwright test --grep "@smoke"` would execute all tests marked with the `@smoke` tag. Similarly, the `--grep-invert` option allows us to exclude tests based on a tag, such as `npx playwright test --grep-invert "@wip"` to skip work-in-progress tests. We can even combine these for precise filtering, like running all `@regression` tests but explicitly excluding those flagged as `@flaky`. For enterprise-level deployments and CI/CD, this granular control is often formalized within the `playwright.config.ts` file, where we can define distinct "projects." Each project can have its own `grep` or `grepInvert` rules, enabling us to simply run `npx playwright test --project=smoke` to trigger a predefined subset of tests.

[The Punchline]
This systematic and flexible tagging mechanism is critical. It not only streamlines our CI/CD pipelines by minimizing unnecessary test runs, thereby accelerating feedback loops, but also significantly enhances test suite maintainability and debugging efficiency. Ultimately, this granular control over test execution directly translates into higher engineering velocity and a stronger return on investment for our automation efforts.