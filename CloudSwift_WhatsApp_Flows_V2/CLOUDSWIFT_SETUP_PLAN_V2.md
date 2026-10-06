# CloudSwift WhatsApp Automation — V2 Implementation Plan

## Status
Proposed V2 build. The customer journey can be implemented now. Exact commercial scoring weights and service-specific opportunity thresholds remain configurable until CloudSwift sales validates them.

## 1. Entry and requirement capture
1. Receive inbound WhatsApp message.
2. Store WhatsApp number, profile name (when available), source/campaign metadata and first message.
3. Send `02-flow-service-picker-v2`.
4. Store the selected requirement.
5. Offer **Continue** or **Talk to specialist**.

### Requirement values
- Cloud Migration / Modernisation
- Managed Cloud / Support
- Cloud Cost / FinOps
- Security / Compliance
- Microsoft 365 / Dynamics
- AI / Automation
- Something else

## 2. Human-request path
A request to talk to a specialist is a **high human-intent signal**, not automatic proof that the account is commercially qualified.

- Capture missing contact details.
- Create a sales-review alert.
- Include selected requirement and all known context.
- Pause automation once a human accepts the chat.

## 3. Qualification
Send `03-flow-qualification-v2`.

Collect:
1. Trigger — why they reached out.
2. Timeline — when they need action.
3. Role — their position in the evaluation/decision.
4. Context — one dynamic question based on the selected requirement.

### Important change
**Remove:** `500+ employees → always HOT`.

Company/account size can contribute to fit after enrichment, but it must not erase intent or urgency information.

## 4. Assessment model
Maintain three independent dimensions:

### Fit
Does the account/environment match CloudSwift's commercial and technical scope?

### Intent
Is there evidence of an active problem, project, requirement, dissatisfaction or initiative?

### Urgency
How soon is action required?

Do **not** lock arbitrary percentage weights in the initial build. Store the underlying answers and assessments so thresholds can be changed without rebuilding the customer-facing flow.

## 5. Routing

### High Priority
Use when evidence indicates a meaningful opportunity requiring sales action.

Actions:
- Capture any missing contact details.
- Generate sales brief.
- Notify sales.
- Offer: Book a call / Request callback / Chat now.

### Nurture / Review
Use for relevant accounts where timing or intent does not yet justify immediate sales escalation.

Actions:
- Send requirement-specific resource.
- Ask permission to follow up.
- Day 3: useful proof/resource.
- Day 7: relevant client story / assessment offer.
- Day 21: final low-pressure follow-up.
- Any meaningful positive buying signal → re-assess / sales alert.

### Low Intent / Self-Serve
- Send relevant guide/resource.
- Offer Main menu / Finish.
- Keep return path open.

## 6. Contact details
Use `04-flow-contact-details-v2`.

Required when unknown:
- Full name
- Company
- Work email

Never re-request the WhatsApp number. Reuse reliable stored fields.

## 7. Booking
Use `05-flow-booking-v2`.

The booking step should collect only scheduling information. Do not ask again for name, company or email.

Fallback: configured scheduling link.

## 8. Sales brief
Each escalated lead should include:
- Contact name
- Company
- Work email
- WhatsApp number
- Source/campaign
- Selected requirement
- Trigger
- Timeline
- Role
- Contextual answer
- Fit
- Intent
- Urgency
- Recommended next action
- Conversation link / identifier

## 9. Safety and recovery
- Free text: classify if possible; otherwise flag for review.
- Invalid input: Try again / Talk to specialist / Main menu.
- Drop-off: resume from the last incomplete step.
- `stop`, `unsubscribe`, `cancel`: stop automated nurture.
- Human takeover: pause automation.
- Returning contact: reuse stored information.

## 10. Measurement
Track at minimum:
- Entry → requirement-selection completion.
- Requirement selection → qualification start.
- Qualification completion rate.
- Drop-off by question.
- Human-request rate.
- High-priority rate by requirement/source.
- Sales-accepted lead rate.
- Meeting-booked rate.
- Meeting-held rate.
- Opportunity creation rate.
- Win rate and revenue by requirement/source.
- Nurture → sales escalation rate.

These metrics are what should eventually determine whether the menu, questions and scoring thresholds should change.

## 11. Pending CloudSwift sales validation
These items should be confirmed after/before launch without blocking the V2 UX build:
1. Highest-priority / highest-margin services.
2. Minimum commercially viable account/environment by service.
3. Service-specific signal that makes sales want immediate contact.
4. Whether account size, cloud spend, user count, workload scale or another variable best predicts value for each service.
5. Actual sales-cycle ranges.

Once enough lead/outcome data exists, tune scoring from observed conversion rather than preference.
