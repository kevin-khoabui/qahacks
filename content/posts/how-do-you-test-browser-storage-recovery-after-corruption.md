---
title: "How do you test browser storage recovery after corruption?"
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
This challenge explores testing the resilience of web applications when client-side browser storage (like localStorage, sessionStorage, or IndexedDB) becomes corrupted. It demands advanced automation techniques for injecting malformed data and meticulously verifying recovery mechanisms.

### Interview Question:
How do you test browser storage recovery after corruption?

### Expert Answer:
To test browser storage recovery after corruption, we employ a sophisticated, isolated approach using Playwright's browser context manipulation capabilities. The core strategy involves three phases: targeted corruption injection, application state observation, and post-recovery validation.

**1. Targeted Corruption Injection:**
We leverage Playwright's `page.evaluate()` method to execute arbitrary JavaScript within the browser context, directly manipulating storage.
- **`localStorage` / `sessionStorage`:**
  ```javascript
  // Example: Corrupting a JSON item in localStorage
  await page.evaluate(key => {
    localStorage.setItem(key, '{ "partial_key": "incomplete_value" ');
  }, 'user_preferences');
  ```
  This injects an invalid JSON string, forcing parsing errors. We can also simulate injecting non-string types if the application's serialization logic is suspect.
- **`IndexedDB`:** This requires `page.evaluate()` to interact with the `indexedDB` API (e.g., `indexedDB.open().then(db => ...)`) to insert malformed objects into specific stores. Examples include records with missing required fields, incorrect data types for a schema, or excessive data.

Different corruption patterns are simulated:
- **Invalid JSON:** Incomplete or malformed JSON strings that cause `JSON.parse` errors.
- **Missing Required Fields:** For structured data, removing essential properties expected by the application.
- **Type Mismatches:** Storing values of incorrect types (e.g., number instead of string, null instead of object).
- **Over-sized Data:** Stress-testing storage limits or causing performance degradation.

**2. Application State Observation:**
After injecting corrupted data and navigating to the application, we monitor its behavior:
- **UI State Assertions:** Verify the application gracefully falls back to default states, displays appropriate error messages, or prompts for re-authentication. For example, `expect(page.locator('#error-message')).toBeVisible();` or `expect(page.url()).toContain('/login');`.
- **Network Traffic Monitoring:** Using `page.route()` and `page.waitForRequest()`, we check if the application attempts to re-fetch data from the backend to reconstruct its state after encountering corruption. This confirms resilience and proper data re-initialization.
- **Console Output Logging:** We attach a `page.on('console', msg => ...)` listener to capture any client-side JavaScript errors or warnings related to storage access, indicating points of failure or successful recovery attempts.

**3. Post-Recovery Validation:**
Finally, we inspect the browser's storage after the application's recovery attempt:
- **Storage Content Validation:** Use `page.evaluate(() => localStorage.getItem('key'))` to confirm corrupted entries have been cleared, overwritten with valid defaults, or recreated correctly.
- **Data Integrity:** If data was re-fetched, verify the new data retrieved from the backend is correctly stored and reflects the expected application state.

**Framework Architecture:**
We encapsulate this logic within a dedicated `BrowserStorageUtil` or `StorageFaker` class, providing methods like `corruptLocalStorage(key, data)`, `corruptIndexedDB(storeName, record)`, and `verifyStorageState(key, expectedState)`. This ensures reusability, maintainability, and clear separation of concerns within our E2E framework. Test isolation is critical; each test utilizes a new browser context (`browser.newContext()`) to guarantee a pristine state before corruption injection, preventing test interdependencies.

### Speaking Blueprint (3-Minute Verbal Response):
In today's highly dynamic web applications, robust client-side storage management is paramount for delivering seamless user experiences and ensuring data integrity. Our modern automation frameworks, particularly with tools like Playwright, allow us to go beyond typical functional tests and delve into critical resilience testing scenarios, such as browser storage recovery after corruption.

My approach to tackling browser storage corruption testing is multifaceted and deeply integrated into our Playwright-based E2E suite. First, we establish a dedicated `StorageFaker` utility. This utility leverages Playwright's powerful `page.evaluate()` method to directly inject corrupted data into `localStorage`, `sessionStorage`, or even IndexedDB. For instance, to simulate `localStorage` corruption, we might call `await page.evaluate(key => { localStorage.setItem(key, '{"invalid_json":'); }, 'user_session_data');`. We'd then navigate to the relevant page. The key here is not just injecting, but also controlling the state. We ensure test isolation by using `browser.newContext()` for each test, starting with a clean slate. After corruption injection, we observe the application's recovery mechanism. This involves asserting against expected UI fallback states – perhaps a default dashboard, or a re-login prompt. Concurrently, we use Playwright's network interception (`page.route()`) to monitor for subsequent API calls, verifying if the application attempts to re-fetch valid data from the backend. We also integrate console logging listeners (`page.on('console', msg => ...)`) to catch any client-side errors or warnings triggered by the corrupted storage access. Finally, we inspect the browser storage post-recovery using `page.evaluate()` again to confirm that the corrupted entries have been appropriately cleared or reset to a valid default.

This structured approach transforms what could be a complex manual validation into an efficient, repeatable, and highly valuable automated test. It not only bolsters our application's resilience against unexpected client-side data issues but significantly reduces the potential for critical production defects, ultimately contributing to a much higher engineering ROI by preventing costly outages and improving user trust in our platform.