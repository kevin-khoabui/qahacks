---
title: "What test cases do you design to verify compliance with basic accessibility standards like keyboard navigation and contrast?"
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
This question assesses a candidate's practical manual testing skills for accessibility and their strategic thinking as a QA Lead. It highlights their ability to manage quality risks, coordinate cross-functional teams, and ensure delivery readiness for an inclusive product.

### Interview Question:
What test cases do you design to verify compliance with basic accessibility standards like keyboard navigation and contrast?

### Expert Answer:
To verify basic accessibility for keyboard navigation and contrast, my test case design focuses on critical user workflows and high-impact UI components, ensuring comprehensive manual validation.

**Keyboard Navigation Test Cases:**
1.  **Logical Tab Order:**
    *   Verify that pressing `Tab` key moves focus sequentially and predictably through all interactive elements (links, buttons, form fields, modal controls) on a page, aligning with visual flow and reading order.
    *   *Risk Mitigation:* Prioritize complex forms, dynamic content, and multi-step processes.
2.  **Visible Focus Indicator:**
    *   Confirm that a clear, visible focus indicator (e.g., outline, highlight) consistently appears around the currently focused element upon keyboard interaction.
    *   *Risk Mitigation:* Test against different browser defaults and custom CSS styles to prevent regressions.
3.  **Operable Elements:**
    *   Ensure all interactive elements (buttons, dropdowns, checkboxes, radios, sliders) can be activated or manipulated using standard keyboard keys (`Enter`, `Space`, arrow keys).
    *   *Risk Mitigation:* Crucial for forms, transactional flows, and interactive widgets.
4.  **No Keyboard Traps:**
    *   Verify that focus can always be moved *away* from any UI component (e.g., modals, embedded content) using standard keyboard commands (`Tab`, `Shift+Tab`, `Esc`).
5.  **Contextual Navigation:**
    *   For complex widgets (e.g., carousels, data tables with sortable columns, nested menus), verify that arrow keys provide expected internal navigation without losing overall page focus.

**Contrast Test Cases:**
1.  **Text & Background Contrast:**
    *   Visually inspect critical text (headings, body, links, labels) against its background to ensure sufficient contrast. While primarily manual, I leverage browser developer tools (e.g., Lighthouse, Accessibility pane's color picker) for quick WCAG 2.x AA ratio checks.
    *   *Risk Mitigation:* Prioritize mission-critical content, calls-to-action, and instructional text.
2.  **Non-Text Elements Contrast:**
    *   Verify that essential graphical objects (icons conveying information, UI component states like focus outlines, active buttons, borders delineating interactive regions) have adequate contrast with their surroundings.
    *   *Risk Mitigation:* Early collaboration with Design on color palettes and icon usage is key.
3.  **State Changes:**
    *   Confirm hover, focus, and active states maintain adequate contrast for both text and non-text interactive elements, preventing temporary readability issues.

**Execution Strategy & Leadership Role:**
My approach involves integrating these tests into regular sprint cycles. I coordinate with Product Managers and Designers to embed accessibility acceptance criteria into user stories, directly influencing our **Requirement Coverage**. Early testing on new features significantly reduces potential **Defect Leakage Rate**. When critical accessibility issues are identified, I collaborate with Developers and Product to prioritize fixes, often initiating discussions around a "Definition of Done" that includes accessibility. I track **Test Execution Progress** for accessibility-specific passes, using these metrics to report on quality health. Any regression related to accessibility impacts **Defect Reopen Rate**, signaling a need for improved regression coverage or targeted developer training. During User Acceptance Testing (UAT), I'd specifically solicit feedback for accessibility concerns, directly influencing the **UAT Pass Rate** and ensuring the end-user experience is inclusive. This holistic strategy mitigates risks, drives team accountability, and ensures delivery of an inclusive, high-quality product.

### Speaking Blueprint (3-Minute Verbal Response):

[The Hook]
"When it comes to accessibility, specifically keyboard navigation and contrast, the core challenge is not just meeting a checklist, but ensuring true usability for *all* our users. The risk of neglecting these basic standards is significant: exclusion of a user segment, potential legal non-compliance, and ultimately, a compromised user experience that erodes trust and impacts our product's reach. As a QA Lead, my priority is to proactively prevent accessibility issues from becoming critical blockers or, worse, production defects, which impact our **Defect Leakage Rate**."

[The Core Execution]
"My strategy begins by integrating accessibility testing *early* into our development lifecycle, not as an afterthought. For keyboard navigation, we design specific test cases to systematically check logical tab order, clear focus indicators across all interactive elements, and verify full keyboard operability for forms, buttons, and complex widgets – importantly, ensuring no keyboard traps. For contrast, we manually inspect critical text and non-text elements, leveraging browser tools for quick ratio checks, and validating that focus and hover states maintain sufficient contrast.

As a Lead, I coordinate closely with our designers to address contrast concerns in early mockups, and with developers to embed accessibility attributes correctly from the start. This proactive collaboration significantly improves our **Requirement Coverage** for accessibility. I manage **Test Execution Progress** by dedicating specific passes and tracking defects diligently. If we see a high **Defect Reopen Rate** for accessibility issues, it signals a need for targeted developer education or improved regression suites. I also leverage **UAT Pass Rate** feedback to gauge real-world usability from diverse users. This continuous feedback loop ensures we're building the right thing, correctly."

[The Punchline]
"Ultimately, my quality philosophy is about prevention and collaboration. By embedding accessibility into our 'Definition of Done' and treating it as a core functional requirement, we significantly reduce quality risks. This structured, collaborative approach doesn't just meet compliance; it delivers a robust, inclusive product that enhances our brand reputation and broadens our user base, truly driving release readiness with confidence and measurable impact."