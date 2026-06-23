---
title: "(Junior) How do you read a JSON file for test data in Playwright?"
difficulty: "Intermediate"
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
Efficiently managing test data is crucial for building robust and scalable Playwright automation frameworks. This question probes a junior engineer's understanding of leveraging external JSON files to feed dynamic data into tests, a fundamental aspect of data-driven testing.

### Interview Question:
(Junior) How do you read a JSON file for test data in Playwright?

### Expert Answer:
Reading a JSON file for test data in a Playwright project primarily involves leveraging Node.js's built-in file system module (`fs`) and JSON parsing capabilities. This approach externalizes test data, promoting maintainability and reusability.

**1. Data File Structure (`testData.json`):**
First, define your test data in a JSON file. For instance, `testData/users.json`:

```json
[
  {
    "username": "user1",
    "password": "password123",
    "expectedText": "Welcome, user1"
  },
  {
    "username": "user2",
    "password": "password456",
    "expectedText": "Welcome, user2"
  }
]
```

**2. Data Reader Utility:**
Create a utility function to handle reading and parsing the JSON file. This centralizes data access and adds robustness.

```typescript
// utils/dataReader.ts
import fs from 'fs';
import path from 'path';

interface UserData {
  username: string;
  password: string;
  expectedText: string;
}

export function readJsonData(filePath: string): UserData[] {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(fileContent) as UserData[];
  } catch (error) {
    console.error(`Failed to read or parse JSON file at ${filePath}:`, error);
    throw new Error(`Error loading test data: ${error.message}`);
  }
}
```
*   `path.resolve(process.cwd(), filePath)`: Ensures platform-agnostic path resolution, making the script robust regardless of where it's run. `process.cwd()` gets the current working directory.
*   `fs.readFileSync`: Reads the file synchronously. For larger files or performance-critical scenarios, `fs.promises.readFile` (async) can be considered, though synchronous is often fine for test data.
*   `JSON.parse`: Converts the JSON string content into a JavaScript object.
*   `try...catch`: Essential for error handling, gracefully managing scenarios like file not found or malformed JSON.
*   Type definitions (`UserData` interface): Provides strong typing for better code clarity and error prevention.

**3. Integrating into a Playwright Test:**
Now, integrate this utility into your Playwright test spec.

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { readJsonData } from '../utils/dataReader';

const users = readJsonData('testData/users.json');

test.describe('Login functionality with data-driven approach', () => {
  for (const user of users) {
    test(`should allow ${user.username} to login successfully`, async ({ page }) => {
      await page.goto('https://example.com/login'); // Replace with actual login page URL
      await page.fill('#username', user.username);
      await page.fill('#password', user.password);
      await page.click('button[type="submit"]');
      await expect(page.locator('.welcome-message')).toHaveText(user.expectedText);
    });
  }
});
```
*   The `readJsonData` function is called once at the top level of the test file.
*   A `for...of` loop iterates over the `users` array, dynamically creating individual tests for each data set. Playwright's `test.describe.configure({ mode: 'parallel' })` could be used for parallel execution of these tests if applicable. Alternatively, `test.each` is a more declarative way for data-driven tests in newer Playwright versions.

This structured approach ensures data separation, easy updates, and robust test execution.

### Speaking Blueprint (3-Minute Verbal Response):

[The Hook]
"In modern test automation, the ability to externalize and manage test data efficiently is paramount for building truly scalable and maintainable frameworks. It moves us away from brittle, hardcoded values and towards more robust, data-driven testing paradigms."

[The Core Execution]
"When it comes to Playwright and reading JSON files for test data, the fundamental approach involves leveraging Node.js's built-in `fs` module for file system operations. Conceptually, we'd start by defining our test data within a `.json` file, perhaps structured as an array of objects for multiple scenarios, or a single configuration object for global parameters. For instance, a `users.json` file could contain different login credentials.

"Within our Playwright project, typically in a dedicated `utils` or `data` directory, I'd create a reusable data reader function. This function would utilize `fs.readFileSync` to synchronously read the file content, followed by `JSON.parse` to convert that raw string into an accessible JavaScript object or array. To ensure robustness and portability across different environments and operating systems, I'd always incorporate `path.resolve` for platform-agnostic file path resolution, making sure our scripts find the data files reliably. Furthermore, robust `try...catch` blocks are absolutely essential for error handling, gracefully managing scenarios like file not found or malformed JSON, preventing test failures due to data access issues.

"Then, in our actual test spec, say `login.spec.ts`, we simply import this utility function. We would call it once to load the entire dataset. From there, we can easily iterate over the returned data – perhaps using a standard `for...of` loop or, even better, Playwright's `test.each` construct for a more declarative and streamlined data-driven testing experience – to dynamically generate and run multiple test scenarios with different data sets."

[The Punchline]
"This clear separation of test data from the core test logic not only significantly enhances readability and maintainability for our test suite but also dramatically boosts reusability, allowing us to rapidly expand test coverage without altering the fundamental test scripts. Ultimately, this directly contributes to a higher return on investment for our automation efforts by reducing maintenance overhead and increasing test agility."