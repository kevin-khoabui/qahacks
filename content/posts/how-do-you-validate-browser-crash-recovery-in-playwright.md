---
title: "How do you validate browser crash recovery in Playwright?"
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
Validating browser crash recovery in Playwright involves simulating various failure modes and asserting that the application can gracefully restore its state and functionality. This is crucial for ensuring application resilience and a robust user experience, especially in single-page applications or complex workflows.

### Interview Question:
How do you validate browser crash recovery in Playwright?

### Expert Answer:
Validating browser crash recovery in Playwright involves simulating scenarios where a browser context or the entire browser process unexpectedly terminates, then verifying the application's ability to restore its previous state or guide the user to a safe recovery point.

The core strategy revolves around two Playwright mechanisms:
1.  **Simulating a Context-Level Crash:** This mimics a tab crash or an isolated issue within a browser context.
2.  **Simulating a Full Browser Process Crash:** This represents a more severe crash requiring a complete browser relaunch.

**Implementation Details:**

**1. Context-Level Crash Simulation & Validation:**
This is achieved by closing the current `BrowserContext` and then creating a new one, potentially reusing `storageState` to simulate session persistence.

```typescript
import { test, expect, Browser, BrowserContext } from '@playwright/test';

test('should recover state after context crash', async ({ browser }) => {
  let context: BrowserContext | null = null;
  
  // Scenario 1: User logs in and performs actions
  context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://your-app.com/login');
  await page.type('#username', 'testuser');
  await page.type('#password', 'password');
  await page.click('#login-button');
  await expect(page.locator('#dashboard-header')).toBeVisible();

  // Save critical state (e.g., local storage, cookies)
  const storageState = await context.storageState();
  await context.close(); // Simulate "crash" by closing the context

  // Scenario 2: New context launched, state should be restored
  context = await browser.newContext({ storageState }); // Re-create with saved state
  const recoveredPage = await context.newPage();
  await recoveredPage.goto('https://your-app.com'); // Navigate to potentially recover
  
  // Validation: Check if the application recovered correctly
  // This might involve auto-login, redirect to a recovery page, or data restoration
  await expect(recoveredPage.locator('#dashboard-header')).toBeVisible(); 
  // Further assertions on specific data if relevant
});
```

**2. Full Browser Process Crash Simulation & Validation:**
This involves forcefully closing the entire `Browser` instance and then launching a new one. This is more disruptive and requires careful management of persistent data.

```typescript
import { test, expect, chromium } from '@playwright/test';

test('should recover state after full browser crash', async ({}) => {
  let browserInstance: Browser | null = null;
  
  // Scenario 1: Initial browser instance
  browserInstance = await chromium.launch();
  let context = await browserInstance.newContext();
  let page = await context.newPage();
  
  await page.goto('https://your-app.com/some-data-entry');
  await page.type('#input-field', 'important data');
  // Assume application saves "important data" to localStorage or IndexedDB
  await page.waitForTimeout(1000); // Give app time to persist
  
  await browserInstance.close(); // Simulate full browser crash

  // Scenario 2: New browser instance launched
  browserInstance = await chromium.launch();
  context = await browserInstance.newContext();
  page = await context.newPage();
  await page.goto('https://your-app.com'); 
  
  // Validation: Check if the application recovered
  // This might involve asserting data from local storage, 
  // verifying redirection, or seeing a "restore session" prompt.
  const storedData = await page.evaluate(() => localStorage.getItem('recoveryKey'));
  expect(storedData).toBe('important data');
  
  await browserInstance.close();
});
```

**Key Considerations for Framework Architecture:**

*   **Test Isolation:** Each crash recovery test should be self-contained and not rely on previous test runs.
*   **Fixture-based Setup:** Leverage Playwright's `test.use` or custom fixtures to encapsulate the browser launch/close logic, ensuring a clean state for each test.
*   **Data Seeding:** Ensure the application state *before* the crash simulation is predictable using API calls or database seeding.
*   **Application-Level Recovery Logic:** The effectiveness of these tests heavily depends on the web application's built-in crash recovery mechanisms (e.g., auto-saving, session restoration prompts, local/session storage usage).
*   **Reporting:** Capture Playwright traces and console logs, especially if the application logs recovery attempts or failures.

By methodically simulating these crash scenarios and meticulously validating the application's recovery behavior, we can ensure a resilient user experience under unexpected conditions.

### Speaking Blueprint (3-Minute Verbal Response):

**[The Hook]**
In today's complex, distributed web environments, the resilience of our applications is paramount, directly impacting user trust and business continuity. Ensuring that a user can recover gracefully from an unexpected browser crash, even mid-workflow, is a critical aspect of engineering quality, and it's something we rigorously validate within our automation frameworks.

**[The Core Execution]**
To tackle this in Playwright, our approach centers on simulating two primary crash scenarios and then programmatically asserting recovery.

First, we address **context-level crashes**, which are akin to a single tab or isolated session unexpectedly closing. We achieve this by launching a `browser.newContext()` and executing a workflow – say, a user logging in and performing data entry. Crucially, before we simulate the "crash," we capture any essential session state, like `localStorage` or `cookies`, using `await context.storageState()`. Then, we programmatically close that context using `await context.close()`. The recovery validation then involves launching a *new* context, passing in the previously saved `storageState` to simulate the browser restoring the session. We navigate back to the application and assert that the user is either logged in, or the application presents a recovery prompt with the expected data intact.

Second, for a more severe failure, we simulate a **full browser process crash**. This requires a more explicit lifecycle management. We launch an entire `chromium.launch()` instance, perform a workflow, and then forcefully close the *entire browser instance* using `await browser.close()`. To validate recovery, we then launch a completely *new* `chromium.launch()` instance, create a fresh context, and navigate to our application. Here, the validation typically involves checking for persistent data – perhaps the application auto-saved drafts to `IndexedDB` or `localStorage`. We'd use `page.evaluate()` to access and assert the presence and correctness of this recovered data, ensuring the user's progress wasn't lost entirely. Our framework abstracts these steps into dedicated helper functions and leverages Playwright's fixture model to ensure isolated, reproducible crash scenarios for each test.

**[The Punchline]**
This comprehensive strategy, deeply integrated into our CI/CD pipelines, provides us with high confidence in the application's stability under duress. It translates directly into a superior user experience, minimizes data loss, and ultimately reduces the operational overhead of dealing with critical incidents, delivering a tangible ROI on our engineering investment in resilience.