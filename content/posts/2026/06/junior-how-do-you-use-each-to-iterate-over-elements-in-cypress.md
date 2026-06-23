---
title: "(Junior) How do you use `each` to iterate over elements in Cypress?"
difficulty: "Advanced"
target_role: ["Automation_QA_Engineer"]
category: ["Technical"]
sub_category: "Automation"
question_type: "Code-challenge"
core_testing_type: "Automation"
domain: "Enterprise-Software"
platform: "Cross-platform"
tool_stack: "Cypress"
tags: ["automation", "coding-challenge", "interview-prep", "tech-strategy"]
---

## Overview
Iterating over collections of dynamic elements is a fundamental requirement in robust UI automation, crucial for validating lists, tables, or repeated components. Cypress's `cy.each()` command provides a powerful, chainable mechanism to interact with or assert properties of multiple DOM elements efficiently and reliably within the test flow.

### Interview Question:
(Junior) How do you use `each` to iterate over elements in Cypress?

### Expert Answer:
In Cypress, the `cy.each()` command is a powerful utility for iterating over a collection of DOM elements obtained from a preceding `cy.get()` or similar command. It's akin to jQuery's `.each()` but fully integrated into Cypress's command queue and retry-ability mechanism, making it highly effective for handling dynamic lists and asserting properties across multiple elements.

**Core Usage and Parameters:**
The standard syntax involves chaining `each()` after selecting a collection of elements:

```javascript
cy.get('selector-for-collection')
  .each(($el, index, $list) => {
    // $el: A jQuery wrapper for the current DOM element in the iteration.
    // index: The zero-based index of the current element.
    // $list: A jQuery wrapper for the entire collection of DOM elements.
    // Operations or assertions on $el go here.
  });
```

**Implementation Details and Best Practices:**

1.  **Chaining Cypress Commands on Individual Elements:** Inside the `each` callback, `$el` is a jQuery object. To chain further Cypress commands (e.g., `click()`, `type()`, `should()`) directly onto this specific element, it must first be wrapped using `cy.wrap($el)`. This re-enters the element into the Cypress command chain, allowing for full Cypress command functionality and retry-ability.

    ```javascript
    // Example: Clicking each item in a navigation menu
    cy.get('.nav-menu li').each(($li, index) => {
      cy.log(`Clicking navigation item ${index}: ${$li.text()}`);
      cy.wrap($li).click(); // Wraps the jQuery element to allow Cypress commands
      cy.url().should('include', `/page-${index}`); // Example assertion
      cy.go('back'); // Navigate back for the next iteration
    });
    ```

2.  **Assertions on Element Properties:** `each` is ideal for verifying consistent properties across a list, such as ensuring all items are visible or contain specific text.

    ```javascript
    // Example: Asserting text content of product titles
    cy.get('.product-card .product-title').each(($title, index) => {
      const titleText = $title.text().trim();
      expect(titleText).to.not.be.empty;
      cy.log(`Product ${index} title: ${titleText}`);
      cy.wrap($title).should('be.visible'); // Ensure each title is visible
    });
    ```

3.  **Handling Dynamic Collections:** `cy.get()` preceding `each()` benefits from Cypress's automatic retry logic. This means Cypress will wait for elements matching the selector to appear and become stable before `each()` begins its iteration, mitigating flakiness common with dynamically loaded content.

4.  **Avoiding Anti-Patterns:**
    *   **Don't `cy.get()` inside `each()` unnecessarily:** If the elements you need inside the loop are descendants of the current `$el`, use `cy.wrap($el).find('child-selector')` instead of `cy.get('child-selector')`. This scopes the search and is more performant and robust.
    *   **Avoid complex asynchronous operations:** While possible, over-reliance on external promises or `async/await` within `each` can lead to difficult-to-debug scenarios given Cypress's command queue model. Stick to `cy.wrap()` for most operations.

5.  **Maintainability and Readability:** For complex interactions within `each`, consider encapsulating the logic within a custom command or a Page Object Model method. This improves test readability and reusability.

    ```javascript
    // In a Page Object Model (POM) context
    class ProductListPage {
      get productItems() { return cy.get('.product-item'); }

      addEachProductToCart() {
        this.productItems.each(($product) => {
          cy.wrap($product).find('.add-to-cart-button').click();
          cy.wrap($product).find('.product-name').should('be.visible'); // Assert after click
          // Could add more specific assertions or waits here
        });
      }
    }
    // Usage in test:
    // const productListPage = new ProductListPage();
    // productListPage.addEachProductToCart();
    ```

By judiciously applying `cy.each()` with `cy.wrap()` and adhering to best practices, automation engineers can build highly reliable and maintainable tests for dynamic web interfaces.

### Speaking Blueprint (3-Minute Verbal Response):

[The Hook]
"When we're designing modern automation frameworks, particularly with tools like Cypress, a critical challenge often emerges around handling dynamic collections of UI elements. Ensuring our tests are robust, scalable, and don't succumb to flakiness when dealing with lists, tables, or repeating components directly impacts our engineering efficiency and the overall reliability of our CI/CD pipelines."

[The Core Execution]
"For this, Cypress provides a highly effective command: `cy.each()`. This command is essentially our go-to for iterating over a collection of DOM elements that we've first retrieved, typically using `cy.get()`. The beauty of `cy.each()` is how seamlessly it integrates into Cypress's command chaining. When we call `cy.get('some-selector').each(($el, index, $list) => { ... })`, Cypress will first ensure the collection of elements matching our selector is present and stable, leveraging its built-in retry-ability. Then, for each element in that resolved collection, it executes our provided callback function.

Inside this callback, we receive a jQuery-wrapped DOM element, `$el`. The crucial part here is that to continue chaining *Cypress-specific* commands onto this individual element—like `click()`, `type()`, or `should('be.visible')`—we must first explicitly wrap it using `cy.wrap($el)`. This re-enters that specific element into the Cypress command queue, ensuring we maintain Cypress's powerful capabilities, including its automatic retries and assertions, at an individual element level.

For instance, if we have a list of product cards and we need to add each one to a cart, our code might look like: `cy.get('.product-card').each(($productCard) => { cy.wrap($productCard).find('.add-to-cart-button').click(); cy.wrap($productCard).find('.product-name').should('be.visible'); });`. This pattern allows us to perform actions and granular assertions on every single matched element, making our tests exceptionally thorough and less prone to overlooking issues within dynamic content."

[The Punchline]
"Ultimately, mastering `cy.each()` is about building intelligent, resilient automation. It’s not just about clicking buttons; it's about validating the integrity of our UI across numerous dynamic instances. This capability significantly reduces test flakiness, enhances test maintainability through clear, scoped operations, and provides a much higher return on investment for our automation efforts, ensuring our applications consistently deliver a high-quality user experience."