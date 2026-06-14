---
title: "What test cases do you write to validate custom filtering views that users can save, edit, and delete?"
difficulty: "Advanced"
target_role: ["Manual_QA_Engineer"]
category: ["Foundations_Methodology"]
sub_category: "Strategy"
question_type: "Situational"
core_testing_type: "Manual"
domain: "Enterprise-Software"
platform: "Cross-platform"
tool_stack: "None"
leadership_competency: "Risk Mitigation"
interview_focus: "Delivery Pressure"
tags: ["manual-testing", "qa-lead", "interview-prep", "test-leadership"]
---

## Overview
Validating custom filtering views with save, edit, and delete functionality presents a critical quality risk. Incorrect data presentation, data loss, or usability issues can severely impact user productivity and the reliability of business decisions, requiring a robust, multi-faceted testing strategy.

### Interview Question:
What test cases do you write to validate custom filtering views that users can save, edit, and delete?

### Expert Answer:

To validate custom filtering views, I'd design a comprehensive test suite focusing on functional integrity, data accuracy, and user experience, while mitigating critical risks.

**1. Core Functional Scenarios (CRUD Operations):**

*   **Create/Save:**
    *   Create view with valid/invalid filter criteria (e.g., text, numeric, date, dropdowns, empty values).
    *   Save view with unique name, duplicate name (expect error), special characters, max length name.
    *   Apply filters then save; verify the saved view applies correctly.
    *   Verify views created by different user roles/permissions.
    *   "Save As New" functionality (if applicable).
*   **Edit:**
    *   Edit existing filter criteria (add, remove, modify).
    *   Rename a saved view (valid/invalid names).
    *   Save edited view; verify changes persist and apply correctly.
    *   Edit a view and then cancel changes; verify no changes saved.
    *   Edit a view that is currently applied elsewhere (concurrency aspects).
*   **Delete:**
    *   Delete a single view; verify it's removed from the list and no longer applicable.
    *   Delete multiple views (if bulk delete exists).
    *   Attempt to delete a non-existent view (negative).
    *   Verify confirmation prompts are clear and functional.
    *   Check impact if a deleted view was actively applied or shared.

**2. View Management & Application:**

*   **Apply View:**
    *   Apply a saved view; verify correct data set is displayed based on criteria.
    *   Apply different views sequentially.
    *   Clear applied filter/view; verify return to default/unfiltered state.
    *   Apply a view that results in no matching data.
*   **Persistence & State:**
    *   Verify applied views persist across page navigations, browser sessions, or user logins.
    *   Default view functionality (if a user can set one).
*   **Permissions & Sharing:**
    *   Verify users can only see/edit/delete views they own or have permission for.
    *   Test shared views: Creator sharing, recipient viewing/editing (if allowed).
*   **UI/UX:**
    *   Clarity of filter criteria display and view names.
    *   Error messages for invalid operations (e.g., trying to save an invalid filter).
    *   Responsiveness and accessibility across devices/browsers.

**3. Integration & Edge Cases:**

*   **Data Integrity:** Test with large datasets, complex filter logic (AND/OR combinations).
*   **System Performance:** Evaluate load times when applying complex filters, especially with many saved views.
*   **Negative Scenarios:** Invalid inputs, system errors during save/edit/delete, network interruptions.
*   **Regression:** Ensure existing filtering functionality or other related modules are not impacted by changes to custom views.

**Strategy & Metrics:**
I'd prioritize testing critical user flows and data integrity scenarios. We'd track `Requirement Coverage` to ensure all permutations of CRUD operations, permissions, and filter types are addressed. `Test Execution Progress` would be closely monitored. Post-release, `Defect Leakage Rate` specific to this feature would indicate the thoroughness of our pre-release testing, influencing future strategy. A strong `UAT Pass Rate` would confirm end-user satisfaction.

### Speaking Blueprint (3-Minute Verbal Response):

**[The Hook]**
"Validating custom filtering views with save, edit, and delete is absolutely critical. This isn't just about functionality; it directly impacts user productivity, the integrity of business data, and the reliability of crucial insights derived from filtered information. The primary quality risk here is incorrect data presentation, potential data loss if views aren't saved or recalled accurately, or users making decisions based on flawed data, which can have significant business repercussions."

**[The Core Execution]**
"My approach starts with a robust, structured test design, breaking down each CRUD operation – Create, Read, Update, Delete – by user persona, data complexity, and permission levels. We'd map out comprehensive functional test cases for saving new views, meticulously editing existing ones, and safely deleting them, covering positive, negative, and boundary conditions for filter criteria and view names. This requires deep collaboration with Product to clarify every edge case and with Developers to understand the underlying data interactions from a black-box perspective, ensuring we're testing the system's behavior, not just the UI. We also run targeted exploratory sessions to uncover any unforeseen user behaviors or interactions. Our prioritization focuses on the most common user flows and high-impact data scenarios, especially around data persistence and accuracy when views are applied. We closely monitor `Test Execution Progress` and `Requirement Coverage` to ensure comprehensive validation, and use historical `Defect Leakage Rate` data to inform areas needing extra scrutiny. Any critical bugs or performance bottlenecks are immediately escalated to Dev and Product Management for rapid resolution, aiming to minimize our `Defect Reopen Rate` post-release."

**[The Punchline]**
"Ultimately, our quality philosophy is about building user trust and empowering data-driven decisions. By meticulously validating these custom filtering views, we deliver a stable, reliable feature that significantly improves our `UAT Pass Rate`, ensures the system remains a trusted source of truth, and directly contributes to user satisfaction and overall product success."