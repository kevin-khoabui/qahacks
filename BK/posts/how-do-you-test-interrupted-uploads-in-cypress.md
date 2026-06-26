---
title: "How do you test interrupted uploads in Cypress?"
difficulty: "Advanced"
target_role: ["Automation_QA_Engineer"]
category: ["Technical"]
sub_category: "Automation"
question_type: "Code-challenge"
core_testing_type: "Automation"
domain: "Enterprise-Software"
platform: "Cross-platform"
tool_stack: "Cypress"
tags: ["automation", "coding-challenge", "interview-prep", "tech-strategy", "cypress", "network-testing", "interruption-testing", "file-upload"]
---

## Overview
Testing interrupted uploads in Cypress presents a unique challenge, as client-side frameworks generally lack direct OS-level network control. This topic explores leveraging Cypress's robust network interception capabilities to simulate network failures and validate an application's resilience during critical file transfer operations.

### Interview Question:
How do you test interrupted uploads in Cypress?

### Expert Answer:
Testing interrupted uploads in Cypress primarily relies on its powerful `cy.intercept()` command to simulate network failures, as direct client-side network manipulation or server-side control is outside Cypress's browser-context scope. The goal is to induce a controlled failure of the upload request and then assert the application's graceful handling of that state.

Here’s a structured approach:

1.  **Isolate the Upload Workflow:** Identify the specific API endpoint (`XHR` or `Fetch`) responsible for handling the file upload. This is crucial for precise interception.

2.  **Prepare Test Data:** Use `cy.fixture()` to load a dummy file. For simulating interruptions, it's often beneficial to use a larger file or a binary fixture to ensure the upload process has a duration where an interruption can be conceptually "mid-flight."

3.  **Simulate User Action:**
    *   Use `cy.get('input[type="file"]').selectFile()` to programmatically attach the file to the input field.
    *   Trigger the upload action, typically by clicking a button: `cy.get('button#upload-submit').click()`.

4.  **Intercept and Induce Failure:**
    This is the core of the solution. Use `cy.intercept()` to catch the outgoing upload request and force it to fail.

    ```javascript
    // cypress/e2e/upload-interrupt.cy.js
    it('should handle an interrupted file upload gracefully', () => {
      cy.visit('/upload-page'); // Navigate to the page with the upload component

      // 1. Intercept the POST request to the upload endpoint
      cy.intercept('POST', '/api/upload', (req) => {
        // 2. Simulate a network error causing the upload to interrupt
        // `forceNetworkError: true` directly simulates a browser-level network failure
        // (e.g., connection lost, server unreachable)
        req.reply({ forceNetworkError: true });
      }).as('uploadInterruption'); // Alias the interception for waiting

      // 3. Prepare and select the file
      cy.fixture('test-large-file.bin', 'binary').as('uploadFile');
      cy.get('input[type="file"]').selectFile({
        contents: '@uploadFile',
        fileName: 'test-large-file.bin',
        mimeType: 'application/octet-stream'
      });

      // 4. Trigger the upload action
      cy.get('button#start-upload').click();

      // 5. Wait for the intercepted request to complete (or fail in this case)
      cy.wait('@uploadInterruption').then((interception) => {
        // Assert the interception details indicating a network error
        expect(interception.response).to.be.null; // No actual response received
        // Depending on Cypress version/browser, statusText might be 'Network Error' or undefined
        // A direct 'forceNetworkError: true' won't yield an HTTP status code
      });

      // 6. Assert the UI reflects the interrupted state
      cy.get('.upload-status-message')
        .should('be.visible')
        .and('contain', 'Upload failed due to network'); // Or 'connection error', etc.
      cy.get('button#retry-upload').should('be.visible');
    });
    ```

5.  **Alternative Interruption Scenarios:**
    *   **Server-side Error:** `req.reply({ statusCode: 500, body: { error: 'Server unavailable' } });` This simulates a server-side error during the upload.
    *   **Timeout Simulation:** Use `req.on('response', (res) => { res.delay(10000); });` if your application has a client-side upload timeout configured. You'd then assert the timeout error message.

6.  **Assertion of UI/Application State:** Crucially, after forcing the interruption, assert that the application's UI reflects the failure gracefully (e.g., displays an error message, enables a retry button, disables further actions, restores the UI to a stable state).

**Framework Best Practices:**
*   **Page Object Model (POM):** Encapsulate upload-related selectors and actions within a dedicated Page Object for maintainability.
*   **Custom Commands:** Create custom Cypress commands for complex file selection or upload initiation to improve readability and reusability across multiple tests.
*   **Parameterized Tests:** If there are various types of files or different interruption points to test, consider data-driven testing.

This approach ensures robust testing of error handling for a critical user flow, directly contributing to application resilience and user experience.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
"When architecting modern automation frameworks, particularly for enterprise applications, validating critical user flows like file uploads under adverse conditions is paramount. This directly impacts user experience and data integrity, and ignoring these non-happy paths can lead to significant production incidents. Our strategy leverages Cypress's capabilities to rigorously test these scenarios within a mature CI/CD pipeline, ensuring application resilience at scale."

[The Core Execution]
"To test interrupted uploads in Cypress, the primary challenge lies in the browser-centric nature of the framework; we can't directly sever network cables or kill server processes from a client-side test. Our solution therefore focuses on simulating the *outcome* of such interruptions using Cypress's `cy.intercept()` command. The execution flow is quite precise:

First, we establish the user journey up to the point of upload: `cy.visit()` to the upload page, then using `cy.fixture()` to prepare our test file, and finally `cy.get('input[type="file"]').selectFile()` to programmatically attach it. The next step is to trigger the upload action, typically via a button click like `cy.get('button#upload-submit').click()`.

Crucially, before triggering the upload, we set up `cy.intercept()`. We target the specific `POST` request to our upload API endpoint, for instance, `/api/upload`. Inside the intercept callback, we introduce the interruption. The most effective method for simulating a genuine network interruption is to use `req.reply({ forceNetworkError: true })`. This tells Cypress to make the browser's XHR or Fetch request fail as if the network connection was lost—a true network-level interruption, rather than just receiving a server-generated error code. We then alias this intercept, say as `@uploadInterruption`.

After the upload is initiated, we `cy.wait('@uploadInterruption')`. This command will resolve once the intercepted request fails, confirming our simulated interruption occurred. Post-interruption, the focus shifts to comprehensive UI assertion. We assert that the application displays appropriate error messages, like 'Upload failed due to network error', that a 'Retry' button becomes visible, and that any progress indicators are correctly dismissed or updated. We can also extend this to test server-side errors by returning a `statusCode: 500` or simulating timeouts with `res.delay()`, depending on the specific edge case we need to cover."

[The Punchline]
"This meticulous approach ensures comprehensive test coverage for critical edge cases, significantly enhancing our application's resilience and user trust. It exemplifies a proactive engineering mindset, validating not just the 'happy path' but crucially, how the system gracefully handles instability, ultimately delivering a superior ROI on our automation investment by preventing costly production issues and upholding our commitment to engineering excellence."