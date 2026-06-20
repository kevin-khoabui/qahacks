---
title: "How do you test token revocation across active sessions?"
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
Testing token revocation across active sessions is a critical security validation, ensuring that when a token is invalidated, all associated user sessions are correctly terminated. This challenge requires a robust automation framework capable of simulating multiple user contexts and verifying both API and UI states efficiently.

### Interview Question:
How do you test token revocation across active sessions?

### Expert Answer:
Testing token revocation across active sessions demands a multi-layered approach within an automation framework, integrating both API and UI testing capabilities.

**1. Session Initialization (API-driven):**
The first step is to establish multiple *simulated* active sessions. This is primarily an API operation. For each session, authenticate a user via an API endpoint (e.g., `/login`) to obtain a unique access token and potentially a refresh token. Store these tokens along with session identifiers (e.g., user ID, device ID) in a test-specific data store.
*Example (Playwright `request` context):*
```javascript
const user1Token = await request.post('/login', { data: { user: 'u1' } });
const user2Token = await request.post('/login', { data: { user: 'u2' } });
```
To simulate *active* browser sessions for UI verification, launch multiple browser contexts or pages, navigate to the application, and inject the respective tokens (e.g., into local storage or a cookie) to bypass UI login.

**2. Revocation Trigger:**
Execute the token revocation mechanism. This is typically an API call to a dedicated endpoint like `/logout_all_sessions`, `/revoke_token/{tokenId}`, or an admin action that invalidates tokens server-side. The revocation target could be a specific token, all tokens for a user, or a global revocation.
*Example:*
```javascript
await request.post('/revoke_all_sessions', { headers: { Authorization: `Bearer ${adminToken}` } });
```

**3. Verification of Revocation:**
This is the most critical phase and requires concurrent checks across all affected sessions.

*   **API Verification (Immediate):**
    *   Attempt to make API calls using each of the *previously valid* and now *revoked* tokens.
    *   Assert that these calls fail with expected HTTP status codes (e.g., `401 Unauthorized`, `403 Forbidden`) or specific error messages indicating token invalidation.
    *Example:*
    ```javascript
    const resp = await request.get('/protected-resource', { headers: { Authorization: `Bearer ${user1Token}` } });
    expect(resp.status()).toBe(401);
    ```

*   **UI Verification (Active Sessions):**
    *   For each active browser session (where tokens were injected), attempt to perform an action requiring authentication (e.g., navigate to a protected page, click a button that makes an authenticated request).
    *   Assert that the user is redirected to the login page, an "unauthorized" message is displayed, or the authenticated action fails gracefully.
    *   This confirms that client-side sessions are also correctly invalidated and react to the server-side revocation.
    *Example:*
    ```javascript
    await page1.goto('/dashboard');
    await expect(page1).toHaveURL(/login/);
    ```

**4. Edge Cases & Negative Testing:**
*   Attempt to revoke an already expired token.
*   Attempt to revoke an invalidly formatted token.
*   Test concurrent revocations.
*   Verify revocation specific to a single session without affecting others (if applicable).

**Framework Architecture:**
Implement a `SessionManager` utility to handle token acquisition, storage, and retrieval. Use a `TestRunner` that can orchestrate parallel API calls and UI browser contexts. Abstract API requests and UI interactions using Page Object Model or service objects for maintainability. A robust CI/CD pipeline should integrate these tests to run frequently.

### Speaking Blueprint (3-Minute Verbal Response):
Ensuring robust security, particularly around session management and token revocation, is absolutely paramount in any modern application. Our automation strategy for this critical area isn't just about finding bugs; it's about building an unshakeable confidence in our system's resilience against unauthorized access, leveraging powerful tools like Playwright to scale our testing efforts significantly.

When approaching token revocation across active sessions, we employ a sophisticated, multi-pronged strategy. First, we use Playwright's `request` context to simulate multiple active user sessions. We programmatically authenticate different users, acquiring unique access tokens for each through direct API calls. These tokens are then securely managed within our test framework. Next, we orchestrate the revocation event—typically an API call to a central revocation endpoint, perhaps from an admin context, to invalidate specific tokens or all tokens for a given user. The verification phase is where the real robustness comes in. Immediately following revocation, we fire off concurrent API calls using each of the *revoked* tokens. We assert that these requests fail definitively with `401 Unauthorized` or `403 Forbidden` status codes, confirming server-side invalidation. Crucially, we also launch multiple Playwright browser contexts, injecting the respective tokens into their local storage, effectively simulating actively logged-in UI sessions. For each of these active UI sessions, we then attempt to perform an authenticated action, such as navigating to a protected page. We verify that the user is immediately redirected to the login page or presented with an appropriate "session expired" message, ensuring the front-end correctly reacts to the backend revocation. We also cover edge cases, like attempting to revoke an already expired token or testing concurrent revocation scenarios, to ensure comprehensive coverage.

This holistic approach, integrating both rapid API verification with real-user UI experience checks, allows us to provide full confidence in our token revocation mechanisms. It's a testament to how intelligent framework design and strategic tool utilization translate directly into engineering efficiency, bolstering our security posture, and delivering significant long-term ROI by preventing costly production vulnerabilities.