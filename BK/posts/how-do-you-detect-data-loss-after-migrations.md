---
title: "How do you detect data loss after migrations?"
difficulty: "Advanced"
target_role: ["Manual_QA_Engineer"]
category: ["Analytical_Behavioral"]
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
Detecting data loss after migrations is a critical, high-stakes testing challenge that demands meticulous planning and execution. The primary risk is undetected data integrity issues directly impacting business operations and user trust, requiring a structured approach focusing on manual validation through the user interface and reports.

### Interview Question:
How do you detect data loss after migrations?

### Expert Answer:
Detecting data loss post-migration, especially without code, requires a structured, risk-based approach leveraging deep functional understanding and collaboration.

1.  **Pre-Migration Planning & Baseline (Manual & Collaboration Focused):**
    *   **Requirement Coverage:** Partner with Product Managers and Business Analysts early to thoroughly understand critical data elements, source-to-target mapping, and any transformation rules. Identify high-risk data (e.g., financial, user profiles, transactional) and edge cases. This ensures high `Requirement Coverage` for data integrity.
    *   **Test Data Selection:** Curate representative test data sets from the source system. This includes small, medium, large datasets, and specific problematic records.
    *   **Baseline Validation:** Manually verify key data points, record counts, and aggregate sums within the *source* system through existing reports or UI. Take screenshots, record values. This forms our critical comparison baseline.

2.  **Post-Migration Validation & Execution (Manual & Exploratory):**
    *   **Spot Checks & Sample Verification:** Immediately after migration, perform targeted manual checks on high-value, frequently accessed data through the target system's UI. Compare these against the pre-migration baseline.
    *   **Count & Sum Validation:** Systematically verify total counts of critical entities (e.g., number of users, products, orders) and aggregate sums (e.g., total sales, user balances) using the UI or accessible reports.
    *   **Functional & Exploratory Testing:** Execute functional test cases that manipulate migrated data, ensuring it behaves as expected. Conduct exploratory testing, particularly in areas prone to transformation issues (e.g., data types, character limits, relationships). This helps uncover unexpected truncation or corruption.
    *   **Data Integrity Checks:** Manually validate relationships between entities, unique constraints, and mandatory field integrity by attempting to create/modify records via the UI.
    *   **UAT Guidance:** Closely support and guide User Acceptance Testing (UAT). Business users are essential for validating their critical business data and flows. A high `UAT Pass Rate` here indicates business confidence in data integrity.

3.  **Risk Mitigation, Metrics & Reporting (Leadership & Delivery):**
    *   **Defect Management:** Document every data discrepancy meticulously, including before/after values and location. Collaborate with developers and DBAs to diagnose root causes. Monitor `Defect Reopen Rate` to ensure fixes are sustainable.
    *   **Communication:** Proactively communicate progress and risks to PMs and developers. Highlight potential business impact of found data loss.
    *   **Release Readiness:** Use `Test Execution Progress` against data validation scenarios to gauge readiness. Aim for a minimal `Defect Leakage Rate` post-production to ensure our pre-release detection was effective.

### Speaking Blueprint (3-Minute Verbal Response):

**[The Hook]**
"Detecting data loss after migrations is one of the highest-stakes challenges we face in QA, particularly when our primary tools are manual observation and deep functional analysis rather than direct code or database queries. The core challenge isn't just identifying missing records; it's about validating the *integrity and usability* of critical business data through the user experience. An undetected data loss can directly impact revenue, customer trust, and operational efficiency, making meticulous manual verification absolutely critical."

**[The Core Execution]**
"My strategy starts long before the migration even begins, with intense collaboration. I partner extensively with Product Managers and Business Analysts to achieve deep `Requirement Coverage`. We define what constitutes critical data, understand every source-to-target mapping, and detail all transformation rules. From there, we meticulously prepare by selecting representative test data sets and, crucially, establishing a manual 'baseline' in the source system – verifying key counts, sums, and specific record details through reports or the UI.

Post-migration, our manual execution focuses on rigorous validation. We prioritize targeted spot checks on high-value data through the UI, directly comparing against our pre-migration baselines. We systematically verify aggregate counts and sums, ensuring the overall data picture is consistent. Beyond this, we dive into exploratory testing, actively looking for unexpected data truncation, corruption, or broken relationships that might not be immediately obvious. We also heavily support and guide the UAT process, as business users are the ultimate validators of their data flows. We use `Test Execution Progress` to track our validation completion, and if we encounter discrepancies, we document them meticulously, ensuring clear communication with Development and Product on impacts and resolution. Our goal is to ensure a high `UAT Pass Rate` before go-live, signifying business confidence."

**[The Punchline]**
"Ultimately, my philosophy here is one of proactive risk mitigation and absolute data trustworthiness. It's about ensuring every piece of migrated data makes sense *from a business perspective* and functions correctly through the user interface. By combining diligent manual execution with strong cross-functional collaboration and transparent reporting, we aim to minimize `Defect Leakage Rate` post-release, protecting our product's stability and our users' trust. This structured approach helps us deliver confidence in our migrations and contributes directly to the overall quality and reliability of our platform, aiming for a near-zero `Defect Reopen Rate` for any identified data issues."