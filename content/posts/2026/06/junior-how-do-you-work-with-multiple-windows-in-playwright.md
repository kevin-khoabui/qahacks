---
title: "(Junior) How do you work with multiple windows in Playwright?"
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
Handling multiple browser windows or tabs is a common scenario in modern web applications, often involving interactions like opening new pop-ups or navigating to external links. Playwright provides robust mechanisms to manage these new `Page` objects, ensuring test scripts can seamlessly switch context and interact with all active windows within a `BrowserContext`.

### Interview Question:
(Junior) How do you work with multiple windows in Playwright?

### Expert Answer:
Working with multiple windows, which Playwright refers to as `Page` objects within a `BrowserContext`, is a fundamental aspect of testing dynamic web applications. Playwright provides an elegant and explicit API for this.

**Core Concept: Event-Driven Page Handling**
The most robust way to interact with newly opened windows (tabs or pop-ups) is by listening for the `page` event on the `BrowserContext`. This event fires when a new `Page` is created.

**Implementation Details:**
1.  **Triggering the New Window:** First, perform the action that causes the new window to open (e.g., clicking a link with `target="_blank"`, `window.open()` via JavaScript).
2.  **Waiting for the New Page:** Concurrently with the action, use `context.waitForEvent('page')`. This promise resolves with the newly opened `Page` object. To prevent race conditions, it's crucial to wrap both the trigger and the wait in `Promise.all`.

```typescript
import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';

test('interact with a new tab', async ({ page, context }) => {
    await page.goto('https://example.com/new-window-trigger');

    // Setup a promise to wait for the new page BEFORE triggering the action
    const [newPage] = await Promise.all([
        context.waitForEvent('page'), // This promise resolves when a new page opens
        page.locator('#openNewWindowButton').click() // This action triggers the new page
    ]);

    // Now 'newPage' holds the reference to the newly opened tab/window
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('new-window-url');
    await newPage.locator('#someElementOnNewPage').fill('data');
    await newPage.close(); // Close the new page when done

    // You can still interact with the original 'page' object
    await page.locator('#elementOnOriginalPage').isVisible();
});
```

**Accessing All Pages:**
A `BrowserContext` maintains a list of all active `Page` objects. You can retrieve them using `context.pages()`. This is useful if multiple windows are opened simultaneously, or if you need to iterate through existing pages.

```typescript
const allPages: Page[] = context.pages();
// Example: Switch to the second page if it exists
if (allPages.length > 1) {
    const secondPage = allPages[1];
    await secondPage.bringToFront();
    // Interact with secondPage
}
```

**Best Practices:**
*   **Explicit Waiting:** Always use `context.waitForEvent('page')` paired with the action that triggers the new window using `Promise.all`. This ensures proper synchronization and avoids flakiness.
*   **Context Isolation:** Playwright's `BrowserContext` isolates cookies, local storage, and sessions. Each `Page` within a `BrowserContext` shares this state. If a completely isolated test flow is needed, consider creating a new `BrowserContext`.
*   **Page Object Model (POM):** Encapsulate interactions with each window/tab within its own Page Object. For instance, `NewWindowPage.ts` would handle elements and actions specific to the new window. This improves maintainability and readability.
*   **Closing Pages:** Explicitly close pages (`await newPage.close()`) when they are no longer needed to free up resources, especially in long-running tests or when dealing with many dynamic windows.

By leveraging `context.waitForEvent('page')` and `Promise.all`, Playwright offers a reliable and intuitive API for managing complex multi-window scenarios in automation.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
Modern web applications frequently involve dynamic interactions like opening new tabs or pop-up windows, and robust automation frameworks like Playwright are essential for validating these complex user flows. My approach to handling multiple windows in Playwright is centered on reliability and explicit control, ensuring our tests accurately reflect real-world user behavior and remain resilient to timing-related flakiness.

[The Core Execution]
At a high level, Playwright treats each new window or tab as a distinct `Page` object, all of which operate within a shared `BrowserContext`. The most effective and reliable way to manage new windows is by leveraging Playwright's event-driven architecture. When an action, such as clicking a "Learn More" button that opens in a new tab, is performed, the `BrowserContext` emits a `page` event. To handle this, I set up a listener for `context.waitForEvent('page')` *before* initiating the action that triggers the new window. I then wrap both the action and the `waitForEvent` call within a `Promise.all` construct. This critical synchronization pattern ensures that the system is actively listening for the new page *at the exact moment* it's being created, preventing any race conditions. Once the `Promise.all` resolves, I gain a direct reference to the new `Page` object. From there, I can interact with it just like any other page—navigating, locating elements, asserting content, or performing actions—completely independently of the original page. Afterwards, it’s good practice to explicitly close the new page with `await newPage.close()` to free up resources and maintain a clean test state. For framework design, I typically encapsulate these multi-window interactions within dedicated Page Object Models, separating concerns and making our test suites highly maintainable.

[The Punchline]
This explicit, event-driven approach to multi-window handling in Playwright is a cornerstone of building highly stable and maintainable test automation. It eliminates the guesswork and flakiness often associated with implicit waits or sleep commands, ultimately leading to faster feedback cycles, more reliable CI/CD pipelines, and a higher return on our automation engineering investment.