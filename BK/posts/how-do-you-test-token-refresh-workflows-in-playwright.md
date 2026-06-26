---
title: "How do you test token refresh workflows in Playwright?"
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
Testing token refresh workflows with Playwright presents a robust challenge, requiring a blend of UI automation, API interaction, and network interception. It's crucial for validating session management, user experience, and application security under expiring authentication states.

### Interview Question:
How do you test token refresh workflows in Playwright?

### Expert Answer:
Testing token refresh workflows in Playwright involves a strategic combination of session management, API interaction, and network event monitoring. The core challenge is reliably simulating or waiting for token expiration and then verifying the refresh mechanism.

Our approach centers on these steps:

1.  **Initial Authentication & Session Persistence:**
    We perform a standard login and then leverage Playwright's `storageState` to persist the authenticated session. This avoids repeated full UI logins for each test, enhancing efficiency.

    ```javascript
    await page.goto('/login');
    await page.fill('#username', process.env.TEST_USER);
    await page.fill('#password', process.env.TEST_PASSWORD);
    await page.click('#login-button');
    // Wait for successful login, e.g., redirect to dashboard
    await page.waitForURL('/dashboard');
    await page.context().storageState({ path: 'auth.json' });
    ```

2.  **Inducing Token Expiration (Critical Step):**
    This is often the trickiest part.
    *   **Ideal Scenario (Test Environment):** The most reliable method is using a dedicated test environment configured with a very short access token TTL (e.g., 30-60 seconds). Our test then simply waits for this duration.
    *   **API-Driven Manipulation:** If direct configuration isn't feasible, we can use Playwright's `request` context to programmatically obtain a refresh token (if available) and then use it to request an *already expired* access token from the authentication server, setting the stage for the next UI interaction.
    *   **Direct API Refresh:** In some architectures, you might proactively call the `/refresh-token` endpoint using `request` context, and then force the client-side storage (e.g., `localStorage`) to reflect an *expired* access token but a valid refresh token, before proceeding with UI actions.

3.  **Monitoring the Refresh Process:**
    We use `page.route` to intercept and monitor network requests. Specifically, we look for the API call to the token refresh endpoint (e.g., `/api/auth/refresh-token`).

    ```javascript
    const refreshPromise = page.waitForRequest(
      request => request.url().includes('/api/auth/refresh-token') && request.method() === 'POST'
    );

    // After inducing expiration, perform an action that triggers an authenticated API call
    // e.g., clicking a button that fetches user data
    await page.click('#fetch-data-button');

    // Await the refresh request
    const refreshRequest = await refreshPromise;
    const refreshResponse = await refreshRequest.response();
    expect(refreshResponse.status()).toBe(200);
    // Further assertions on response body for new access/refresh tokens
    const responseBody = await refreshResponse.json();
    expect(responseBody.accessToken).toBeDefined();
    ```

4.  **Verifying Post-Refresh State:**
    After the refresh is confirmed via network interception:
    *   **UI Functional Verification:** Perform another authenticated UI action (e.g., navigate to a protected page, make another API call through the UI) to ensure it succeeds with the new token.
    *   **Client-Side Storage:** Inspect `localStorage` or `sessionStorage` using `page.evaluate()` to verify that the new access token has been updated client-side.

    ```javascript
    const newAccessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(newAccessToken).toBeDefined();
    expect(newAccessToken).not.toBe(oldExpiredAccessToken); // Assuming we captured the old one
    ```

5.  **Robustness & Test Design:**
    *   **Isolation:** Each test should start with a clean state.
    *   **Retries/Timeouts:** Use `expect.poll` or `page.waitForFunction` with appropriate timeouts when waiting for asynchronous events like token expiration or UI updates.
    *   **Helper Functions:** Encapsulate common login and token management logic into helper functions or Page Objects to promote reusability and maintainability.

This comprehensive strategy ensures we validate the entire token refresh lifecycle, from expiration detection to successful re-authentication and continued user experience.

### Speaking Blueprint (3-Minute Verbal Response):

[The Hook]
"When architecting robust automation frameworks, particularly for modern web applications, thoroughly testing authentication and session management—especially token refresh workflows—is absolutely paramount. It directly impacts user experience, security, and the stability of the entire system. Our goal is to ensure that even background authentication mechanisms work flawlessly, and Playwright provides an exceptional toolkit for this complex challenge."

[The Core Execution]
"Our approach centers on a few key Playwright capabilities. First, we establish an authenticated session efficiently by performing an initial login and then persisting that session using `page.context().storageState()`. This means subsequent tests don't incur the overhead of re-logging in. The true engineering challenge lies in reliably *inducing* the token refresh. The most robust way is to leverage a test environment where access token TTLs are deliberately set to a very short duration, perhaps 30 to 60 seconds. Our test then simply waits for this period. If direct configuration isn't an option, we can use Playwright's `request` context to interact directly with our authentication APIs – perhaps to programmatically obtain an expired token, or even force a refresh using an existing refresh token, setting up the client-side state for the refresh to occur. Once we've induced expiration, we then use `page.route()` to intercept and monitor network requests. We specifically look for the outgoing API call to our `/refresh-token` endpoint. We assert its HTTP status, and crucially, inspect the response payload to ensure new, valid access and refresh tokens are returned. Finally, we verify the post-refresh state: conducting another authenticated UI action to confirm it succeeds, and using `page.evaluate()` to directly inspect client-side storage like `localStorage` to confirm the new tokens have been updated. This full cycle validation ensures the application handles token expiration gracefully and transparently for the user."

[The Punchline]
"This meticulous, multi-layered testing strategy provides high confidence in our application's authentication resilience. By combining UI interactions with powerful API and network controls, we ensure that critical security and session management features are thoroughly validated, significantly reducing production issues related to user sessions, and ultimately, delivering a seamless and secure experience for our end-users—a critical ROI for any enterprise-grade application."