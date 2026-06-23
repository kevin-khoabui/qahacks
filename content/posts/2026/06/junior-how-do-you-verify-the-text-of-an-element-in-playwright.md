---
title: "(Junior) How do you verify the text of an element in Playwright?"
difficulty: "Advanced"
target_role: ["Automation_QA_Engineer"]
category: ["Technical"]
sub_category: "Automation"
question_type: "Code-challenge"
core_testing_type: "Automation"
domain: "Enterprise-Software"
platform: "Cross-platform"
tool_stack: "Playwright"
tags: ["automation", "coding-challenge", "interview-prep", "tech-strategy", "playwright"]
---

## Overview
Verifying element text is a fundamental operation in UI automation, yet its robust implementation is critical for test reliability. Playwright offers advanced capabilities, including auto-waiting, to ensure these checks are resilient against dynamic UI states.

### Interview Question:
(Junior) How do you verify the text of an element in Playwright?

### Expert Answer:
Verifying the text of an element in Playwright involves leveraging its powerful assertions, which benefit from its built-in auto-waiting mechanism, significantly enhancing test reliability and reducing flakiness.

The primary and recommended approach is to use Playwright's `expect` assertions with element locators.

1.  **Using `toHaveText()` for Exact Match:**
    This assertion is ideal when you expect an element to contain a specific, exact text string. Playwright automatically waits for the element to appear in the DOM and have the specified text content before the assertion fails.

    ```typescript
    import { test, expect } from '@playwright/test';

    test('Verify product title', async ({ page }) => {
      await page.goto('https://example.com/product/123');
      const productTitleLocator = page.locator('.product-title');
      await expect(productTitleLocator).toHaveText('Awesome Product Name');
    });
    ```

    *   **Best Practice:** Always use locators (e.g., `page.locator()`, `page.getByText()`, `page.getByRole()`) rather than direct CSS/XPath strings in assertions for better readability and maintainability.

2.  **Using `toContainText()` for Partial Match:**
    When you only need to verify that an element's text includes a certain substring, `toContainText()` is the go-to method. It also benefits from Playwright's auto-waiting.

    ```typescript
    test('Verify welcome message contains user name', async ({ page }) => {
      await page.goto('https://example.com/dashboard');
      const welcomeMessageLocator = page.locator('#welcome-message');
      await expect(welcomeMessageLocator).toContainText('Welcome, John Doe');
    });
    ```

    *   `toContainText()` can also accept an array of strings to check if *all* substrings are present.

3.  **Retrieving Text Programmatically (Less Common for Direct Verification):**
    While `toHaveText()` and `toContainText()` are preferred for direct assertions, you might need to retrieve the element's text content for other purposes (e.g., logging, dynamic data comparison, or complex validation logic).

    *   `await locator.innerText()`: Returns the visible text content of the element, excluding any hidden elements. This is generally preferred for user-visible text.
    *   `await locator.textContent()`: Returns the text content of the element, including text from hidden elements within it.
    *   `await locator.allTextContents()`: Returns an array of `textContent` from all matching elements.

    ```typescript
    test('Retrieve and log element text', async ({ page }) => {
      await page.goto('https://example.com/status');
      const statusText = await page.locator('#current-status').innerText();
      console.log(`Current Status: ${statusText}`);
      expect(statusText).toBe('Active'); // Explicit assertion
    });
    ```

    *   **Caution:** When using `innerText()` or `textContent()` followed by a separate `expect` assertion, you lose Playwright's automatic retry mechanism that is built into `toHaveText()`/`toContainText()`. If the text isn't immediately available, the test might fail. For robust UI verification, always favor the direct `expect` assertions unless specific programmatic access is required.

**Framework Integration (Page Object Model):**
Within a robust automation framework, these verifications should be encapsulated within Page Objects.

```typescript
// pages/HomePage.ts
import { Page, expect, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator('#welcome-message');
  }

  async verifyWelcomeMessage(expectedText: string): Promise<void> {
    await expect(this.welcomeMessage).toHaveText(expectedText);
  }

  async getWelcomeMessageText(): Promise<string> {
    return await this.welcomeMessage.innerText();
  }
}
```

This approach promotes clean, maintainable, and highly readable tests by abstracting the locator and assertion logic.

### Speaking Blueprint (3-Minute Verbal Response):

In modern automation frameworks like Playwright, ensuring the reliability of our tests through robust element verification is paramount for maintaining engineering efficiency and trust in our CI/CD pipelines. For verifying an element's text, Playwright provides highly effective and resilient mechanisms.

My primary approach involves leveraging Playwright's built-in `expect` assertions, particularly `expect(locator).toHaveText()` or `expect(locator).toContainText()`. These methods are incredibly powerful because they inherently incorporate Playwright's auto-waiting capabilities. This means the test will automatically retry the assertion until the element appears in the DOM and its text matches the expected value, or a timeout occurs, significantly reducing flakiness compared to explicit waits or older, more brittle approaches. For instance, to verify a product title, I'd write `await expect(page.locator('.product-title')).toHaveText('Expected Product Name');`. For scenarios requiring a more programmatic text retrieval before validation, perhaps for dynamic data manipulation or logging, I'd use `await locator.innerText()` or `await locator.textContent()`. However, for direct verification, the `toHaveText` assertion is almost always preferred due to its built-in robustness and handling of asynchronous UI updates. Within our framework, we encapsulate these interactions using the Page Object Model, where each UI component or page has its dedicated methods for interacting with and asserting element properties. For instance, a method like `async verifyProductName(expectedName: string)` on a `ProductDetailsPage` object would internally use `await expect(this.productNameElement).toHaveText(expectedName);`. This abstraction keeps tests clean, readable, and highly maintainable, especially when selectors or verification logic evolve.

Ultimately, by favoring Playwright's native, auto-waiting assertions and structuring our tests with patterns like POM, we ensure our text verifications are not just passing, but are truly reliable, resilient to transient UI states, and contribute directly to a scalable and trustworthy test automation suite, delivering tangible ROI on our testing efforts.