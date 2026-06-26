---
title: "How do you test offline browser behavior in Cypress?"
difficulty: "Advanced"
target_role: ["Automation_QA_Engineer"]
category: ["Technical"]
sub_category: "Automation"
question_type: "Code-challenge"
core_testing_type: "Automation"
domain: "Enterprise-Software"
platform: "Cross-platform"
tool_stack: "Cypress"
tags: ["automation", "coding-challenge", "interview-prep", "tech-strategy", "cypress", "offline-testing", "service-worker", "network-stubbing", "cdp"]
---

## Overview
Testing offline browser behavior in Cypress presents a unique challenge for modern PWAs and robust web applications, as it requires simulating actual network disconnection rather than merely stubbing API responses. This demands leveraging Cypress's deeper capabilities to interact with the browser's core network stack.

### Interview Question:
How do you test offline browser behavior in Cypress?

### Expert Answer:
Testing true offline browser behavior in Cypress, particularly for Progressive Web Apps (PWAs) that rely on Service Workers and the `navigator.onLine` API, necessitates going beyond `cy.intercept()`. While `cy.intercept()` is excellent for stubbing individual network requests, it doesn't simulate a complete network disconnection at the browser level, which affects how the browser interprets `navigator.onLine` and how Service Workers behave.

The most robust approach involves leveraging the Chrome DevTools Protocol (CDP) through Cypress's `task` mechanism. This allows us to programmatically control the browser's network conditions.

**Implementation Steps:**

1.  **Cypress Plugin Configuration (`cypress/plugins/index.js`):**
    We define a `task` that exposes a CDP client. This task will accept a network condition (e.g., 'offline', 'online') and issue the `Network.emulateNetworkConditions` command.

    ```javascript
    // cypress/plugins/index.js
    module.exports = (on, config) => {
      on('task', {
        async setNetworkCondition(condition) {
          const client = config.browser.cdpClient;
          if (!client) {
            console.warn('CDP client not available. Is Chrome/Chromium browser used?');
            return null;
          }
          await client.Network.enable();
          await client.Network.emulateNetworkConditions({
            offline: condition === 'offline',
            latency: condition === 'offline' ? -1 : 0, // No latency for true offline
            downloadThroughput: condition === 'offline' ? -1 : 0, // No download for true offline
            uploadThroughput: condition === 'offline' ? -1 : 0, // No upload for true offline
          });
          return null;
        },
      });
      return config;
    };
    ```

2.  **Custom Cypress Command (`cypress/support/commands.js`):**
    Wrap the `cy.task()` call in a custom command for better readability and reusability in tests.

    ```javascript
    // cypress/support/commands.js
    Cypress.Commands.add('setNetwork', (condition) => {
      cy.task('setNetworkCondition', condition);
    });
    ```

3.  **Test Case (`cypress/e2e/offline.cy.js`):**
    In your test, you can now invoke `cy.setNetwork('offline')` to simulate disconnection, perform assertions, and then `cy.setNetwork('online')')` to restore connectivity.

    ```javascript
    // cypress/e2e/offline.cy.js
    describe('Offline Browser Behavior', () => {
      beforeEach(() => {
        cy.visit('/'); // Visit your PWA
      });

      afterEach(() => {
        // Crucial: Ensure network is restored for subsequent tests
        cy.setNetwork('online');
      });

      it('should correctly indicate offline status and serve cached content', () => {
        cy.setNetwork('offline');
        // Assert that navigator.onLine is false
        cy.window().its('navigator.onLine').should('be.false');
        // Assert on UI elements indicating offline mode
        cy.get('[data-test="offline-indicator"]').should('be.visible');
        // Attempt to navigate or fetch data that should come from cache
        cy.contains('Cached data element').should('be.visible');
      });

      it('should handle re-connection gracefully', () => {
        cy.setNetwork('offline');
        cy.window().its('navigator.onLine').should('be.false');
        // Simulate re-connection
        cy.setNetwork('online');
        cy.window().its('navigator.onLine').should('be.true');
        cy.get('[data-test="offline-indicator"]').should('not.exist');
        // Assert that online content/functionality is restored
      });
    });
    ```

**Key Considerations:**

*   **Browser Support:** CDP is primarily supported by Chromium-based browsers (Chrome, Edge, Electron). Ensure your Cypress configuration uses one of these browsers for offline tests.
*   **Service Workers:** This CDP method will influence how `navigator.onLine` behaves, which in turn affects Service Worker registration and event handling (e.g., `fetch` events, `sync` events). You can also use CDP to directly register/unregister Service Workers if needed, though `Network.emulateNetworkConditions` usually suffices for broader offline state testing.
*   **Test Isolation:** Always restore the network condition (`cy.setNetwork('online')`) in an `afterEach` hook to prevent test pollution.
*   **Verification:** Beyond checking `navigator.onLine`, ensure you're asserting on the application's actual UI/UX behavior (e.g., "You are offline" messages, accessibility of cached content, disabled online-only features).

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
In today's landscape of resilient web applications and PWAs, ensuring a seamless user experience, even when offline, is paramount. My approach to E2E testing in Cypress extends beyond typical API stubbing to genuinely simulate these critical network conditions, driving both engineering confidence and product reliability.

[The Core Execution]
When tackling offline browser behavior in Cypress, the core challenge lies in differentiating between merely stubbing network requests, which `cy.intercept` handles brilliantly, and truly disconnecting the browser from the network, which impacts `navigator.onLine` and how Service Workers behave. To achieve this, we leverage Cypress's powerful Node.js layer to interact with the Chrome DevTools Protocol, or CDP.

Specifically, in our `cypress/plugins/index.js` file, we define a custom `task` that gains access to the browser's CDP client. This task allows us to issue the `Network.emulateNetworkConditions` command. By setting the `offline` parameter to `true`, along with `latency`, `downloadThroughput`, and `uploadThroughput` to `-1`, we effectively put the browser into a disconnected state. I then encapsulate this plugin task within a custom Cypress command, like `cy.setNetwork('offline')` or `cy.setNetwork('online')`, defined in `cypress/support/commands.js`.

Within our actual test suites, we simply call `cy.setNetwork('offline')` before our assertions. This allows us to verify several critical aspects: the application's UI response, such as displaying an "offline" indicator; the state of `window.navigator.onLine` being accurately `false`; and crucially, the accessibility of cached content or the graceful degradation of online-dependent features. It's imperative to also include an `afterEach` hook to call `cy.setNetwork('online')`, ensuring network connectivity is restored for subsequent tests and maintaining robust test isolation.

[The Punchline]
This advanced technique ensures our automation tests validate true offline resilience, not just API stubs, leading to a higher quality, more robust user experience. It's about building engineering efficiency by catching these edge-case failures early in the development cycle, ultimately delivering exceptional ROI on our testing efforts through comprehensive scenario coverage and reduced production incidents.