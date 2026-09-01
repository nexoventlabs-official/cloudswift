# CloudSwift — Lead Automation System Overview

---

## What This Is

CloudSwift is an Azure Expert MSP (Managed Service Provider) targeting mid-market companies across India and the GCC. This document covers the full lead automation system — how prospects find CloudSwift, how they get qualified, and how they move toward a sales conversation.

The system has two main channels running in parallel:
- **WhatsApp** — the primary qualification engine (live and running)
- **Email** — outbound and nurture sequences (copy written, platform setup pending)

There is also an **interactive React flowchart** (the `.jsx` file) that visualises the entire journey and shows the exact message at every step.

---

## How Leads Enter the System

There are 5 entry points:

| Channel | How it works |
|---|---|
| Google Ads | Prospect searches "Azure MSP Bangalore" → lands on website → clicks CTA → WhatsApp |
| Meta CTWA Ad | Prospect taps Instagram/Facebook ad → WhatsApp opens directly (no website needed) |
| Organic / Direct | Finds the site via search or referral → CTA → WhatsApp |
| Cold Email | Sales rep runs outbound sequence → prospect replies or clicks WA link |
| Referral / Word of Mouth | Existing client refers someone → direct WhatsApp message |

Meta CTWA is the highest-converting path because it skips the website entirely.

---

## WhatsApp Flow (Live)

All entry points eventually land in the WhatsApp flow. Here's what happens step by step.

### Flow 1 — First Response
- Triggered by any inbound WhatsApp message
- Auto-reply sent within **90 seconds**, 24/7, no human needed
- Asks the prospect to pick their main challenge from 5 options (quick-reply buttons)

### Flow 2 — Qualification
- 3 questions sent one at a time
- Q1: Company size (Under 100 / 100–500 / 500–2,000 / 2,000+)
- Q2: Current situation (MSP not working / first evaluation / switching / just exploring)
- Q3: Decision timeline (This quarter / Next quarter / Within 6 months / Just researching)

### Lead Scoring
Answers are scored automatically. No human review at this stage.

| Result | Criteria |
|---|---|
| **HOT** | 500+ employees (any timeline) OR 100+ employees + this/next quarter |
| **WARM** | Switching/problem + within 6 months |
| **COLD** | Just researching, under 100 employees, no timeline |

---

## What Happens After Scoring

### Hot Lead Path
1. Sales rep gets a structured WhatsApp brief within **2 minutes**
2. Prospect simultaneously receives a **Calendly link** to book a 30-min discovery call
3. Once booked, sales rep receives a **pre-call brief** with the prospect's company, pain point, current setup, and timeline
4. Discovery call happens
5. Post-call follow-up sent within **1 hour** with overview, case study, and pricing framework
6. Formal proposal sent within 48 hours
7. → Closed Won → client onboarding begins

### Warm Lead Path (21-Day Nurture)
- **Day 3:** Light follow-up, offer to send a case study
- **Day 7:** Case study sent regardless of reply, infrastructure assessment offered
- **Day 21:** Final message — convert or release cleanly

If the prospect replies positively at any point, they immediately re-enter the Hot Lead path and the sales rep is notified within 2 minutes.

### Cold Lead Exit
- Single polite message, referral ask, free cloud readiness assessment offer
- No follow-up sequence
- If they reply, sales rep is notified for human judgment

---

## Email Automation (Pending Setup)

Email runs alongside WhatsApp as an outbound and nurture channel. The copy is fully written and approved. The platform and domain setup are the remaining blockers.

### 4 Sequences

| Sequence | Target audience | Emails | Duration |
|---|---|---|---|
| GCC / Dubai | IT Heads / CTOs at Indian companies with GCC subsidiaries | 5 | 14 days |
| NBFC / Fintech | CTOs at NBFCs, payment companies, fintech on Azure | 5 | 14 days |
| SaaS / Healthcare | CTOs / Engineering Heads at B2B SaaS and healthcare tech | 5 | 14 days |
| Inbound Nurture | Warm leads who didn't complete the WhatsApp qualification | 6 | 30 days |

### How Email Scoring Works
Email engagement updates the lead's score automatically via webhooks:
- Case study click → medium signal
- Pricing page visit → strong signal → sales rep notified
- Any reply → exits sequence → sales rep notified immediately
- Calendly booked from email → treated as HOT

### On Email Reply
When a reply is detected:
1. Sequence pauses immediately for that prospect
2. Sales rep receives a WhatsApp brief with the prospect's name, company, which email they replied to, and the reply content verbatim

---

## Domain & Deliverability Setup (Still TODO)

Cold email at volume from a fresh domain goes to spam. The warmup plan:

| Week | Volume | Activity |
|---|---|---|
| Week 1–2 | 10–20/day | Warmup only, no prospect emails |
| Week 3 | 20–30/day | Inbound nurture only (safer for domain) |
| Week 4 | 30–50/day | GCC sequence begins |
| Week 5+ | 50–80/day | NBFC and SaaS sequences added |

Sending domain: a subdomain like `mail.oncloudswift.com` — never the primary domain.

---

## Technical Stack

| Component | Tool | Status |
|---|---|---|
| WhatsApp API | Meta Cloud API (direct) | Live |
| Flow logic | n8n (self-hosted) | Live |
| Email sending | Smartlead | Pending setup |
| Calendly | Inline link in WhatsApp messages | Pending setup |
| Sales rep notifications | WhatsApp message to her number | Live |
| Lead data store | Not yet defined | TODO |
| Cross-channel sync | Not yet built | Proposed (Month 2+) |
| Sending subdomain | mail.oncloudswift.com | TODO — blocker |
| DKIM / SPF / DMARC | DNS config | TODO — blocker |

---

## What's Live vs What's Pending

| Item | Status |
|---|---|
| WhatsApp Flow 1 + 2 (qualification) | Live |
| Lead scoring (HOT/WARM/COLD) | Live |
| Hot lead brief to sales rep | Live |
| Calendly link in WA messages | Pending |
| Warm lead 21-day nurture | Live |
| Cold lead exit message | Live |
| Email sequences (all copy) | Written, not deployed |
| Smartlead platform setup | TODO |
| Domain warmup | TODO — start immediately |
| Email → WhatsApp state sync | Proposed, not built |
| Interactive flow prototype (JSX) | Built |

---

## Key Principles

- WhatsApp is not a chatbot — every message has a specific business purpose
- Email does not replace WhatsApp qualification — it feeds into it
- Both channels use the same HOT/WARM/COLD classification
- Both channels notify the sales rep via WhatsApp
- No prospect is ever silently lost — all failures are logged and retried
- Cold leads always get a clean exit with a referral ask
- Enterprise leads (500+ employees) are always treated as HOT regardless of their stated timeline
