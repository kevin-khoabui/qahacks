---
title: "(Junior) How do you check the current URL in Playwright?"
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
Effectively checking the current URL is foundational for validating navigation and state changes in web automation. This topic explores Playwright's robust mechanisms for URL retrieval and assertion, emphasizing best practices for building resilient and maintainable test frameworks.

### Interview Question:
(Junior) How do you check the current URL in Playwright?

### Expert Answer:
In Playwright, verifying the current URL is a core operation, critical for validating navigation flows and page transitions. There are two primary approaches, with the assertion-specific method being highly recommended for robustness within automation frameworks.

1.  **Retrieving the URL as a String:**
    The most direct way to get the current URL is by using the `page.url()` method. This returns the complete URL as a string. While useful for logging or complex string manipulations, it lacks Playwright's built-in auto-waiting for assertions.

    ```javascript
    const currentUrl = page.url();
    console.log(`Current browser URL: ${currentUrl}`);
    // Example: For conditional logic or further processing
    if (currentUrl.includes('/login')) {
      // ... handle login page ...
    }
    ```

2.  **Asserting the URL (Recommended Approach):**
    For test assertions, Playwright's `expect` library provides the `toHaveURL()` matcher. This is the preferred method because it incorporates Playwright's auto-waiting and retry mechanisms, making tests significantly more stable and less prone to flakiness caused by network latency or slow page renders. It automatically waits for the URL to become the expected value before failing the test.

    ```javascript
    // Exact URL match
    await expect(page).toHaveURL('https://www.example.com/dashboard');

    // Partial URL match (using a substring)
    // Note: Better to use regex for partial matches for clarity and power.
    await expect(page).toHaveURL(/dashboard/); // URL contains 'dashboard'

    // Relative path match (checks against the base URL configured in Playwright)
    await expect(page).toHaveURL('/settings');

    // Matching with RegExp for dynamic parts (e.g., query parameters, IDs)
    await expect(page).toHaveURL(/https:\/\/www\.example\.com\/products\/\d+/);
    ```
    The `toHaveURL()` matcher is superior because it handles the asynchronous nature of web navigation gracefully. It will pause and re-check the URL until it matches the expectation or a timeout occurs, preventing common test failures that arise from asserting against an old URL before a navigation has fully committed.

3.  **Framework Integration (Page Object Model):**
    For maintainable and scalable automation, URL verification logic should be encapsulated within Page Object Model (POM) classes. This abstracts the Playwright-specific implementation details from the test scripts, making tests cleaner and easier to update.

    ```javascript
    // Example in a BasePage class
    class BasePage {
      constructor(page) {
        this.page = page;
      }

      async verifyCurrentUrl(expectedUrl) {
        await expect(this.page).toHaveURL(expectedUrl, { timeout: 10000 });
      }
    }

    // Example in a LoginPage class extending BasePage
    class LoginPage extends BasePage {
      constructor(page) {
        super(page);
        this.path = '/login';
      }

      async navigate() {
        await this.page.goto(this.path);
      }

      async isOnLoginPage() {
        // Constructing expected URL dynamically for environment independence
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        await this.verifyCurrentUrl(`${baseUrl}${this.path}`);
      }
    }

    // Test usage
    // const loginPage = new LoginPage(page);
    // await loginPage.navigate();
    // await loginPage.isOnLoginPage(); // Verifies URL
    ```
    Integrating `toHaveURL()` within POM methods, potentially accepting regular expressions for dynamic URL segments and composing URLs from environment-specific variables, ensures that tests are robust, reusable, and adaptable across different testing environments (e.g., development, staging, production). This robust pattern significantly contributes to the overall stability and long-term viability of the automation suite.

### Speaking Blueprint (3-Minute Verbal Response):
**[The Hook]**
"When designing scalable and resilient automation frameworks, particularly in modern CI/CD pipelines, robust URL validation is absolutely critical. Flaky tests often stem from premature assertions or incomplete navigation, directly impacting engineering efficiency and trust in the test suite. Playwright provides excellent primitives to address this, and integrating them correctly is key to a high ROI on our automation efforts."

**[The Core Execution]**
"At its core, Playwright offers `page.url()` to retrieve the current URL as a string. However, for assertions, the superior method is `await expect(page).toHaveURL()`. This `toHaveURL` matcher is a game-changer because, unlike a direct string comparison, it inherently leverages Playwright's auto-waiting capabilities. This means it will automatically wait for the URL to settle or navigate to the expected state before asserting, drastically reducing flakiness that arises from network latency or slow page loads.

To integrate this effectively into a framework, we encapsulate this logic within our Page Object Model. A `BasePage` class, for instance, would expose a `verifyCurrentUrl(expectedUrl: string | RegExp)` method. Concrete page objects, like a `DashboardPage`, would then call this method, passing either an exact string, a relative path, or crucially, a regular expression. This regex capability is vital for handling dynamic URL segments or ensuring tests are environment-agnostic, allowing for `https://dev.example.com/dashboard` or `https://prod.example.com/dashboard` to be validated with the same logic. We often combine this with environment variables for base URLs, creating flexible and maintainable URL assertions across different deployment stages."

**[The Punchline]**
"Ultimately, by meticulously implementing `toHaveURL()` within a well-structured Page Object Model and intelligently using regular expressions for dynamic content, we're not just 'checking a URL.' We're building a highly stable, maintainable, and scalable test suite that actively resists common sources of test flakiness. This strategic approach ensures our automation investments yield maximum reliability, directly contributing to faster release cycles and a higher confidence in our product quality, which is the ultimate engineering ROI."