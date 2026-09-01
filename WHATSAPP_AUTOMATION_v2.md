# WHATSAPP_AUTOMATION.md

# CloudSwift WhatsApp Automation
## Specification — Existing Flow

> Status: EXISTING — this document describes the implemented and approved WhatsApp flow.
> Do not modify business logic without updating this document first.
> All changes must be labelled EXISTING / DECIDED / PROPOSED / ASSUMPTION / TODO / REJECTED.

---

## 1. PURPOSE

WhatsApp is the primary qualification interface for CloudSwift's lead system.

Its role is to:
- Acknowledge inbound prospects within 90 seconds, any hour
- Identify the prospect's requirement category
- Qualify the prospect across three dimensions
- Score the lead as HOT / WARM / COLD
- Route the lead to the correct next action
- Notify [Sales Rep] (sales) on hot leads with a structured brief
- Run a 21-day nurture sequence for warm leads
- Exit cold leads cleanly with a referral offer

WhatsApp is NOT a generic chatbot. Every message exists to move the prospect through a business decision.

---

## 2. ENTRY POINTS

All five acquisition channels can trigger the WhatsApp flow.

| Channel | How they enter WA |
|---|---|
| Google Ads | Website CTA → "Talk to an expert" → wa.me link |
| Meta CTWA | Ad tap → WhatsApp opens directly, no website visit |
| Organic / Direct | Website CTA → wa.me link |
| Cold Email | Prospect replies with WA number, or clicks WA link in email signature |
| Referral / WOM | Direct message to CloudSwift WA number |

The Meta CTWA path is the highest-converting because it eliminates the website as an intermediate step.

---

## 3. TECHNICAL STACK

| Component | Tool | Status |
|---|---|---|
| API | Meta Cloud API (direct, no BSP) | DECIDED |
| Flow logic | n8n (self-hosted) or Make | DECIDED |
| Calendly | Inline link in WA message | DECIDED |
| [Sales Rep] notification | WA message to her personal number | DECIDED |
| Lead state storage | TODO — define data store | TODO |
| Cross-channel sync | Not yet implemented | TODO |

---

## 4. FLOW 1 — FIRST RESPONSE

**Trigger:** Any inbound message to the CloudSwift WhatsApp number.
**SLA:** Auto-reply within 90 seconds, 24/7.
**Type:** Automated. No human involvement at this stage.

### Message

```
Hi [Name] — thanks for reaching out to CloudSwift.

[Founder] and the team work with mid-market companies across India and
the GCC on Azure infrastructure, Microsoft 365, and managed cloud.

To connect you with the right person — what's the main challenge
you're trying to solve right now?

[1] Azure migration or infrastructure
[2] Microsoft 365 / Dynamics 365
[3] Managed cloud support
[4] Security or compliance
[5] Something else
```

**Format:** Options 1–5 are Meta quick-reply buttons (one tap, no typing required).
**Next step:** Their selection triggers Flow 2 — Qualification.

---

## 5. FLOW 2 — QUALIFICATION

**Trigger:** Prospect selects an option in Flow 1.
**Type:** Automated. Three sequential questions.
**Purpose:** Score the lead as HOT / WARM / COLD.

Questions are sent one at a time, not all at once.

### Q1 — Company size

```
Got it. And what size is your company — roughly how many employees?

[1] Under 100
[2] 100–500
[3] 500–2,000
[4] 2,000+
```

### Q2 — Current situation

```
Thanks. Are you currently working with any cloud vendor or MSP?

[1] We have something but it's not working
[2] We're evaluating for the first time
[3] We're looking to switch providers
[4] Just exploring for now
```

### Q3 — Decision timeline

```
One last thing — what's your timeline for making a decision?

[1] This quarter — we need to move fast
[2] Next quarter
[3] Within 6 months
[4] Just researching
```

**All options are Meta quick-reply buttons.**
**Next step:** Answers feed into the scoring engine.

---

## 6. LEAD SCORING RULES

The system evaluates the three qualification answers and assigns HOT / WARM / COLD.

| Signal combination | Score | Action |
|---|---|---|
| 100+ employees + this/next quarter + switching/problem | HOT | Immediate Flow 3 |
| 500+ employees + any timeline + any intent | HOT | Immediate Flow 3 — size overrides timeline |
| 100+ employees + first evaluation + this quarter | HOT | Immediate Flow 3 |
| Any size + switching/problem + within 6 months | WARM | Flow 4 — nurture |
| Any size + just researching + 6+ months | COLD | Polite close |
| Under 100 + just researching | COLD | Polite close |

**Rule:** Company size 500+ always routes HOT regardless of timeline or intent.
Enterprise leads in research phase still need to know CloudSwift exists before their decision window opens.

---

## 7. FLOW 3 — HOT LEAD HANDOFF

**Trigger:** Lead scores HOT.
**SLA:** [Sales Rep] notified within 2 minutes of hot score.
**Type:** Automated brief + human pickup.

### 7.1 Message to [Sales Rep] (her WhatsApp number)

```
🔴 Hot lead — [Name], [Company]

Topic: [from Q1 selection]
Size: [from Q2 answer]
Status: [from Q2 answer]
Timeline: [from Q3 answer]
Their message: "[first message verbatim]"

Calendly link sent to them.
→ wa.me/[prospect number]
```

### 7.2 Message to prospect (simultaneously)

```
Thanks [Name] — I've shared your details with [Sales Rep] from our
solutions team. She'll reach out within the next few hours.

You can also book a slot directly:
[Calendly link]

We typically start with a 30-minute call to understand your
environment — no pitch, just a conversation.
```

---

## 8. PRE-CALL BRIEF

**Trigger:** Calendly slot confirmed.
**Recipient:** [Sales Rep], sent to her WhatsApp number.
**Purpose:** [Sales Rep] knows the company, pain, timeline, and context before saying hello.

### Message to [Sales Rep]

```
📋 Pre-call brief — [Name], [Company]

Company: [Name], [Industry], ~[size] employees
Their pain: [from qualification answers]
Current setup: [MSP / on-prem / hybrid — from Q2]
Timeline: [from Q3]
Key contact: [Name, from WA profile]

Suggested opening: Ask about their current Azure spend and
what's not working with [current provider].
```

---

## 9. POST-CALL FOLLOW-UP

**Trigger:** Discovery call completed. Sent within 1 hour.
**Type:** Automated WA message.

### Message to prospect

```
Hi [Name] — great speaking with you today.

As discussed, I'm sending across:
[1] CloudSwift managed services overview
[2] [Client A] case study (similar migration scope)
[3] Pricing framework

[Sales Rep] will send a formal proposal within 48 hours.
Any questions in the meantime, just reply here.
```

---

## 10. FLOW 4 — WARM LEAD NURTURE

**Trigger:** Lead scores WARM.
**Duration:** 21 days, 3 touches.
**Type:** Fully automated. No human involvement unless prospect re-engages.

### Day 3

```
Hi [Name] — just following up from our chat earlier this week.

Happy to answer any questions about Azure managed services or
how we've helped companies like yours.

If it's useful, I can send you a one-pager on how we helped
[Client A] move their entire infrastructure to Azure in 6 weeks.
Worth a look?
```

### Day 7

```
[Name] — sending this across in case it's useful.

This is the [Client A] case: [link]

They had a similar situation — a legacy on-prem setup and a hard
deadline. If you're in a comparable position, [Sales Rep] would be
happy to do a 30-minute infrastructure assessment.
No cost, no obligation.

Want me to send her availability?
```

### Day 21

```
[Name] — last note from me. If the timing isn't right,
no problem at all. When it is, CloudSwift is here.

If you'd like a free cloud infrastructure assessment before you
make any decisions, I can set that up at any point.
Just reply "yes" and I'll send [Sales Rep]'s calendar.

Either way — good luck with whatever you're working on.
```

### Re-entry rule

Any positive reply at any point in the nurture sequence — including "yes", "interested",
"tell me more", or any substantive engagement — triggers:

1. Nurture sequence paused immediately
2. Prospect treated as HOT
3. [Sales Rep] notified via Flow 3 brief
4. Calendly link sent to prospect

---

## 11. COLD LEAD EXIT

**Trigger:** Lead scores COLD.
**Type:** Automated. Single message. No follow-up sequence.

### Message

```
Thanks for reaching out [Name] — it sounds like the timing
might not be right just yet.

If anything changes, we're here. And if you know anyone dealing
with Azure migration or managed cloud challenges, we'd love
an introduction.

We also offer a free cloud readiness assessment — no obligations.
Happy to send that across if useful.

Take care!
```

**Re-entry:** If cold lead replies to this message, [Sales Rep] is notified. They do not
automatically re-enter the nurture sequence — human judgment required.

---

## 12. LEAD STATE MODEL

```
NEW
 ↓
QUALIFYING (Flow 1 + Flow 2)
 ↓
┌──────────┬──────────┐
│          │          │
HOT       WARM      COLD
│          │          │
↓          ↓          ↓
SALES    DAY 3      EXIT
↓          ↓
DISCOVERY  DAY 7
↓          ↓
PROPOSAL  DAY 21
↓          ↓
WON    RE-ENGAGE → HOT
```

---

## 13. LEAD DATA COLLECTED

| Field | Source | Used for |
|---|---|---|
| Name | WA profile | Personalisation |
| WhatsApp number | WA | [Sales Rep] contact link |
| Company | WA profile or free text | Brief, personalisation |
| Requirement topic | Flow 1 button | Routing, brief |
| Company size | Flow 2 Q1 | Scoring |
| Current MSP situation | Flow 2 Q2 | Scoring, brief |
| Decision timeline | Flow 2 Q3 | Scoring, brief |
| First message verbatim | WA | Brief to [Sales Rep] |
| Interaction history | WA thread | Context |
| Lead score | Calculated | Routing |
| Score timestamp | System | Nurture timing |

Do not collect fields not listed here unless a specific business reason is documented.

---

## 14. FAILURE HANDLING

| Failure | Behaviour | Status |
|---|---|---|
| Meta API timeout | Retry once after 30s. If second fail, log and alert. | TODO |
| Prospect sends free text instead of button | Route to "Something else" path. Flag for [Sales Rep] review. | TODO |
| [Sales Rep] brief delivery failure | Log, retry, alert if persistent. Do not silently lose. | TODO |
| Calendly unavailable | Send [Sales Rep]'s direct WA number as fallback. | TODO |
| Duplicate inbound message | Idempotency check on WA message ID. | TODO |
| Nurture message delivery failure | Log, retry once after 1 hour. | TODO |

**Principle:** Fail safely. Never silently lose a prospect. All failures logged.

---

## 15. PRE-LAUNCH BLOCKERS

| Item | Owner | Status |
|---|---|---|
| Meta Business account verified | CloudSwift | ASSUMPTION — needs confirmation |
| WhatsApp Business number confirmed | CloudSwift | ASSUMPTION — needs confirmation |
| Meta message template approval | SIGNAL | TODO — 24–72h Meta review |
| Calendly account set up | CloudSwift / SIGNAL | TODO |
| [Sales Rep]'s notification WA number confirmed | CloudSwift | TODO |
| n8n / Make environment provisioned | SIGNAL | TODO |
| Lead data store defined | SIGNAL | TODO |

---

## 16. NOT IN SCOPE FOR THIS DOCUMENT

- Email automation (see EMAIL_AUTOMATION.md)
- Google Ads or Meta Ads setup
- CRM integration
- Cross-channel lead state sync
- AI reply parsing
- Predictive scoring
