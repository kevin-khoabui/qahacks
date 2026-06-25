---
title: "How do you report a blocked issue in a project?"
difficulty: "Junior" 
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
Reporting a blocked issue effectively is critical for maintaining testing velocity and mitigating release risks. It showcases a tester's ability to not only identify problems but also to coordinate with the team to ensure timely resolution and safeguard delivery quality.

### Interview Question:
How do you report a blocked issue in a project?

### Expert Answer:
Reporting a blocked issue demands a structured, proactive, and collaborative approach to minimize impact on `Test Execution Progress` and `Release Readiness`. My process involves:

1.  **Immediate Verification & Impact Assessment:** First, I thoroughly confirm the blockage, ensuring it's not a misunderstanding or environmental anomaly. I then quickly assess its scope: Is it blocking a critical user flow, preventing progress on multiple test cases, or affecting an entire feature? This determines its severity and priority. A critical blockage directly impacts our `Requirement Coverage` for that release.

2.  **Formal Reporting (Defect/Blocker Ticket):**
    *   **Creation:** I immediately create a detailed defect or blocker ticket in our project management tool (e.g., Jira, Azure DevOps – though I don't need a specific tool name to describe the process).
    *   **Content:** The ticket includes:
        *   **Clear Title:** Succinctly stating the problem (e.g., "Login Page Inaccessible, Blocking Core Workflow").
        *   **Steps to Reproduce:** Concise, repeatable steps.
        *   **Expected vs. Actual Results:** What should happen vs. what's happening.
        *   **Environment Details:** Browser, OS, build version, data used.
        *   **Visuals:** Screenshots or short video recordings.
        *   **Severity & Priority:** Set to highest appropriate level (e.g., Blocker/Critical).
        *   **Linked Items:** Connect to the related user story, feature, or epic to show its direct impact.
        *   **Affected Test Cases:** List specific test cases that cannot proceed, highlighting impact on `Test Execution Progress`.

3.  **Proactive Communication & Coordination:**
    *   **Immediate Stakeholder Notification:** Beyond the ticket, I use real-time communication channels (e.g., Slack, Teams) to alert the responsible Developer, Tech Lead, Product Manager, and my QA Lead. I briefly explain the issue and its immediate impact on testing activities.
    *   **Daily Stand-ups:** I ensure the blocked issue is highlighted during daily stand-ups, emphasizing its potential to delay delivery or affect `UAT Pass Rate`.
    *   **Collaboration:** I actively work with the developer to provide any further information, troubleshoot, or verify potential fixes.

4.  **Risk Mitigation & Alternative Strategies:**
    *   **Identify Workarounds:** Can any part of the testing proceed using a temporary workaround?
    *   **Re-prioritize Testing:** If possible, I shift focus to unblocked areas of the application to maintain `Test Execution Progress` on other features. This strategic pivot helps prevent a single blocker from halting all QA efforts.
    *   **Escalation:** If the issue is critical and resolution is delayed, I escalate it to my QA Lead or project management, clearly articulating the risk to `Release Readiness` and potential for increased `Defect Leakage Rate` if not addressed promptly.

This comprehensive approach ensures visibility, facilitates rapid resolution, and minimizes the overall risk to project quality and delivery timelines.

### Speaking Blueprint (3-Minute Verbal Response):

**[The Hook]**
"When a critical test scenario is blocked, it's not just a simple pause in testing; it's a direct threat to our **Test Execution Progress** and, ultimately, our **Release Readiness**. My immediate concern is preventing this blockage from becoming a bottleneck that impacts our overall **Requirement Coverage** and potentially increases our **Defect Leakage Rate** downstream. It's about quickly understanding the quality risk."

**[The Core Execution]**
"My strategy for reporting a blocked issue involves a structured, multi-pronged approach. First, upon identifying a block, I immediately verify it thoroughly, ruling out any environmental quirks, and then quickly assess its impact – is it blocking a core user flow? How many test cases are truly stalled? This assessment determines its severity.

Next, I formally document it in our project management tool, creating a detailed 'Blocker' issue. This isn't just a basic bug report; it includes clear, reproducible steps, expected versus actual results, relevant environment details, screenshots, and critically, links to all affected user stories and test cases. This detail is vital for the development team.

Concurrently, I initiate real-time communication. I don't wait for the ticket to be seen; I'll send a quick message to the responsible developer, the Tech Lead, and the Product Manager, explaining the blockage and its immediate effect on our current testing efforts. During daily stand-ups, I ensure it's highlighted, providing a concise update on its status and the impact it's having on our sprint goals and our ability to meet **UAT Pass Rate** targets.

While waiting for a fix, I proactively look for alternative testing paths or workarounds to keep momentum where possible. If a critical block persists, I escalate, clearly articulating the potential delay to delivery and the increased risk to product quality if not resolved quickly. This ensures no stone is left unturned in unblocking progress."

**[The Punchline]**
"My philosophy is that a blocked issue is a team problem. Effective, transparent communication and proactive risk assessment are key to minimizing its impact. By quickly identifying, reporting with detail, and coordinating its resolution across the team, we not only unblock testing but maintain our momentum towards a high-quality, on-time delivery. It's about preserving our commitment to delivering value and quality without compromising delivery speed or introducing unnecessary **Defect Reopen Rate** cycles."