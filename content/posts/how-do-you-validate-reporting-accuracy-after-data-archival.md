---
title: "How do you validate reporting accuracy after data archival?"
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
Validating reporting accuracy post-data archival is a critical challenge, posing significant risks to data integrity and user trust. It requires a meticulous, multi-stage manual testing strategy to ensure that historical data remains accurately accessible and presentable, even after being moved to an archive.

### Interview Question:
How do you validate reporting accuracy after data archival?

### Expert Answer:
Validating reporting accuracy after data archival is a high-stakes manual testing challenge requiring a structured, collaborative approach, especially without code reliance.

1.  **Understand Archival Logic & Impact:**
    *   **Collaboration:** Work closely with Product Managers and Business Analysts to understand the precise archival rules (e.g., data age for archival, specific entities affected, retention policies). Engage Developers to grasp the technical implementation of data movement and how the reporting layer retrieves data from both active and archived stores.
    *   **Scope Identification:** Identify all critical reports, dashboards, and data extracts that utilize data slated for archival. Prioritize these based on business criticality, compliance requirements, and potential financial impact.

2.  **Pre-Archival Baseline (Golden Data Set):**
    *   **Manual Data Capture:** In a controlled test environment, *before* any data archival, execute the identified critical reports. Manually capture comprehensive baselines – screenshots of key reports, exported CSVs, and summary totals. This "golden data set" is crucial for post-archival comparison.
    *   **Focus Areas:** Capture reports covering various date ranges: entirely within active data, spanning the anticipated archival date, and entirely within what will become archived data.

3.  **Post-Archival Validation Strategy:**
    *   **Execution in Test Environment:** Trigger the data archival process in the test environment.
    *   **Re-execute & Compare:** Re-run the *exact same* reports and queries as the baseline. Manually compare the new results against the "golden data set." This involves:
        *   **Row Count Verification:** Do the total number of records match for historical reports?
        *   **Aggregate Sums:** Are key totals (e.g., revenue, transaction counts) identical for corresponding periods?
        *   **Record Integrity:** Are specific historical records still present or absent as expected?
        *   **Filter/Date Range Validation:** Conduct extensive exploratory testing on report filters and date pickers, especially those that cross the archival boundary. Does selecting a range from last year (now archived) and this year (active) correctly combine data?
    *   **Boundary Testing:** Pay special attention to reports querying data exactly at the archival cut-off date.
    *   **Functional & Exploratory Testing:** Beyond static comparisons, perform exploratory testing on report drill-downs, export functionalities, and how archived data impacts performance or load times.

4.  **Risk Mitigation & Metrics:**
    *   **Phased Rollout (if applicable):** Suggest a phased archival for high-risk data if feasible, allowing smaller validation cycles.
    *   **Stakeholder Communication:** Maintain open communication with Dev, PM, and BA teams regarding findings and potential risks, especially under delivery pressure.
    *   **Metrics Integration:**
        *   **Requirement Coverage:** Ensure 100% coverage for all identified critical reports, confirming all archival scenarios are tested. Low coverage here indicates significant risk.
        *   **Defect Leakage Rate:** Aim for zero defect leakage post-release for archival reporting issues; these are often critical. A high rate indicates systemic testing gaps.
        *   **Defect Reopen Rate:** Monitor closely for archival-related defects. A high reopen rate suggests incomplete fixes or regression.
        *   **UAT Pass Rate:** A robust UAT phase with business users validating archival reports is crucial. A low UAT pass rate demands immediate re-evaluation of the archival strategy.
        *   **Test Execution Progress:** Track closely to ensure validation activities are on schedule and provide timely feedback to the team, managing release readiness.

This structured, evidence-based manual validation, driven by cross-functional collaboration, ensures confidence in reporting accuracy post-archival, crucial for maintaining data integrity and business trust.

### Speaking Blueprint (3-Minute Verbal Response):

**[The Hook]**
"Validating reporting accuracy after data archival is one of the most critical, yet often underestimated, testing challenges we face in maintaining data integrity. The core risk here isn't just a minor bug; it's the potential for inaccurate historical data, which directly impacts user trust, regulatory compliance, and critical business decisions. If our historical reports become unreliable post-archival, it can lead to significant reputational damage or even legal issues, making this a paramount area for quality assurance."

**[The Core Execution]**
"My strategy begins with deeply collaborating with Product and Development teams to establish a clear understanding of the exact archival rules, data retention policies, and to precisely identify all impacted reports – especially those for financial reconciliation or regulatory compliance. We'd map out the data flow and, crucially, create a 'golden dataset.' This involves running all identified critical reports in a controlled test environment *before* any archival, meticulously capturing baselines – screenshots, summary totals, and exported data. Post-archival, we trigger the process, then re-execute the *exact same* reports. My team and I manually compare every detail against our golden baseline for data consistency, aggregate totals, and record presence. This involves structured test cases covering various date ranges and extensive exploratory testing on filters that span the archival boundary. Given delivery pressure, we prioritize reports based on business criticality, ensuring high **Requirement Coverage** for core functionalities. We also proactively manage risks by involving Business Analysts in early review and aim for a high **UAT Pass Rate**. Tracking **Test Execution Progress** rigorously ensures we're on schedule and we focus on catching issues early to minimize **Defect Leakage Rate** for such sensitive data."

**[The Punchline]**
"Ultimately, my philosophy here is about proactive risk mitigation and maintaining absolute data integrity. By meticulously validating these reports through structured manual testing and fostering strong cross-functional collaboration, we don't just ensure the quality of our data; we reinforce user confidence, which is paramount for any enterprise system, safeguarding against costly post-release defects and ensuring smooth, trustworthy operations."