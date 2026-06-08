---
title: 'Mastering Stakeholder Alignment: Resolving QA and PM Conflicts in Legacy Migrations'
difficulty: 'Advanced'
target_role: 'QA_Lead'
category: 'Analytical_Behavioral'
sub_category: 'Methodology'
question_type: 'Code-challenge'
core_testing_type: 'Functional'
domain: 'E-commerce'
platform: 'Web'
tool_stack: 'None'
tags: ['testing', 'interview-prep', 'qa-interview']
---

## Overview
Disputes over acceptance criteria during legacy migrations often stem from a misalignment between technical debt visibility and business feature requirements. Effective QA leadership requires reconciling these perspectives by translating risk into objective, data-driven decisions.

### Interview Question:
How would you resolve a deadlock between your QA team and a Product Manager over rigid acceptance criteria for a high-risk legacy migration project?

### Expert Answer:
In a legacy migration, friction often arises because QA views acceptance criteria (AC) through the lens of **system integrity**, while Product Managers (PMs) prioritize **feature parity**. To resolve this, I employ a three-step framework:

*   **Evidence-Based Risk Assessment:** Shift the conversation from subjective opinions to objective data. If QA deems criteria as "insufficiently detailed," I request a impact analysis showing exactly what edge cases in the legacy system are being ignored.
*   **The "Gap Analysis" Workshop:** Bring stakeholders together to map the legacy behavior versus the proposed migration AC. We categorize requirements as "Essential Parity," "Business Logic Enhancements," or "Technical Debt."
*   **Tiered Acceptance Strategy:** If consensus stalls, propose a phased approach. Negotiate a "Minimum Viable Integrity" baseline for the initial migration phase, while documenting remaining concerns as "Technical Debt Items" for a fast-follow sprint. This protects the release date without compromising long-term stability.

**Core Philosophy:** My role is not to be a "gatekeeper" of requirements, but a "risk navigator." By mapping technical debt to potential business loss, I provide the PM with the transparency needed to make an informed business decision, effectively turning a conflict into a collaborative prioritization exercise.

### Speaking Blueprint (3-Minute Verbal Response):

[The Hook] 
"Conflict between QA and Product isn't a sign of dysfunction; it’s a sign that we’re doing our jobs. In a legacy migration, that tension is usually a clash between the urgency of the release and the reality of the technical debt we are inheriting, and I view my role as the bridge between those two worlds."

[The Core Execution] 
"First, the way I look at this is by taking the emotion out of the room. When my team and the PM hit a wall, I immediately pivot to a 'Risk-Impact' framework. I ask the team to document exactly which legacy edge cases are at risk. Then, I sit down with the PM to map those risks against the product roadmap. 

This directly drives us to the next point: creating a middle ground. I’ve found that most 'rigid' criteria disputes are actually about uncertainty. I’ll propose a 'Tiered Acceptance' approach. We identify what is mission-critical for a successful migration and what can be managed as technical debt in the next sprint. Now, to make this actionable, I facilitate a rapid, time-boxed working session where we label requirements as 'High-Integrity' versus 'Iterative.' This forces everyone to own the trade-offs. We actually ran into a similar scenario where we were migrating a payment engine; by categorizing the legacy bugs versus new features, we successfully launched the core migration on time while flagging the remaining edge cases for a dedicated patch release."

[The Punchline] 
"Ultimately, my job as a lead isn't to say 'yes' or 'no'—it’s to provide the visibility that allows the product team to make an informed business decision. When we stop being blockers and start being risk-advisors, the entire organization stops seeing QA as a hurdle and starts seeing us as the guardians of their product’s success."