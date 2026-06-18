---
title: "How do you verify reporting accuracy after data migrations?"
difficulty: "Advanced"
target_role: ["Manual_QA_Engineer"]
category: ["Technical"]
sub_category: "Strategy"
question_type: "Situational"
core_testing_type: "Manual"
domain: "Enterprise-Software"
platform: "Cross-platform"
tool_stack: "Generic"
leadership_competency: "Risk Mitigation"
interview_focus: "Delivery Pressure"
tags: ["manual-testing", "qa-lead", "interview-prep", "test-leadership"]
---

## Overview
Verifying reporting accuracy post-data migration is critical, as it directly impacts business intelligence and decision-making. This challenge requires a structured manual testing approach focusing on data integrity, report logic, and user acceptance to mitigate significant business risks.

### Interview Question:
How do you verify reporting accuracy after data migrations?

### Expert Answer:
Verifying reporting accuracy post-data migration is a high-stakes task demanding a structured, collaborative, and risk-based manual testing strategy.

**1. Strategic Planning & Preparation:**
*   **Understand Scope:** Collaborate with Product Managers and Business Analysts to identify all impacted reports, their criticality (e.g., financial, regulatory), and underlying business rules.
*   **Data Mapping & Dictionary:** Review source-to-target data mapping documents and data dictionaries to understand transformations and potential data loss/truncation.
*   **Baseline Reports:** Obtain pre-migration reports from the source system. These serve as the 'gold standard' for comparison.
*   **Sampling Strategy:** Define a targeted data sampling approach. This includes:
    *   **Critical Data Sets:** High-volume, high-value, or legally sensitive data.
    *   **Edge Cases:** Null values, maximum/minimum values, special characters, zero counts.
    *   **Random Samples:** Representative subsets across different categories/time periods.
    *   **Complex Scenarios:** Data combinations that trigger intricate business logic in reports.
*   **Requirement Coverage:** Ensure every critical report requirement has corresponding test cases to achieve high **Requirement Coverage**.

**2. Manual Execution & Validation:**
*   **Direct Data Reconciliation (Sample-Based):**
    *   Manually compare a statistically significant sample of source records against their corresponding migrated target records, focusing on key fields that feed reports (e.g., date, amount, status).
    *   For aggregated reports, manually recalculate totals, averages, and counts for a small sample set in the target system and compare with expected values or source aggregates. This might involve using basic spreadsheet tools for pivot tables.
*   **Report Output Validation:**
    *   Run critical reports on the target system using the migrated data.
    *   Visually compare the generated reports against the baselined pre-migration reports for structure, formatting, data values, filters, subtotals, and grand totals.
    *   Verify report parameters, date ranges, and filter conditions are correctly applied and reflect migrated data.
*   **Business Logic Verification:**
    *   Focus on reports with complex calculations, conditional logic, or grouping. Manually trace a few sample records through the report's logic to confirm correct application of rules on migrated data.
*   **Exploratory Testing:** After structured test cases, perform exploratory testing to uncover unexpected data rendering issues or performance bottlenecks (from a user's perspective) that might impact report usability.

**3. Risk Mitigation & Collaboration:**
*   **Prioritization:** Prioritize testing based on report criticality and business impact. High-impact reports get the deepest scrutiny.
*   **Defect Management:** Log and track any discrepancies immediately. Categorize defects by severity and collaborate with developers for timely resolution. Monitor **Defect Reopen Rate** to ensure fixes are robust and don't introduce new data inconsistencies.
*   **UAT Facilitation:** Crucially, involve Business Analysts and end-users in User Acceptance Testing (UAT). Their business expertise is invaluable for validating report accuracy and trust. A high **UAT Pass Rate** is a strong indicator of successful migration.
*   **Communication:** Maintain transparent communication with Product Managers and stakeholders on **Test Execution Progress**, risks, and readiness. If **Defect Leakage Rate** from previous migrations was high, this testing phase warrants extra diligence and communication.

This phased approach, heavily reliant on structured manual validation and cross-functional collaboration, helps ensure reporting accuracy and builds trust in the new system's data integrity.

### Speaking Blueprint (3-Minute Verbal Response):

**[The Hook]**
"Verifying reporting accuracy after data migrations is, frankly, one of the most critical and challenging aspects of any migration project. The inherent risk is profound: if our reports are inaccurate, our business decisions become flawed, potentially leading to significant financial or operational impact. My primary goal here is to establish absolute confidence in the integrity of that migrated data when it’s presented to stakeholders and decision-makers."

**[The Core Execution]**
"My strategy begins with intense collaboration upfront. I work closely with Product Managers and Business Analysts to meticulously identify all critical reports – particularly financial, regulatory, and high-volume operational ones. We define a comprehensive data sampling strategy, focusing on not just random samples, but also edge cases, high-value data, and complex business scenarios, which ensures strong **Requirement Coverage**. Pre-migration, we baseline these critical reports from the source system; these become our 'gold standard.'

During execution, my manual QA team performs multi-faceted validation. We manually reconcile sample data at the record level – comparing source and target values for key fields. For aggregated reports, we go deeper: we'll manually recalculate sums, averages, and counts for a subset of data on the target system, then compare those against our expected values. We then run the full reports on the target system, visually comparing their structure, data, filters, and totals against our baselined reports. Crucially, we meticulously verify the underlying business logic, tracing how migrated data flows through complex calculations within the reports.

To manage delivery pressure and risk, we prioritize testing based on business impact. Any discrepancies found are logged immediately, tracked, and discussed directly with the development team. We monitor **Defect Reopen Rate** to ensure fixes are robust, and we provide daily updates on **Test Execution Progress**. Our ultimate success heavily relies on a high **UAT Pass Rate**, for which I facilitate comprehensive User Acceptance Testing with business users, leveraging their expertise to sign off on report accuracy and build trust in the migrated system."

**[The Punchline]**
"Ultimately, my quality philosophy for data migrations is proactive vigilance. By combining structured manual validation, targeted data reconciliation, and relentless communication with stakeholders, we not only identify and mitigate risks early but also build a robust foundation of confidence in our reporting. This ensures that when the system goes live, our leadership and teams can rely on accurate data to make informed decisions, directly contributing to business continuity and success."