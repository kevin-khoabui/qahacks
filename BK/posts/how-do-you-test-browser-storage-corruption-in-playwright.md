---
title: "How do you test browser storage corruption in Playwright?"
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
Testing browser storage corruption in Playwright involves simulating malformed or unexpected data within `localStorage`, `sessionStorage`, and `IndexedDB` to validate an application's resilience. It challenges an automation engineer to leverage Playwright's browser context manipulation and `page.evaluate()` capabilities to robustly assess graceful degradation.

### Interview Question:
How do you test browser storage corruption in Playwright?

### Expert Answer:
Testing browser storage "corruption" in Playwright primarily focuses on validating the application's graceful handling of malformed, unexpected, or excessively large data stored client-side, rather than physical disk corruption. The strategy involves manipulating storage states and observing application behavior.

Here’s a structured approach using Playwright:

1.  **Understanding "Corruption"**: This refers to:
    *   **Malformed JSON**: Storing invalid JSON strings where an object is expected.
    *   **Incorrect Data Types**: Storing a string where a number/boolean is expected.
    *   **Missing or Unexpected Keys**: Data structures lacking critical properties or containing irrelevant ones.
    *   **Storage Limit Exceeded**: Pushing `localStorage` or `sessionStorage` beyond its capacity.

2.  **Playwright Capabilities for Manipulation**:

    *   **`browser.newContext({ storageState })`**: Ideal for pre-seeding `localStorage` and `sessionStorage` before a test run. We can construct a JSON file with intentionally corrupted data.
        ```javascript
        // corrupt-storage-state.json
        {
          "origins": [
            {
              "origin": "https://example.com",
              "localStorage": [
                { "name": "userSettings", "value": "{invalid: json}" },
                { "name": "preferences", "value": "corrupt_string" }
              ],
              "sessionStorage": []
            }
          ]
        }
        ```
        ```javascript
        import { test, expect } from '@playwright/test';

        test('app handles malformed localStorage', async ({ browser }) => {
          const context = await browser.newContext({ storageState: 'corrupt-storage-state.json' });
          const page = await context.newPage();
          await page.goto('https://example.com');

          // Assert app's graceful degradation or error message
          await expect(page.locator('.error-message')).toHaveText('Failed to load user settings');
          await expect(page.locator('.default-state-indicator')).toBeVisible();

          await context.close();
        });
        ```
    *   **`page.evaluate()`**: Essential for dynamic injection during a test and for interacting with `IndexedDB`.
        *   **Injecting Malformed Data**:
            ```javascript
            await page.evaluate(() => {
              localStorage.setItem('userProfile', 'this is not valid json!');
              sessionStorage.setItem('tempData', '{"id": "abc", "status": undefined}'); // `undefined` serializes as "undefined"
            });
            await page.reload(); // App might re-evaluate storage on load
            ```
        *   **Exceeding Storage Limits**: Create a very large string.
            ```javascript
            const hugeString = 'a'.repeat(5 * 1024 * 1024); // 5MB
            await page.evaluate((data) => {
              try {
                localStorage.setItem('largePayload', data);
              } catch (e) {
                console.error('localStorage write failed:', e);
              }
            }, hugeString);
            // Assert app behavior when storage write fails or is truncated
            ```
        *   **IndexedDB Corruption**: IndexedDB is asynchronous and requires more complex `evaluate` calls. We can use it to insert non-spec compliant data or exceed transaction limits.
            ```javascript
            await page.evaluate(async () => {
              const request = indexedDB.open('myDB', 1);
              request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore('items', { keyPath: 'id' });
              };
              await new Promise(resolve => request.onsuccess = resolve);
              const db = request.result;
              const transaction = db.transaction(['items'], 'readwrite');
              const store = transaction.objectStore('items');
              // Intentionally store malformed data (e.g., non-serializable object if not handled by framework)
              store.add({ id: 1, data: new WeakMap() }); // WeakMap is not cloneable
              await new Promise((resolve, reject) => {
                transaction.oncomplete = resolve;
                transaction.onerror = reject;
              });
              db.close();
            });
            await page.reload();
            // Assert application handling of corrupted IndexedDB data upon retrieval
            ```

3.  **Assertion Strategy**:
    *   **UI Validation**: Check for specific error messages, fallback UI components, or absence of expected data.
    *   **Console Logs**: Listen for JavaScript errors (`page.on('console', msg => { ... })`) or network failures.
    *   **Network Activity**: Verify if corrupted data is being sent to backend APIs, which could cause server-side issues.
    *   **Application State**: Validate the internal state of the application after attempting to read the corrupted data.

4.  **Framework Integration**:
    *   **Custom Fixtures**: Create Playwright fixtures to streamline the setup of specific corrupted storage states, ensuring reusability.
    *   **Page Object Model (POM) Helpers**: Incorporate storage manipulation methods into your POM classes or dedicated utility files for easier access and cleaner tests.

This comprehensive approach allows for robust testing of an application's resilience against various forms of browser storage data corruption.

### Speaking Blueprint (3-Minute Verbal Response):

In modern web applications, the integrity of client-side browser storage is paramount for user experience and data consistency, especially with frameworks like Playwright enabling robust end-to-end testing. Effectively testing for browser storage corruption is a critical aspect of ensuring application resilience, as unexpected data can lead to crashes or incorrect behavior.

When we approach testing for browser storage corruption with Playwright, we're primarily focused on validating how our application gracefully handles malformed or unexpected data within `localStorage`, `sessionStorage`, or `IndexedDB`. Our strategy typically involves two key, complementary approaches. First, we leverage Playwright's `browser.newContext({ storageState: 'path/to/corrupt-state.json' })` capability. This is incredibly powerful as it allows us to pre-seed the browser context with intentionally malformed JSON structures, invalid data types, or even excessively large data sets that simulate corruption, right before the test begins. We then launch our application and assert that it either recovers gracefully, displays appropriate error messages to the user, or intelligently falls back to a default state, rather than crashing or displaying incorrect information. The second, more dynamic approach involves using `page.evaluate()` during test execution. For instance, after navigating to a page, we might execute a script like `await page.evaluate(() => localStorage.setItem('userConfig', '{invalid_json}'));` or inject an oversized string to push storage limits, simulating a failed write or data truncation. We then meticulously monitor console logs for JavaScript errors, observe UI component behavior for visual regressions, and verify that our application's API calls are not inadvertently sending corrupted data to our backend services. For more complex scenarios involving `IndexedDB`, `page.evaluate()` is still our go-to, allowing us to interact directly with the database API within the browser context to insert and retrieve deliberately flawed data, ultimately asserting the application's response to such anomalies. We encapsulate these storage manipulation utilities within a dedicated Playwright fixture or a Page Object helper to ensure reusability and maintainability across our test suite.

Ultimately, our goal isn't just to *find* instances of corruption, but to build an automation safety net that ensures our application is inherently resilient to client-side data anomalies. This proactive testing contributes significantly to a stable user experience, minimizes user-reported issues, and reduces the operational overhead associated with data-related bugs in production environments, thereby delivering a strong engineering ROI.