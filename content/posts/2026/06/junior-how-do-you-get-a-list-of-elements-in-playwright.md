---
title: "(Junior) How do you get a list of elements in Playwright?"
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
Effectively locating and interacting with multiple web elements is a fundamental task in automation testing, crucial for validating lists, tables, or dynamic content. Playwright provides powerful, resilient APIs for this, central to building maintainable and scalable test suites.

### Interview Question:
(Junior) How do you get a list of elements in Playwright?

### Expert Answer:
In Playwright, retrieving a list of elements is primarily handled by the `page.locator()` method, followed by an accessor function. The core strength lies in Playwright's auto-waiting and the `Locator` object's inherent resilience.

1.  **Using `page.locator().all()` for `Locator` Objects:**
    The most common and flexible approach is to use `page.locator('selector').all()`. This method returns a `Promise<Array<Locator>>`. Each `Locator` object in the array represents a specific element matching the selector. This is beneficial because `Locator` objects are lazy and incorporate Playwright's auto-retrying mechanism, making them robust against transient UI changes.

    ```typescript
    // Example: Getting all product titles on an e-commerce page
    const productTitlesLocators = await page.locator('.product-title').all();
    for (const titleLocator of productTitlesLocators) {
        console.log(await titleLocator.textContent());
    }
    ```

2.  **Using `page.locator().allTextContents()` for String Arrays:**
    If you only need the text content of all matching elements and don't need to interact further with individual `Locator` objects, `page.locator('selector').allTextContents()` is highly efficient. It returns a `Promise<Array<string>>`. This avoids the overhead of creating individual `Locator` instances, offering a performance advantage when only text validation is required.

    ```typescript
    // Example: Getting all product titles as a string array
    const productTitles = await page.locator('.product-title').allTextContents();
    console.log(productTitles); // ['Product A', 'Product B', 'Product C']
    ```

3.  **Selector Strategies:**
    *   **CSS Selectors:** Generally preferred for their readability and performance. Use specific attributes like `data-test-id`, `id`, or `class` for robustness.
        ```typescript
        await page.locator('[data-test-id="item-name"]').all();
        ```
    *   **XPath Selectors:** Useful for complex scenarios where CSS selectors fall short, such as selecting elements based on their text content or traversing up the DOM.
        ```typescript
        await page.locator('//ul[@id="myList"]/li').all();
        ```

4.  **Framework Integration (Page Object Model - POM):**
    For scalable automation, these methods should be encapsulated within Page Object Model classes. This promotes reusability, readability, and easier maintenance.

    ```typescript
    // Example within a Page Object
    class ProductListPage {
        private page: Page;
        private productTitleSelector = '.product-title';

        constructor(page: Page) {
            this.page = page;
        }

        async getProductTitles(): Promise<string[]> {
            // Ensures the first element is visible before fetching all texts
            await this.page.locator(this.productTitleSelector).first().waitFor({ state: 'visible' });
            return await this.page.locator(this.productTitleSelector).allTextContents();
        }

        async getProductItemLocators(): Promise<Locator[]> {
            return await this.page.locator('.product-item').all();
        }
    }
    ```

**Best Practices:**
*   **Robust Selectors:** Prioritize `data-test-id` attributes or unique `id`s to make selectors less susceptible to UI changes.
*   **Explicit Waiting (for list presence):** While `Locator` objects auto-wait, if the *entire list* might load dynamically, consider explicitly waiting for at least one element in the list to be visible before calling `all()` or `allTextContents()`. The example above shows `first().waitFor({ state: 'visible' })` which is a good pattern.
*   **Error Handling:** Both `all()` and `allTextContents()` return an empty array if no elements match the selector, rather than throwing an error. This is useful for assertions or conditional logic.
*   **Performance:** Use `allTextContents()` when only text is needed. Use `all()` when you need to interact with individual elements (e.g., click each, check attributes).

The choice between `all()` and `allTextContents()` depends on whether you need to perform further actions on each element or merely extract their text content. Both are powerful tools for robust list manipulation in Playwright.

### Speaking Blueprint (3-Minute Verbal Response):
[The Hook]
In modern web automation, efficiently and reliably collecting lists of elements is absolutely critical for building scalable and maintainable test suites, especially with today's highly dynamic web applications. Playwright excels in this area, offering a powerful and intuitive API that significantly enhances test resilience and developer experience.

[The Core Execution]
At its core, Playwright allows us to retrieve a list of elements primarily through its `page.locator()` method, combined with specific accessor functions. The most common approach involves `page.locator('your_selector').all()`. This returns a Promise that resolves to an array of Playwright `Locator` objects. What's crucial here is that each `Locator` object acts as a live handle to its respective element, benefiting from Playwright's automatic waiting and retrying mechanisms. So, if we need to iterate through a list of products and click each one, we'd get an array of these resilient `Locator` objects. For instance, in our Page Object Model, a `ProductListPage` might have a method `getProductItemLocators()` that returns `this.page.locator('.product-item').all()`. We then iterate through these locators to perform actions.

Alternatively, if our primary goal is simply to extract the text content from a list of elements, without needing to interact with them further, Playwright offers an even more performant option: `page.locator('your_selector').allTextContents()`. This directly returns a Promise resolving to an array of strings, bypassing the overhead of creating individual `Locator` objects. This is incredibly useful for assertions involving text verification, such as checking if all items in a list contain specific keywords. We typically implement this within our Page Objects; for example, `getProductTitles()` would utilize `this.page.locator('.product-title').allTextContents()`. We also ensure our selectors are robust, favoring `data-test-id` attributes to minimize flakiness, and for dynamic lists, we might add a `first().waitFor({ state: 'visible' })` call to ensure at least one element is present before fetching the entire list.

[The Punchline]
By strategically using `all()` for interactive scenarios and `allTextContents()` for data extraction, all encapsulated within a well-structured Page Object Model, we build an automation framework that is not only highly readable and maintainable but also incredibly robust against UI changes and performance fluctuations. This approach directly translates into faster feedback loops for our engineering teams and a significantly higher ROI on our automation efforts.