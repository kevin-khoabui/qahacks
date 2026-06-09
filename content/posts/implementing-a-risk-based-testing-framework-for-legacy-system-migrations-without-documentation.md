---
title: 'Risk-Based Testing Strategies for Undocumented Legacy Migrations'
difficulty: 'Advanced'
target_role: 'QA_Lead'
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
Migrating legacy systems without documentation creates a "black box" scenario where the risk of business disruption is high. A risk-based strategy shifts focus from exhaustive testing to identifying and validating the most critical business-impacting flows first.

### Interview Question:
How do you implement a risk-based testing framework when migrating a legacy system that has zero documentation and high technical debt?

### Expert Answer:
When documentation is absent, the system's behavior becomes the source of truth. My approach relies on **Discovery, Prioritization, and Validation**:

*   **System Discovery (Observability):** Since docs are missing, I leverage log analysis, database query patterns, and network traffic monitoring to map actual system usage. I focus on identifying high-frequency endpoints and critical data paths.
*   **Stakeholder-Led Prioritization:** I conduct "walkthrough" sessions with long-tenured engineers and product owners to map the "Happy Path" and identify the most catastrophic failure modes (e.g., payment processing or inventory sync).
*   **Differential Testing:** I implement a "Black-Box Parity" strategy. By capturing inputs and outputs of the legacy system and replaying them against the new system, I can programmatically verify functional equivalence without needing internal documentation.
*   **Incremental Risk Mitigation:** I prioritize testing based on the "Cost of Failure" metric. Low-risk UI elements are deprioritized in favor of rigorous testing of backend logic, data integrity, and API contracts.

This framework transforms an unmanageable migration into a series of verifiable, low-risk milestones that prioritize business continuity over full-system coverage.

### Speaking Blueprint (3-Minute Verbal Response):

[The Hook] Migration of undocumented legacy systems is never a technical problem; it is a forensic archeology project where the primary goal is protecting revenue by isolating critical failure points before they manifest in production.

[The Core Execution] First, the way I look at this is to treat the legacy system as a black box. Since I cannot rely on specs, I start by mining system logs and database activity to identify the "hot paths"—the features that users and external systems actually touch every day. This directly drives us to the next point, which is cross-functional collaboration. I bring in the veterans who built or maintained the system to define the "crown jewels," or the business logic that simply cannot break. Now, to make this actionable, I implement a strategy of differential testing. We capture actual production traffic logs from the legacy environment and replay them against the new build to create a parity map. This gives us an objective baseline of behavior. We actually ran into a similar scenario where a lack of documentation almost derailed a database migration; by shifting our testing focus to these high-frequency API contracts instead of trying to map the entire UI, we identified three critical logic regressions in the first week.

[The Punchline] Ultimately, my philosophy is that we don't test for perfection—we test for survival. By focusing our limited resources on the highest-risk areas identified through usage data rather than guessing at documentation, we turn a high-stakes migration into a controlled, predictable, and de-risked release cycle that guarantees business value.