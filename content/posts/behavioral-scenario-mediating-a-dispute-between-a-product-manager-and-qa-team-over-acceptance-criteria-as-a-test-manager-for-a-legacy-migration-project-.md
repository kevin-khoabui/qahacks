---
title: 'Mediating Product-QA Conflicts During Legacy Migrations'
difficulty: 'Advanced'
target_role: 'QA_Manager'
category: 'Analytical_Behavioral'
sub_category: 'Strategy'
question_type: 'Code-challenge'
core_testing_type: 'Functional'
domain: 'E-commerce'
platform: 'Web'
tool_stack: 'None'
tags: ['testing', 'interview-prep', 'qa-interview']
---

## Overview
Legacy migrations often trigger friction when Product Managers prioritize feature parity while QA teams emphasize risk and edge-case coverage. This scenario tests your ability to balance velocity with engineering rigor through objective, data-driven negotiation.

### Interview Question:
How do you mediate a dispute between a PM and your QA team regarding acceptance criteria during a high-stakes legacy migration project?

### Expert Answer:
When disagreements arise, I shift the focus from **opinions to risk-based outcomes.** My strategy involves three pillars:

*   **De-escalate with Data:** I facilitate a session to map the disputed criteria against the migration’s risk profile. We categorize requirements by "Critical Business Impact" versus "Nice-to-have legacy behavior."
*   **Establish a "Definition of Ready":** I work with the PM to enforce an objective grooming process. If criteria are ambiguous, we pause to define concrete success metrics—usually focusing on automated regression coverage for the core business flow.
*   **The "Split-Strategy":** If the deadlock persists, I propose a phased approach: deploy the core critical path that fulfills the primary criteria, while moving disputed edge cases into a "Phase 2" backlog with explicit sign-off from stakeholders.

**Key takeaway:** As a manager, my role isn't to pick a side; it is to ensure the team produces **defensible quality.** I bridge the gap by translating "QA pushback" into "Business risk mitigation," ensuring both parties feel heard while keeping the migration timeline on track.

### Speaking Blueprint (3-Minute Verbal Response):

[The Hook] 
In my experience, disputes between Product and QA during a legacy migration aren't really about the features—they are almost always about the fear of the unknown. When a PM wants speed and QA wants perfect coverage, the tension is actually a sign of a healthy project; my job is to channel that tension into a unified risk strategy.

[The Core Execution] 
First, the way I look at this is that we need to remove the emotional friction by grounding our arguments in data. I would immediately pull both parties into a session to perform a risk-impact analysis. We aren't arguing about "what to test" anymore; we are mapping every disputed acceptance criterion against actual revenue and system stability metrics. 

This directly drives us to the next point, which is creating a shared language. If we are struggling with definitions, it means our grooming process is too loose. I would implement a "Definition of Ready" that forces the PM to define success in terms of automated regression targets, which moves the goalpost from a vague "it works" to a measurable "it passes these specific assertions." 

Now, to make this actionable, if we are still at an impasse, I use a phased release strategy. I’ll negotiate to deliver the mission-critical path for the migration on time, while taking the disputed, lower-risk items and moving them into a post-launch backlog. We actually ran into a similar scenario where the PM wanted to ship with 90% parity, but the team felt 100% was required. By showing the PM the specific business cost of the missing 10%—the "unknowns" in the legacy code—the PM shifted from feeling "blocked" to feeling "informed," allowing them to make a calculated decision they could defend to stakeholders.

[The Punchline] 
Ultimately, my engineering philosophy here is simple: you cannot manage what you cannot measure. By transforming subjective disputes into objective risk assessments, I ensure that the enterprise isn't just shipping code quickly, but shipping with the confidence that the migration won't break the business bottom line.