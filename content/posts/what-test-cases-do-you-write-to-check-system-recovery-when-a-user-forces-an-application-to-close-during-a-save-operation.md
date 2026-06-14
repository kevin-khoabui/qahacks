---
title: "What test cases do you write to check system recovery when a user forces an application to close during a save operation?"
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
This is a critical test scenario for data integrity and user trust. It evaluates how a candidate approaches complex, high-impact functional risks from a manual, strategic perspective, ensuring robust system recovery and minimal data loss.

### Interview Question:
What test cases do you write to check system recovery when a user forces an application to close during a save operation?

### Expert Answer:
Addressing this requires a structured, multi-faceted approach to safeguard data integrity and user experience. My test cases focus on:

1.  **Stateful Save Interruptions:**
    *   **Initiate Save, Force Close (Early):** Begin saving (e.g., `Ctrl+S`), immediately terminate application (e.g., Task Manager, `Alt+F4`, or simulating power off). Upon restart, verify if original data is intact or if a recovery file is created/prompted.
    *   **Initiate Save, Force Close (Mid-way):** Repeat with a larger dataset or slower save process, forcing closure during the perceived middle of the save. Check for partial saves, corrupt files, or complete data rollback.
    *   **Initiate Save, Force Close (Late):** Terminate just as the save progress bar nears completion. Verify final saved state or recovery prompt.
    *   **Auto-Save Interrupt:** If applicable, perform complex operations triggering auto-save, then force close. Verify recovery via auto-save functionality.
    *   **'Save As' Interrupt:** Test interrupting a 'Save As' operation, ensuring the original file remains untouched and the new file is either created cleanly or not at all.

2.  **Data Integrity Verification:**
    *   **Post-Recovery Validation:** After each forced closure, restart the application. Access the file/data. Manually compare content with the expected state (original, partially saved, or fully recovered). Check for data corruption, missing sections, or invalid formatting.
    *   **Metadata Check:** Verify file size, last modified dates, and any versioning information are accurate post-recovery.
    *   **File Openability:** Confirm the recovered file or the original file (if rolled back) opens without errors in the application and other relevant tools.

3.  **User Experience & Error Handling:**
    *   **Recovery Prompt:** Does the application intelligently prompt the user for recovery upon restart? Are options clear (e.g., "Recover unsaved work," "Discard")?
    *   **Error Messages:** If recovery fails or data is corrupted, are informative, user-friendly error messages displayed without crashing?
    *   **UI State Restoration:** Does the application reopen to a sensible state, ideally the last known good state or a dedicated recovery screen?

4.  **Environmental Variables & Edge Cases:**
    *   **Large vs. Small Data:** Test with minimal data changes and extremely large, complex data sets (e.g., large documents, high-res images).
    *   **Resource Constraints:** Simulate low disk space, network interruption (for cloud saves), or high CPU/memory usage during save and forced closure.
    *   **Concurrent Operations:** Attempt other operations (e.g., copy, delete the file; concurrent saves to different files) while saving and forcing closure.
    *   **Different File Types:** Test with various supported file formats.

**Metrics Influence:**
*   **Defect Leakage Rate:** These tests are crucial to prevent critical data loss issues from reaching production, directly impacting customer trust and support costs.
*   **Defect Reopen Rate:** Any identified recovery issues must be thoroughly retested to ensure the fix is robust, preventing re-occurrence and keeping this metric low, indicating effective collaboration with Development.
*   **Requirement Coverage:** We ensure comprehensive coverage of all save/recovery scenarios, especially edge cases identified through collaboration with Product Managers and Business Analysts.
*   **UAT Pass Rate:** A high UAT Pass Rate indicates business users are confident in the system's ability to recover from unexpected interruptions, validating our recovery strategy.

### Speaking Blueprint (3-Minute Verbal Response):

[The Hook]
"When discussing system recovery after a user forces an application to close during a save, we're talking about a critical quality risk that directly impacts data integrity and user trust. This isn't just about an application crashing; it's about potentially losing hours of work, eroding confidence, and increasing support overhead. My focus as a QA Lead is to ensure our system is resilient, even when users perform unexpected actions, transforming potential disasters into recoverable events."

[The Core Execution]
"To tackle this, my team coordinates a deep, structured manual testing strategy. We start by mapping out all save points – auto-save, manual save, 'save as,' and cloud synchronization. Then, for each, we design test cases to interrupt the save at various stages: the beginning, mid-way, and just before completion. We execute these interruptions through methods like Task Manager, `Alt+F4`, or even simulating power loss in controlled environments. We explore edge cases like large files, low disk space, network latency during cloud saves, and concurrent operations. Our validation isn't just about 'does it restart?' It's about 'is the data intact?' We meticulously verify data integrity post-recovery – comparing content, checking file sizes, and ensuring no corruption. This requires close collaboration with Development to understand save mechanisms and with Product Management and Business Analysts to define acceptable recovery states – whether it's a full rollback, a partial save, or a reliable recovery prompt. We track our Test Execution Progress closely and prioritize critical defect fixes, ensuring our Defect Reopen Rate for such issues is negligible. This proactive stance ensures we catch these high-impact bugs before they become customer problems and manage delivery pressure effectively by focusing on the highest risks first."

[The Punchline]
"Ultimately, our quality philosophy here is about anticipating user behavior and designing for resilience. By rigorously testing these recovery scenarios, we significantly reduce our Defect Leakage Rate for critical data issues and bolster our UAT Pass Rate. This translates directly into a more stable product, higher user satisfaction, and reduced operational costs from support tickets related to data loss. We deliver confidence, not just code."