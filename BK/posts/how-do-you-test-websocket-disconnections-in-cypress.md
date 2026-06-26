---
title: "How do you test WebSocket disconnections in Cypress?"
difficulty: "Advanced"
target_role: ["Automation_QA_Engineer"]
category: ["Technical"]
sub_category: "Automation"
question_type: "Code-challenge"
core_testing_type: "Automation"
domain: "Enterprise-Software"
platform: "Cross-platform"
tool_stack: "Cypress"
tags: ["automation", "coding-challenge", "interview-prep", "tech-strategy", "cypress", "websocket", "network-testing"]
---

## Overview
Testing WebSocket disconnections in Cypress presents a unique challenge due to Cypress's browser-level execution context. The core automation framework challenge lies in effectively simulating network disruptions to verify real-time application resilience without direct OS-level network manipulation.

### Interview Question:
How do you test WebSocket disconnections in Cypress?

### Expert Answer:
Testing WebSocket disconnections in Cypress demands client-side mocking due to Cypress's browser-level execution. The strategy involves overriding the browser's native `WebSocket` API to control its lifecycle and trigger disconnection events programmatically.

Here's the streamlined approach:

1.  **Inject Mock `WebSocket`**:
    Before the application initializes its WebSocket connection, gain control of the `window` object and replace the `WebSocket` constructor with a custom `MockWebSocket` implementation. This mock must mimic the real API, including `onopen`, `onmessage`, `onclose`, `onerror`, `send`, and `close`. Importantly, expose the mock instance to the `window` scope (e.g., `win.__mockWsInstance`) for test control.

    ```javascript
    cy.window().then((win) => {
      class MockWebSocket extends EventTarget {
        constructor(url, protocols) {
          super(); this.url = url; this.readyState = WebSocket.CONNECTING;
          this.onopen = null; this.onmessage = null; this.onclose = null; this.onerror = null;
          setTimeout(() => { this.readyState = WebSocket.OPEN; this.onopen && this.onopen({ type: 'open' }); }, 10);
          cy.stub(this, 'send').as('wsSend'); cy.stub(this, 'close').as('wsClose');
          win.__mockWsInstance = this;
        }
      }
      win.WebSocket = MockWebSocket;
    });
    ```

2.  **Trigger Connection & Simulate Disconnection**:
    Ensure the application attempts to establish its WebSocket connection. Once the `MockWebSocket`'s `onopen` is triggered (simulating a successful initial connection), directly access `win.__mockWsInstance` and invoke its `onclose` callback. Update `readyState` to `WebSocket.CLOSED`.

    ```javascript
    cy.visit('/'); // Or trigger action that connects
    cy.window().then((win) => {
      const mockWs = win.__mockWsInstance;
      if (mockWs) {
        mockWs.readyState = WebSocket.CLOSED;
        mockWs.onclose && mockWs.onclose({ code: 1000, reason: 'Simulated network drop', wasClean: true });
      }
    });
    ```

3.  **Verify Application Response**:
    Utilize Cypress assertions (`cy.get().should()`) to confirm the application's UI and internal state accurately reflect the simulated disconnection. Look for elements indicating offline status, error messages, or re-connection attempts.

This robust mocking pattern isolates the application's WebSocket client logic, enabling precise and repeatable testing of disconnection scenarios without relying on actual network failures or complex backend setups.

### Speaking Blueprint (3-Minute Verbal Response):
When we architect modern automation frameworks, particularly for real-time applications, ensuring comprehensive coverage, including robust error handling like WebSocket disconnections, is paramount. This directly impacts user experience and system reliability, and standardizing its testing is crucial for engineering efficiency.

For WebSocket disconnection testing in Cypress, given its browser-level execution, direct network-stack manipulation is impractical. Our approach centers on client-side mocking of the browser's native `WebSocket` API. We begin by gaining control of the `window` object within the Cypress test context using `cy.window()`. Inside this `then` block, we define and inject a `MockWebSocket` class that mimics the real `WebSocket` interface. This mock intercepts all `new WebSocket()` calls made by the application. Crucially, this `MockWebSocket` instance is designed with stubbed methods for `send` and `close`, allowing us to track their invocation, and exposes properties like `onopen`, `onmessage`, `onclose`, and `onerror`. We then expose this mock instance onto the `window` object, perhaps as `window.__mockWsInstance`, making it accessible from our test script. To simulate a disconnection, we simply retrieve `window.__mockWsInstance` and programmatically trigger its `onclose` callback, setting its `readyState` to `CLOSED`. This mimics the browser notifying the application of a connection drop. Post-disconnection, Cypress then asserts the application's UI response – perhaps an 'offline' indicator, an error message, or a re-connection attempt – using standard `cy.get().should()` commands.

This strategy allows us to reliably test complex real-time scenarios without external server dependencies or complex infrastructure, ensuring that our application gracefully handles network instabilities. It reinforces our commitment to building highly resilient and maintainable automation that directly contributes to product quality and reduces operational overhead, driving significant long-term engineering ROI.