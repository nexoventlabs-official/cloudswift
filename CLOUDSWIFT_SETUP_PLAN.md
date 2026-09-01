# CloudSwift — End-to-End Setup Plan

> This document is the single source of truth for building and launching the CloudSwift lead automation system.
> Every task has an owner, a status, and a dependency note where relevant.
> Status labels: `DONE` · `IN PROGRESS` · `TODO` · `BLOCKED` · `PROPOSED`

---

## Overview

The full system has three layers:

1. **WhatsApp Automation** — primary qualification engine (largely live, some gaps)
2. **Email Automation** — outbound sequences + inbound nurture (copy done, platform not set up)
3. **Flow Prototype** — interactive React component visualising the full journey (built)

Everything runs through the same lead scoring model (HOT / WARM / COLD) and notifies the sales rep via WhatsApp.

---

## Phase 0 — Foundations (Do First, Everything Else Blocks On This)

These items must be completed before any automation goes live or any email is sent.

### 0.1 — Domain & DNS

| Task | Owner | Status | Notes |
|---|---|---|---|
| Create sending subdomain — `mail.oncloudswift.com` or `outreach.oncloudswift.com` | CloudSwift (DNS) | TODO | **Blocker for all email** — do not use primary domain for cold outreach |
| Add DKIM record to DNS | CloudSwift (DNS) | TODO | Required for deliverability |
| Update SPF record to include sending subdomain | CloudSwift (DNS) | TODO | Required for deliverability |
| Set DMARC policy (start with `p=none`, monitor, then enforce) | CloudSwift (DNS) | TODO | Recommended — protects domain reputation |
| Confirm primary domain DNS is NOT used for cold outbound | CloudSwift | TODO | Primary domain reputation is too valuable to risk |

### 0.2 — WhatsApp Business Setup

| Task | Owner | Status | Notes |
|---|---|---|---|
| Confirm Meta Business account is verified | CloudSwift | ASSUMPTION — needs confirmation | Without this, no WA API access |
| Confirm WhatsApp Business number is active and approved | CloudSwift | ASSUMPTION — needs confirmation | Separate from a personal WA number |
| Submit Flow 1 message template to Meta for approval | SIGNAL | TODO | Meta review takes 24–72 hours |
| Submit Flow 2 qualification message templates to Meta | SIGNAL | TODO | All 3 questions need approval |
| Submit Hot Lead prospect confirmation template | SIGNAL | TODO | The Calendly link message |
| Submit Warm nurture Day 3 / 7 / 21 templates | SIGNAL | TODO | All 3 need approval |
| Submit Cold exit template | SIGNAL | TODO | |
| Submit Post-call follow-up template | SIGNAL | TODO | |

> **Note on Meta templates:** All outbound WhatsApp messages (any message CloudSwift initiates) must be pre-approved templates. Replies to inbound messages within 24 hours can be free-form. Budget 3–5 business days for all template approvals.

### 0.3 — Accounts & Access

| Task | Owner | Status | Notes |
|---|---|---|---|
| Create Smartlead account | SIGNAL | TODO | Email sending platform |
| Provision sending mailbox — Google Workspace or Outlook on subdomain | CloudSwift / SIGNAL | TODO | Must be on subdomain, not primary |
| Set up Calendly account and configure 30-min discovery call slot | CloudSwift / SIGNAL | TODO | Link is used in WA and email |
| Confirm sales rep's WhatsApp number for notifications | CloudSwift | TODO | All hot lead briefs go here |
| Provision n8n instance (self-hosted or cloud) | SIGNAL | TODO | Flow logic for both WA and email |
| Set up Meta Cloud API credentials and webhook endpoint | SIGNAL | TODO | Required for WA automation |

---

## Phase 1 — WhatsApp Automation Build

With Phase 0 complete, build the WhatsApp flows in n8n.

### 1.1 — Flow 1: First Response

| Task | Owner | Status | Notes |
|---|---|---|---|
| Configure Meta Cloud API webhook to receive inbound messages | SIGNAL | TODO | All messages hit this endpoint |
| Build n8n trigger on inbound WA message | SIGNAL | TODO | |
| Extract prospect name from WA profile | SIGNAL | TODO | Used for personalisation |
| Send Flow 1 auto-reply within 90 seconds | SIGNAL | TODO | Quick-reply buttons, options 1–5 |
| Handle free-text reply (prospect doesn't tap a button) | SIGNAL | TODO | Route to "Something else" path, flag for review |
| Test end-to-end: send message → receive auto-reply | SIGNAL | TODO | |

### 1.2 — Flow 2: Qualification

| Task | Owner | Status | Notes |
|---|---|---|---|
| Capture Flow 1 button selection and store it | SIGNAL | TODO | Topic: Azure / M365 / Managed / Security / Other |
| Send Q1 (company size) after Flow 1 selection | SIGNAL | TODO | Sequential, not all at once |
| Capture Q1 answer and store it | SIGNAL | TODO | |
| Send Q2 (current MSP situation) | SIGNAL | TODO | |
| Capture Q2 answer and store it | SIGNAL | TODO | |
| Send Q3 (decision timeline) | SIGNAL | TODO | |
| Capture Q3 answer and store it | SIGNAL | TODO | |

### 1.3 — Lead Scoring Engine

| Task | Owner | Status | Notes |
|---|---|---|---|
| Build scoring logic in n8n | SIGNAL | TODO | See scoring rules below |
| Rule: 500+ employees → always HOT regardless of other answers | SIGNAL | TODO | |
| Rule: 100–500 employees + this/next quarter + switching/problem → HOT | SIGNAL | TODO | |
| Rule: 100+ employees + first evaluation + this quarter → HOT | SIGNAL | TODO | |
| Rule: any size + switching/problem + within 6 months → WARM | SIGNAL | TODO | |
| Rule: any size + just researching + 6+ months → COLD | SIGNAL | TODO | |
| Rule: under 100 + just researching → COLD | SIGNAL | TODO | |
| Write lead score and timestamp to data store | SIGNAL | TODO | Data store must be defined first |
| Route to correct flow based on score | SIGNAL | TODO | HOT → Flow 3, WARM → Flow 4, COLD → exit |

### 1.4 — Lead Data Store

| Task | Owner | Status | Notes |
|---|---|---|---|
| Define data store (Airtable / Google Sheets / Notion / database) | CloudSwift / SIGNAL | TODO | **Decision needed** — pick one |
| Schema: Name, WA number, Company, Topic, Size, Situation, Timeline, Score, Score timestamp, Channel, First message | SIGNAL | TODO | |
| Connect n8n to data store | SIGNAL | TODO | |
| Log every lead on first contact | SIGNAL | TODO | |
| Update record on score change | SIGNAL | TODO | |

### 1.5 — Flow 3: Hot Lead Handoff

| Task | Owner | Status | Notes |
|---|---|---|---|
| Send sales rep brief via WhatsApp (within 2 minutes of HOT score) | SIGNAL | TODO | Includes name, company, topic, size, situation, timeline, first message verbatim, WA link to prospect |
| Send prospect confirmation message simultaneously | SIGNAL | TODO | Includes sales rep name and Calendly link |
| Confirm both messages fire within the 2-minute SLA | SIGNAL | TODO | |

### 1.6 — Pre-Call Brief

| Task | Owner | Status | Notes |
|---|---|---|---|
| Set up Calendly webhook on slot confirmed | SIGNAL | TODO | Calendly → n8n |
| Build pre-call brief in n8n, send to sales rep's WhatsApp | SIGNAL | TODO | Company, pain, setup, timeline, suggested opening |

### 1.7 — Post-Call Follow-Up

| Task | Owner | Status | Notes |
|---|---|---|---|
| Define trigger for post-call message (manual trigger by sales rep, or Calendly event end + 1 hour) | CloudSwift / SIGNAL | TODO | Decision needed |
| Build post-call WA message to prospect | SIGNAL | TODO | Includes overview, case study, pricing framework links |

### 1.8 — Flow 4: Warm Lead Nurture

| Task | Owner | Status | Notes |
|---|---|---|---|
| Schedule Day 3 message after WARM score timestamp | SIGNAL | TODO | |
| Schedule Day 7 message | SIGNAL | TODO | |
| Schedule Day 21 message | SIGNAL | TODO | |
| Monitor for positive reply at any point during nurture | SIGNAL | TODO | Any reply → pause sequence → re-score as HOT → trigger Flow 3 |
| Define "positive reply" detection (keyword match vs any reply) | SIGNAL | TODO | Start with any reply to be safe |

### 1.9 — Cold Lead Exit

| Task | Owner | Status | Notes |
|---|---|---|---|
| Send polite exit message on COLD score | SIGNAL | TODO | Referral ask + free assessment offer |
| Monitor for reply to cold exit message | SIGNAL | TODO | Any reply → notify sales rep, do NOT auto re-enter nurture |

### 1.10 — Failure Handling (WhatsApp)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Meta API timeout → retry once after 30s, log if second fail | SIGNAL | TODO | |
| Idempotency check on WA message ID (prevent duplicate processing) | SIGNAL | TODO | |
| Sales rep brief delivery failure → log, retry, alert | SIGNAL | TODO | Never silently lose |
| Calendly unavailable → fallback to sales rep's direct WA number | SIGNAL | TODO | |
| Nurture delivery failure → log, retry once after 1 hour | SIGNAL | TODO | |

---

## Phase 2 — Email Automation Build

Run Phase 2 in parallel with Phase 1 where possible. Domain warmup (Phase 2.1) must start immediately — it takes 3–4 weeks.

### 2.1 — Domain Warmup (Start Week 1)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Enable Smartlead SmartDelivery on sending subdomain | SIGNAL | TODO | Do not send prospect emails during warmup |
| Week 1–2: 10–20 warmup emails/day, no prospects | SIGNAL | TODO | |
| Week 3: 20–30/day, inbound nurture only (warm leads, safer) | SIGNAL | TODO | |
| Week 4: 30–50/day, begin GCC sequence | SIGNAL | TODO | 50 prospects/week = ~10/day |
| Week 5+: 50–80/day, add NBFC and SaaS sequences | SIGNAL | TODO | |
| Monitor bounce rate daily — pause if > 5% | SIGNAL | TODO | |
| Monitor spam complaint rate — pause if > 0.1% | SIGNAL | TODO | |

### 2.2 — Smartlead Setup

| Task | Owner | Status | Notes |
|---|---|---|---|
| Import GCC sequence copy into Smartlead (5 emails, 14 days) | SIGNAL | TODO | Copy is approved and ready |
| Import NBFC sequence copy (5 emails, 14 days) | SIGNAL | TODO | |
| Import SaaS / Healthcare sequence copy (5 emails, 14 days) | SIGNAL | TODO | |
| Import Inbound Nurture sequence (6 emails, 30 days) | SIGNAL | TODO | |
| Configure sending schedule (business hours, prospect timezone) | SIGNAL | TODO | |
| Set reply-to address — confirmed with CloudSwift | SIGNAL | CloudSwift | |
| Add unsubscribe link to all emails | SIGNAL | TODO | **Legal requirement** |
| Configure sequence exit on reply (Smartlead native) | SIGNAL | TODO | Prospect must exit on any reply |
| Configure Smartlead webhook events: reply, click, bounce, unsubscribe | SIGNAL | TODO | All events → n8n |

### 2.3 — Prospect Lists

| Task | Owner | Status | Notes |
|---|---|---|---|
| Build GCC list — 50 IT Heads / CTOs at Indian conglomerates with GCC operations | CloudSwift (sales rep's network + LinkedIn) | TODO | Verify emails before import |
| Build NBFC list — 50 CTOs / IT Heads at NBFCs, payment companies, fintech | CloudSwift | TODO | |
| Build SaaS / Healthcare list — 30 CTOs / Engineering Heads | CloudSwift | TODO | |
| Validate all email addresses before import (reduce bounce rate) | SIGNAL / CloudSwift | TODO | Use a tool like NeverBounce or ZeroBounce |
| Confirm all contacts have {{first_name}} and {{company}} fields populated | SIGNAL | TODO | Sequences use these variables |

### 2.4 — n8n Email Routing

| Task | Owner | Status | Notes |
|---|---|---|---|
| Configure Smartlead webhook → n8n endpoint | SIGNAL | TODO | |
| On reply: pause sequence, create sales rep WA brief | SIGNAL | TODO | Include name, company, sequence, email replied to, reply verbatim |
| On pricing page click (score +2): check if HOT threshold reached, notify sales rep | SIGNAL | TODO | |
| On case study click (score +1): log, stay in sequence | SIGNAL | TODO | |
| On Calendly booked from email: treat as HOT, trigger pre-call brief | SIGNAL | TODO | |
| On unsubscribe: remove from all sequences, log, do not contact | SIGNAL | TODO | Must process within 10 seconds — legal requirement |
| On bounce: remove from sequence, flag for data review | SIGNAL | TODO | |
| Test full webhook chain: Smartlead event → n8n → sales rep WA | SIGNAL | TODO | |

### 2.5 — Lead Scoring (Email Signals)

| Score event | Signal | Action |
|---|---|---|
| Email opened | Weak (suppressed ~40%) | Not scored |
| Case study link clicked | Medium | +1, stay in sequence |
| Pricing page link clicked | Strong | +2, notify sales rep if HOT threshold |
| Any reply | Very strong | Exit sequence, notify sales rep immediately |
| A/B/C/D qualification reply | Very strong | Treat as HOT signal |
| Pricing page visited from website | Very strong | +3, HOT threshold, notify sales rep + WA link if number known |
| Calendly booked | Confirmed intent | HOT — trigger pre-call brief |
| Unsubscribe | Negative | Remove from all sequences, log |
| Bounce | Invalid | Remove, flag for review |

**HOT threshold:** Score ≥ 3 from email signals, or any direct reply.

### 2.6 — Failure Handling (Email)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Smartlead API timeout → retry via webhook, log if persistent | SIGNAL | TODO | |
| Bounce rate > 5% → pause sequence, review list quality | SIGNAL | TODO | |
| Reply parsing fails → log raw reply, alert sales rep manually, never silently lose | SIGNAL | TODO | |
| Webhook to n8n fails → Smartlead retry + dead-letter queue | SIGNAL | TODO | |
| Sales rep WA notification fails → fallback to email notification | SIGNAL | TODO | |
| Unsubscribe not processed → must process within 10 seconds | SIGNAL | TODO | Legal risk — treat as critical |
| Domain reputation drops → pause all outbound, review send patterns | SIGNAL | TODO | |

---

## Phase 3 — Flow Prototype (Interactive Flowchart)

| Task | Owner | Status | Notes |
|---|---|---|---|
| Deploy the React component (`cloudswift-userflow-v2.jsx`) | SIGNAL | TODO | Can deploy on Vercel or Netlify — takes ~10 minutes |
| Share URL with team for internal reference and walkthroughs | SIGNAL | TODO | |
| Keep prototype in sync when flow logic changes | SIGNAL | ONGOING | Update PATHS data object when messages change |

---

## Phase 4 — Testing & QA

Do not go live with prospects until all items in this phase pass.

### 4.1 — WhatsApp Testing

| Test | Expected result | Status |
|---|---|---|
| Send message to CloudSwift WA number | Auto-reply received within 90 seconds | TODO |
| Select option 1 in Flow 1 | Q1 (company size) received | TODO |
| Complete all 3 qualification questions with HOT combination | Sales rep receives brief within 2 min + prospect receives Calendly link | TODO |
| Complete all 3 questions with WARM combination | Prospect enters nurture, Day 3 message arrives on schedule | TODO |
| Complete all 3 questions with COLD combination | Polite exit message received | TODO |
| Reply "yes" during Day 7 nurture | Nurture pauses, HOT brief sent to sales rep | TODO |
| Book Calendly slot | Sales rep receives pre-call brief | TODO |
| Send free text instead of button | Routed to "Something else", flagged for review | TODO |
| Simulate Meta API timeout | Error logged, retry fires, no duplicate message sent | TODO |

### 4.2 — Email Testing

| Test | Expected result | Status |
|---|---|---|
| Send test email from subdomain | Lands in inbox, not spam | TODO |
| Reply to a sequence email | Sequence pauses, sales rep receives WA brief within 2 minutes | TODO |
| Click case study link | Score updated +1, no sales rep notification | TODO |
| Click pricing page link | Score updated +2, sales rep notified | TODO |
| Click unsubscribe | Removed from all sequences within 10 seconds | TODO |
| Trigger bounce (invalid address) | Removed from sequence, flagged | TODO |
| Book Calendly from email | Treated as HOT, pre-call brief sent to sales rep | TODO |
| Check DKIM / SPF / DMARC pass | Use mail-tester.com — target score 10/10 | TODO |

### 4.3 — End-to-End Test (Full Journey)

| Test | Expected result | Status |
|---|---|---|
| Google Ads path: website → CTA → WA → qualify as HOT → book call | Full hot lead journey completes with no manual intervention | TODO |
| Meta CTWA path: ad tap → WA → qualify as WARM → Day 3 message arrives | Nurture sequence fires on schedule | TODO |
| Cold email path: email reply → sequence exit → sales rep WA brief | Brief received within 2 minutes of reply | TODO |
| Prospect in email sequence messages on WA separately | WA flow takes over (manually pause email sequence for now) | TODO |

---

## Phase 5 — Launch Sequence

### Pre-Launch Checklist

| Item | Owner | Status |
|---|---|---|
| All Meta WA templates approved | SIGNAL | TODO |
| DNS records confirmed (DKIM, SPF, DMARC) | CloudSwift | TODO |
| Domain warmup complete (minimum 2 weeks) | SIGNAL | TODO |
| Smartlead sequences imported and tested | SIGNAL | TODO |
| n8n webhook chain tested end-to-end | SIGNAL | TODO |
| Prospect lists validated (< 2% bounce rate expected) | CloudSwift | TODO |
| Sales rep has confirmed her WA number for notifications | CloudSwift | TODO |
| Sales rep has reviewed and approved all message copy | CloudSwift | TODO |
| Calendly configured and link tested inside WA message | CloudSwift / SIGNAL | TODO |
| Lead data store set up and connected | SIGNAL | TODO |
| Unsubscribe handling confirmed functional | SIGNAL | TODO |
| All failure handling built and tested | SIGNAL | TODO |

### Launch Order

1. **Start domain warmup immediately** — this is the longest lead time item (3–4 weeks)
2. **Build WhatsApp flows** in parallel with warmup
3. **Submit Meta templates** as soon as WA flows are drafted (budget 3–5 business days)
4. **QA WhatsApp end-to-end** before any paid traffic is running
5. **Import email sequences** into Smartlead during warmup weeks
6. **Build prospect lists** during warmup weeks
7. **Week 3:** Begin inbound nurture email sequence (warm/safe for domain)
8. **Week 4:** Launch GCC cold outbound sequence
9. **Week 5+:** Add NBFC and SaaS sequences
10. **Website DNS switch** (`cloudswift-demo.vercel.app` → `oncloudswift.com`) — do this before paid traffic starts

---

## Phase 6 — Live Monitoring (First 4 Weeks)

### Success Metrics

| Metric | Target | How to measure |
|---|---|---|
| WA auto-reply speed | < 90 seconds | Log timestamps |
| Hot lead brief delivery | < 2 minutes from HOT score | Log timestamps |
| Email delivery rate | > 95% | Smartlead dashboard |
| Email open rate | > 35% | Smartlead dashboard |
| Cold email reply rate | > 3% | Smartlead dashboard |
| Inbound nurture reply rate | > 8% | Smartlead dashboard |
| Email click rate | > 5% | Smartlead dashboard |
| Bounce rate | < 2% | Smartlead dashboard |
| WA qualification completion rate | > 60% of people who start Flow 1 complete Flow 2 | n8n logs |
| HOT conversion from WA | To be baselined in Week 1 | Data store |
| Meetings booked | Track weekly | Calendly |

### Early Warning Triggers (Act Immediately)

| Signal | Action |
|---|---|
| Reply rate < 1% after 2 weeks | Review subject lines and Email 1 copy before adding more prospects |
| Bounce rate > 5% | Pause all sequences, review list quality immediately |
| WA template rejected by Meta | Fix and resubmit, do not use unapproved templates |
| Domain reputation drop | Pause all cold outbound, investigate |
| Sales rep not receiving briefs | Check n8n webhook, do not rely on manual workaround |

---

## Phase 7 — Month 2+ (Proposed, Do Not Build Now)

These items are explicitly PROPOSED. Build only after the first 4 weeks produce real conversion data.

| Feature | Description |
|---|---|
| AI reply parsing | Automatically classify reply intent (interested / not now / objection) |
| Email ↔ WhatsApp state sync | Email engagement automatically updates WA lead state in real time |
| Dynamic email personalisation | AI generates company-specific first lines per prospect |
| Predictive lead scoring | ML model predicts buying intent from engagement patterns |
| Automated prospect sourcing | System finds and adds prospects to sequences automatically |
| CRM integration | Sync lead state to HubSpot or equivalent |
| Existing client WA flow | Separate WhatsApp sequence for onboarded clients (support, renewal, upsell) |

---

## Dependencies Map

```
DNS setup (0.1)
    └── Email sending works at all
            └── Domain warmup (2.1)
                    └── Cold outbound sequences (2.2)
                            └── Prospect lists (2.3)

Meta Business verified (0.2)
    └── WA templates approved (0.2)
            └── WhatsApp flows go live (Phase 1)
                    └── QA (Phase 4)
                            └── Paid traffic can start

n8n provisioned (0.3)
    └── All flow logic (WA + email)
            └── Lead data store (1.4)

Calendly set up (0.3)
    └── Hot lead path (1.5)
    └── Pre-call brief (1.6)
    └── Post-call follow-up trigger (1.7)

Sales rep number confirmed (0.3)
    └── All notification flows
```

---

## Open Decisions (Need Answers Before Building)

| Question | Options | Urgency |
|---|---|---|
| What is the lead data store? | Airtable, Google Sheets, Notion, Postgres | High — blocks all lead tracking |
| What triggers the post-call follow-up? | Manual trigger by sales rep, or automatic 1 hour after Calendly event end | High — part of hot lead path |
| n8n hosting: self-hosted or n8n cloud? | Self-hosted (more control, more ops), n8n.cloud (easier, paid) | High — blocks all automation |
| Sending mailbox: Google Workspace or Outlook? | Google Workspace (easier warmup), Outlook (Microsoft ecosystem) | Medium |
| Website DNS switch timing | Before paid traffic? After WA QA? | High — don't run ads to a demo domain |
| Which analytics tool tracks lead-to-revenue attribution? | Spreadsheet, CRM, or attribution tool | Low — Month 2 |

---

*Last updated: Phase 0 and Phase 1 are the immediate priorities. Domain warmup has the longest lead time — start it on Day 1.*
