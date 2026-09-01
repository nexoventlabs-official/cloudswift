# EMAIL_AUTOMATION.md

# CloudSwift Email Automation
## Specification — Proposed System

> Status: PROPOSED — email sequences are written and approved.
> Platform setup, domain warmup, and webhook integration are NOT YET BUILT.
> All sections labelled per CLAUDE.md discipline.
> Do not treat PROPOSED items as EXISTING until explicitly marked DECIDED.

---

## 1. PURPOSE

Email operates as both an acquisition channel and a qualification layer.

**EXISTING:** Cold email is a documented acquisition channel. Prospects from cold email
enter the main CloudSwift lead journey.

**PROPOSED:** A structured email automation engine with:
- Four vertical sequences (content written, not yet deployed)
- Webhook-driven lead scoring
- [Sales Rep] notification on hot signals
- Sequence exit on positive reply
- Inbound nurture separate from cold outbound

The email system does NOT replace WhatsApp qualification. It feeds into it.

---

## 2. EMAIL'S ROLE IN THE FUNNEL

```
COLD EMAIL (outbound)
        ↓
Prospect opens / clicks / replies
        ↓
        ├── Replies → [Sales Rep] notified → exits sequence
        │
        ├── Clicks case study → score +1 → stays in sequence
        │
        ├── Visits pricing page → score +3 → HOT threshold → [Sales Rep] notified
        │                                                    + WA link if number known
        └── No engagement after E5 → cold exit
```

```
INBOUND NURTURE (separate list)
        ↓
Prospect submitted form OR entered WA but didn't qualify
        ↓
6-touch sequence over 30 days
        ↓
Any reply → [Sales Rep] notified → exits sequence
```

**Key principle:** Email engagement signals must update the shared lead state.
A prospect who visits the pricing page from an email should be treated as HOT
regardless of which channel they came from.

---

## 3. TECHNICAL STACK

| Component | Tool | Status |
|---|---|---|
| Sending platform | Smartlead | DECIDED |
| API | Smartlead REST API v1 | DECIDED |
| Webhook events | Reply, open, click, bounce, unsubscribe | DECIDED |
| Flow logic / routing | n8n (same instance as WA) | DECIDED |
| [Sales Rep] notification on hot signal | Webhook → WA message to [Sales Rep] | DECIDED |
| Sequence exit on reply | Smartlead native + webhook confirm | DECIDED |
| Cross-channel state sync | n8n middleware | PROPOSED — not yet built |
| Domain warmup | Smartlead SmartDelivery | TODO — start immediately |
| Sending domain | Separate subdomain (e.g. mail.oncloudswift.com) | TODO |
| DKIM / SPF / DMARC | CloudSwift DNS config | TODO — blocker |
| Prospect list import | Vertical CSV per sequence | TODO |

---

## 4. SEQUENCES — OVERVIEW

Four sequences. All copy is written. Platform setup is pending.

| Sequence | Target | Emails | Duration | Hook |
|---|---|---|---|---|
| GCC / Dubai | IT Heads / CTOs at Indian conglomerates with GCC subsidiaries | 5 | 14 days | [Client A] migration case study |
| NBFC / Fintech | CTOs / IT Heads at NBFCs, payment companies, fintech scaling Azure | 5 | 14 days | RBI compliance + Azure security posture |
| SaaS / Healthcare | CTOs / Engineering Heads at B2B SaaS and healthcare tech on Azure | 5 | 14 days | Hiring cost vs MSP model + AKS optimisation |
| Inbound nurture | All warm/inbound leads who didn't complete WA qualification | 6 | 30 days | Already showed interest — follow-up, not cold |

Outbound sequences run at 50 prospects/week (GCC, NBFC) and 30/week (SaaS).
Inbound nurture runs for all leads regardless of volume.

---

## 5. GCC / DUBAI SEQUENCE

**Target:** IT Heads / CTOs at Indian conglomerates with GCC subsidiaries.
**Volume:** 50 prospects / week.
**Sender:** [Sales Rep], [sales@oncloudswift.com] (or subdomain equivalent).

---

### Email 1 — Day 1
**Subject:** `Azure migration for {{company}} — 6-week case study`
**Goal:** Open + curiosity. First line = proof, not pitch.

```
Hi {{first_name}},

We recently helped [Client A] migrate their entire on-prem
infrastructure to Azure in 6 weeks — zero business disruption,
no weekend downtime, full handover to their internal team at
the end.

They were in a situation I suspect {{company}} might recognise:
legacy infrastructure that had grown faster than the team
managing it, a hard deadline from the board, and no confidence
in their existing MSP to deliver.

CloudSwift is an Azure Expert MSP — one of fewer than 30
certified partners in India. We own the migration end-to-end,
and we're accountable for the outcome, not just the effort.

Worth a 20-minute conversation to see if there's a fit?

[Sales Rep]
CloudSwift | Azure Expert MSP
+91 [number]
```

**Design notes:**
- Under 120 words — GCC IT Heads read on mobile
- "A situation {{company}} might recognise" — researched, not generic
- 20 minutes, not "a call" — specific time commitment

---

### Email 2 — Day 3
**Subject:** `The [Client A] migration — what actually happened`
**Goal:** Case study click. Send proof regardless of reply.

```
Hi {{first_name}},

Sending across the [Client A] case study in case it's useful
context.

The short version: 847 VMs migrated, 3 data centres consolidated
into Azure, 6 weeks from kick-off to handover. Their IT Head
told us the biggest surprise was that the migration didn't appear
on any business operations report — meaning nothing broke.

[Read the full case study →]

If {{company}} has Azure infrastructure requirements in the next
quarter, I'd be happy to do a 30-minute architecture review —
no cost, no obligation.

[Sales Rep]
```

**Design notes:**
- One link only — case study, no competing CTAs
- Client quote does the selling — "didn't appear on any operations report" is CFO-level proof

---

### Email 3 — Day 7
**Subject:** `Azure costs at {{company}} — a quick question`
**Goal:** Reply / engagement. CFO-level hook.

```
Hi {{first_name}},

Quick question — is Azure cost optimisation on {{company}}'s
radar for this year?

Most of our clients in the GCC find that 20–35% of their Azure
spend is recoverable through Reserved Instances, right-sizing,
and licensing consolidation. For a company at {{company}}'s
scale, that's usually a meaningful number.

We run a free Azure Cost Review — takes about 2 hours of your
team's time and we give you a written report with specific line
items you can act on immediately, regardless of whether you
work with us.

Worth it?

[Sales Rep]
```

**Design notes:**
- "Worth it?" — two-word reply prompt, lowest possible friction
- Free audit is a lower commitment than a sales call

---

### Email 4 — Day 10
**Subject:** `Microsoft partner benefits — are you using all of them?`
**Goal:** Value email. No pitch.

```
Hi {{first_name}},

Most companies with Microsoft Enterprise Agreements leave
significant partner benefits unclaimed — Azure credits, Defender
for Cloud coverage, Copilot licences, and co-sell support that
reduces procurement cost.

As an Azure Expert MSP, CloudSwift helps clients unlock these
benefits as part of our managed services engagement — not as
an add-on.

I've put together a short checklist of the 7 most commonly
unclaimed Microsoft benefits for GCC-based operations. Happy
to send it across if useful — no form, no follow-up sequence.

Just reply "yes" and I'll send it over.

[Sales Rep]
```

**Design notes:**
- "No form, no follow-up sequence" — removes friction, shows self-awareness
- Reply "yes" = one-word signal of intent

---

### Email 5 — Day 14
**Subject:** `Closing the loop — {{company}}`
**Goal:** Convert or release cleanly. Highest reply rate of any email in the sequence.

```
Hi {{first_name}},

Last email from me — I don't want to clog your inbox.

If Azure infrastructure, managed cloud, or Microsoft licensing
is something {{company}} is actively working through, I'd be
glad to have a conversation. If the timing isn't right,
completely understood.

Either way — if you ever need a second opinion on an Azure
architecture decision or an MSP proposal, CloudSwift is here.

[Sales Rep]
CloudSwift | Azure Expert MSP

P.S. If someone else at {{company}} handles this, a quick
introduction would be genuinely appreciated.
```

**Design notes:**
- "Last email from me" — honest exit, triggers highest reply rate paradoxically
- P.S. referral ask — every exit has a secondary pipeline path
- "Second opinion on an MSP proposal" — specific future use case that aids recall

---

## 6. NBFC / FINTECH SEQUENCE

**Target:** CTOs / IT Heads at NBFCs, payment companies, fintech scaling Azure.
**Volume:** 50 prospects / week.
**Hook:** RBI compliance + Azure security posture.

---

### Email 1 — Day 1
**Subject:** `Azure compliance for {{company}} — RBI + SEBI on cloud`
**Goal:** Open + credibility. Regulatory hook as opener.

```
Hi {{first_name}},

If {{company}} is running financial workloads on Azure, RBI's
cloud outsourcing guidelines and SEBI's cybersecurity framework
create specific infrastructure obligations — data residency,
audit trails, DR requirements within India.

CloudSwift is an Azure Expert MSP specialising in
regulated-industry cloud infrastructure. We've helped NBFCs
and fintech companies build Azure environments that satisfy
both RBI circular requirements and Microsoft's financial
services compliance blueprints.

We run a free Cloud Compliance Review — 2 hours, written
output, no obligation.

Worth a conversation?

[Sales Rep]
CloudSwift | Azure Expert MSP
```

---

### Email 2 — Day 3
**Subject:** `RBI cloud outsourcing — what most NBFCs get wrong`
**Goal:** Education + authority. Pure value, no pitch.

```
Hi {{first_name}},

Three things most NBFCs get wrong on Azure when it comes to
RBI compliance:

1. Data residency — not all Azure regions qualify. India
Central and India South meet the requirement; most other
regions don't.

2. Audit logs — RBI requires 5-year retention. Default Azure
Log Analytics retention is 31 days. The gap is a liability.

3. Vendor lock-in documentation — RBI requires an exit
strategy in your cloud outsourcing agreement. Most MSP
contracts don't include this.

We put together a short checklist of the 12 most common NBFC
Azure compliance gaps. Happy to share — no form required.

Just reply and I'll send it across.

[Sales Rep]
```

---

### Email 3 — Day 7
**Subject:** `Azure security posture at {{company}} — a quick benchmark`
**Goal:** Reply / assessment.

```
Hi {{first_name}},

Quick question — has {{company}} run a Microsoft Secure Score
assessment on your Azure environment recently?

For fintech companies, the average Secure Score we see when
we start an engagement is 42 out of 100. After 90 days of
managed services, our clients are typically at 78+.

The delta matters for two reasons: it directly affects your
RBI audit readiness, and it affects your cyber insurance
premiums.

We run a free Secure Score assessment — takes about 3 hours
of your team's time, and you walk away with a prioritised
remediation list.

Want one?

[Sales Rep]
```

---

### Email 4 — Day 10
**Subject:** `Microsoft Copilot for Finance — is {{company}} eligible?`
**Goal:** Value, forward-looking. AI/Copilot hook is 2026-relevant.

```
Hi {{first_name}},

Microsoft Copilot for Finance is now generally available — and
for companies already on M365 E3/E5, the incremental licence
cost is significantly lower than most teams expect.

For fintech and NBFC teams, the highest-value use cases are:
automated reconciliation review, regulatory report drafting
(MIS, board decks), and fraud pattern summarisation from
transaction logs.

As an Azure Expert MSP and Microsoft partner, CloudSwift helps
clients evaluate and deploy Copilot as part of an existing
managed engagement — no separate implementation project.

Happy to walk through what's relevant for {{company}}'s
current M365 footprint.

[Sales Rep]
```

---

### Email 5 — Day 14
**Subject:** `Last note — {{company}}`
**Goal:** Convert or release.

```
Hi {{first_name}},

Last email from me.

If Azure compliance, managed cloud, or Microsoft licensing is
on {{company}}'s agenda — now or in the next quarter — I'd
be glad to connect.

If not, no problem. The RBI compliance checklist I mentioned
earlier is yours if you want it — just reply anytime and I'll
send it across, no strings.

[Sales Rep]
CloudSwift | Azure Expert MSP

P.S. If someone else at {{company}} owns the cloud
infrastructure decisions, an introduction would be
really helpful.
```

---

## 7. SAAS / HEALTHCARE SEQUENCE

**Target:** CTOs / Engineering Heads at B2B SaaS and healthcare tech on Azure.
**Volume:** 30 prospects / week.
**Hook:** Hiring cost vs MSP model. AKS optimisation. HIPAA + NHA compliance.

---

### Email 1 — Day 1
**Subject:** `Azure managed services for {{company}} — without hiring a cloud team`
**Goal:** Open + relevance. Hiring cost anchor.

```
Hi {{first_name}},

Most B2B SaaS companies at {{company}}'s stage face the same
dilemma: Azure infrastructure is getting complex enough to
need dedicated expertise, but hiring a cloud architect in
India right now costs ₹40–80L/year and takes 3–4 months
to fill.

CloudSwift is an Azure Expert MSP — we give you a dedicated
cloud team (architect, security, NOC) for a fraction of that
cost, on a managed services model that scales with your ARR.

Our clients typically see 40% reduction in cloud incidents
within 60 days and sub-15-minute response on P1 issues, 24/7.

Worth a 20-minute conversation?

[Sales Rep]
CloudSwift | Azure Expert MSP
```

---

### Email 2 — Day 3
**Subject:** `Kubernetes on Azure — what's your current setup?`
**Goal:** Technical engagement. Self-identification mechanic.

```
Hi {{first_name}},

Quick question — is {{company}} running AKS (Azure Kubernetes
Service) or planning to move workloads to containers?

We see three common patterns with SaaS companies at your stage:

1. AKS adopted but not optimised — cluster costs running 2–3x
what they should be

2. Still on VMs — migration to AKS would reduce infra cost
30–50% at scale

3. Hybrid — some containerised, some not — creating
operational complexity

CloudSwift manages AKS environments for several SaaS clients.
Happy to do a free architecture review if you share where
{{company}} currently sits.

[Sales Rep]
```

---

### Email 3 — Day 7
**Subject:** `HIPAA + Azure for {{company}} — if healthcare data is in scope`
**Goal:** Compliance angle. Self-selection P.S.

```
Hi {{first_name}},

If {{company}} handles any patient data or health records —
even indirectly — Azure's healthcare compliance blueprint
(HIPAA BAA, HL7 FHIR, NHA compliance for India) is a
non-negotiable infrastructure requirement.

CloudSwift helps healthcare SaaS companies build Azure
environments that satisfy these requirements without slowing
down product development.

We've found most healthcare tech companies underestimate the
infrastructure overhead of compliance — it typically adds
20–30% to cloud architecture complexity if not designed in
from the start.

Happy to do a quick compliance scoping call — 30 minutes,
no commitment.

[Sales Rep]

P.S. If healthcare data isn't in scope for {{company}},
ignore this one — the earlier emails are more relevant.
```

---

### Email 4 — Day 10
**Subject:** `Azure cost for SaaS — the three levers that matter`
**Goal:** CFO-level value. Scannable format.

```
Hi {{first_name}},

Three Azure cost levers that most SaaS CTOs don't fully use:

1. Reserved Instances — committing 1–3 years on compute gives
40–72% discount vs pay-as-you-go. Most SaaS companies use
less than 20% RI coverage.

2. Azure Hybrid Benefit — if {{company}} has existing Windows
Server or SQL licences, you're likely paying twice for the
same capability.

3. Dev/Test pricing — non-production environments can run at
40–55% discount. Most teams run staging at full price.

Combined, these three typically recover 25–40% of monthly
Azure spend.

CloudSwift identifies these in a free Azure Cost Review —
2 hours, written output.

Worth it?

[Sales Rep]
```

---

### Email 5 — Day 14
**Subject:** `Closing the loop — {{company}}`
**Goal:** Convert or release. "Second opinion on MSP proposal" hook.

```
Hi {{first_name}},

Last email from me on this thread.

If Azure managed services, Kubernetes optimisation, or cloud
cost is on {{company}}'s roadmap — happy to connect at any
point.

If not, no problem at all.

One offer that stands regardless: if {{company}} ever receives
an MSP proposal you'd like a second opinion on — architecture,
pricing, or scope — reach out. No agenda, just a peer review.

[Sales Rep]
CloudSwift | Azure Expert MSP

P.S. If someone else at {{company}} owns infrastructure
decisions, an intro would mean a lot.
```

---

## 8. INBOUND NURTURE SEQUENCE

**Trigger:** Lead submitted form OR entered WA but didn't complete qualification.
**List:** Separate from cold outbound. These prospects already showed interest.
**Duration:** 30 days, 6 emails.
**Tone:** Follow-up, not cold introduction.

---

### Email 1 — Day 1 (immediate)
**Subject:** `Thanks for reaching out — what happens next`
**Goal:** Set expectations. Arrive immediately after form submit or WA enquiry.

```
Hi {{first_name}},

Thanks for getting in touch with CloudSwift.

[Sales Rep] from our solutions team will be in touch within 24 hours
to understand what you're working through. In the meantime,
a few things that might be useful:

→ [Client A] case study — Azure migration, 6 weeks,
  zero disruption [link]
→ CloudSwift managed services overview — what we cover
  and how [link]
→ Free Azure assessment — book a slot directly if you'd
  prefer [Calendly link]

No pressure on any of these — just context while you wait.

CloudSwift Team
```

---

### Email 2 — Day 3
**Subject:** `One question — {{first_name}}`
**Goal:** Qualify via email for prospects who didn't complete WA flow.

```
Hi {{first_name}},

Just following up from your enquiry earlier this week.

Quick question — what's the main thing you're trying to solve
right now? Even a one-line answer helps us connect you with
the right person at CloudSwift.

Is it:
A) Azure migration or infrastructure
B) Cloud cost reduction
C) Managed services / MSP replacement
D) Security or compliance
E) Something else

Happy to jump on a call this week if that's easier.

[Sales Rep]
CloudSwift
```

**Note:** A/B/C/D/E format is the email equivalent of WA quick-reply buttons.
Any single-letter reply is treated as a positive engagement signal.

---

### Email 3 — Day 7
**Subject:** `The [Client A] migration — in case you missed it`
**Goal:** Case study delivery regardless of prior engagement.

```
Hi {{first_name}},

Sending this across in case it's useful context for whatever
you're evaluating.

[Client A] — 847 VMs, 3 data centres, migrated to Azure
in 6 weeks. The constraint was a hard go-live date set by
the board. The result was a migration that didn't appear on
a single business operations report.

[Read the full case study →]

If CloudSwift looks like a potential fit, [Sales Rep]'s calendar
is open for a 30-minute call this week:
[Calendly link]

No prep needed — just a conversation.

CloudSwift Team
```

---

### Email 4 — Day 14
**Subject:** `Free Azure assessment — still available`
**Goal:** Low-friction CTA. Assessment reframes value delivery over sales call.

```
Hi {{first_name}},

We run a free Azure infrastructure assessment — 2 hours of
your team's time, written report, specific recommendations
you can act on regardless of whether you work with CloudSwift.

No pitch, no obligation. We do this because the conversation
is usually more useful than any slide deck.

If {{company}} has Azure infrastructure, a pending migration,
or an MSP contract coming up for renewal — this is worth
your time.

Book directly: [Calendly link]

[Sales Rep]
CloudSwift | Azure Expert MSP
```

---

### Email 5 — Day 21
**Subject:** `Checking in — {{first_name}}`
**Goal:** Re-engage or score up. Name the "gone quiet" patterns.

```
Hi {{first_name}},

Just checking in — has anything changed on your end regarding
cloud infrastructure or managed services?

We've seen a few patterns with companies that reach out and
then go quiet: either the timing shifted, the project got
deprioritised, or a decision got made internally.

All of those are fine. But if you're still evaluating options,
CloudSwift is worth a conversation — especially if you've
received a proposal from another MSP and want a second opinion.

Happy to connect whenever the timing works.

[Sales Rep]
```

---

### Email 6 — Day 30
**Subject:** `Last note — {{company}}`
**Goal:** Final convert or release. "No expiry" assessment offer.

```
Hi {{first_name}},

Last note from me.

If CloudSwift is relevant to what {{company}} is working
through — now or in the future — you know where to find us.

The free Azure assessment stands as an open offer. No expiry.
Just reply anytime and we'll set it up.

And if someone else at {{company}} is the right person for
this conversation — an introduction would mean the world.

Take care,

[Sales Rep]
CloudSwift | Azure Expert MSP
[website] | [WhatsApp]
```

---

## 9. LEAD SCORING — EMAIL SIGNALS

Email engagement events update the lead's score via Smartlead webhooks.

| Event | Signal strength | Score change | Action |
|---|---|---|---|
| Email opened | Weak (Gmail suppresses ~40%) | +0 (not scored) | None |
| Link clicked (case study) | Medium | +1 | Stays in sequence |
| Link clicked (pricing page) | Strong | +2 | [Sales Rep] notified |
| Reply received (any content) | Very strong | Exits sequence | [Sales Rep] notified immediately |
| A/B/C/D qualification reply | Very strong | Treated as HOT signal | Flow 3 equivalent |
| Pricing page visit (website) | Very strong | +3, HOT threshold | [Sales Rep] notified + WA link if number known |
| Calendly booked | Confirmed intent | HOT | Pre-call brief triggered |
| Unsubscribe | Negative | Remove from all sequences | Log, do not contact |
| Bounce | Invalid contact | Remove | Flag for data review |

**HOT threshold:** Score ≥ 3 from email signals, or any direct reply, triggers [Sales Rep] notification.

---

## 10. ROUTING ON EMAIL REPLY

When Smartlead detects a reply:

1. Sequence paused immediately for that prospect
2. Webhook fires to n8n
3. n8n sends [Sales Rep] a WA brief:

```
📧 Email reply — [Name], [Company]

Sequence: [GCC / NBFC / SaaS / Inbound]
Email replied to: [E1 / E3 / etc]
Their reply: "[reply content verbatim]"

→ Reply directly: [their email]
→ Their WA (if known): wa.me/[number]
```

4. [Sales Rep] responds via email or switches to WA if number is available
5. Lead state updated to HOT in the system

---

## 11. DOMAIN WARMUP PLAN

**IMPORTANT:** Cold email at volume from a fresh domain = spam folder = wasted sequences.
Warmup must start BEFORE sequences go live.

| Week | Daily send volume | Activity |
|---|---|---|
| Week 1–2 | 10–20/day | Smartlead SmartDelivery warmup only. No prospect emails. |
| Week 3 | 20–30/day | Inbound nurture only (warm leads — safer for domain) |
| Week 4 | 30–50/day | GCC sequence begins (50 prospects/week = ~10/day) |
| Week 5+ | 50–80/day | NBFC + SaaS sequences added |

**Sending domain:** Use a subdomain — mail.oncloudswift.com or outreach.oncloudswift.com.
Never use the primary domain (oncloudswift.com) for cold outbound.
Primary domain reputation is too valuable to risk.

---

## 12. PRE-LAUNCH CHECKLIST

| Item | Owner | Status |
|---|---|---|
| Sending subdomain created | CloudSwift (DNS) | TODO — blocker |
| DKIM record added | CloudSwift (DNS) | TODO — blocker |
| SPF record updated | CloudSwift (DNS) | TODO — blocker |
| DMARC policy set | CloudSwift (DNS) | TODO — recommended |
| Smartlead account created | SIGNAL | TODO |
| Sending mailbox provisioned (Google Workspace or Outlook) | CloudSwift / SIGNAL | TODO |
| SmartDelivery warmup started | SIGNAL | TODO — start Week 1 |
| Prospect list: GCC (50 contacts) | CloudSwift — [Sales Rep]'s network + LinkedIn | TODO |
| Prospect list: NBFC (50 contacts) | CloudSwift — [Sales Rep]'s network + LinkedIn | TODO |
| Prospect list: SaaS (30 contacts) | CloudSwift — [Sales Rep]'s network + LinkedIn | TODO |
| [Sales Rep] approves tone for all sequences | [Sales Rep] | TODO — before launch |
| Smartlead webhook → n8n endpoint configured | SIGNAL | TODO |
| n8n → WA notification to [Sales Rep] tested | SIGNAL | TODO |
| Unsubscribe link in all emails | SIGNAL | TODO — legal requirement |
| Reply-to address confirmed | SIGNAL + CloudSwift | TODO |

---

## 13. FAILURE HANDLING

| Failure | Behaviour | Status |
|---|---|---|
| Smartlead API timeout | Retry via webhook. Log if persistent. | TODO |
| Bounce rate > 5% | Pause sequence. Review list quality. | TODO |
| Reply parsing fails | Log raw reply. Alert [Sales Rep] manually. Never silently lose. | TODO |
| Webhook to n8n fails | Smartlead retry + dead-letter queue. | TODO |
| [Sales Rep] WA notification fails | Fallback to email notification. | TODO |
| Unsubscribe not processed | Legal risk. Must process within 10 seconds. | TODO |
| Domain reputation drops | Pause all outbound. Review send patterns. | TODO |

---

## 14. WHAT EMAIL CANNOT DO (vs WhatsApp)

| Capability | WhatsApp | Email |
|---|---|---|
| Structured qualification (buttons) | ✓ Quick-reply buttons | ✗ Free text only — use A/B/C/D format as workaround |
| Delivery confirmation | ✓ Blue ticks, native | ✗ Open pixel (~40% suppressed) |
| No spam folder | ✓ Always delivered to WA | ✗ Requires warmup + good practices |
| Read receipts | ✓ Blue ticks | ✗ Unreliable |
| Pre-approval required | ✓ Meta template review (24–72h) | ✗ No approval needed — faster launch |
| Attachment support | Limited | ✓ PDF case studies inline |
| Copy length | Short (160 char ideal) | ✓ Longer form possible |
| Launch speed | 7–10 days (Meta approval) | ✓ 5–7 days setup (warmup runs parallel) |

---

## 15. PROPOSED — FUTURE PHASE (DO NOT BUILD NOW)

The following are explicitly PROPOSED and must not be treated as existing:

- **PROPOSED:** AI reply parsing — Claude reads reply content and auto-classifies intent
- **PROPOSED:** Email ↔ WhatsApp state sync — email engagement automatically updates WA lead state in real-time without manual middleware
- **PROPOSED:** Dynamic email personalisation — AI generates company-specific first lines per prospect
- **PROPOSED:** Predictive scoring — ML model predicts buying intent from email engagement patterns
- **PROPOSED:** Automated prospect sourcing — system finds and adds prospects to sequences automatically

These are Month 2+ features. Build them only after the 100-prospect experiment produces real conversion data.

---

## 16. RELATIONSHIP TO WHATSAPP_AUTOMATION.md

Email and WhatsApp are parallel systems in the immediate build.
They share the same lead classification (HOT/WARM/COLD) and the same [Sales Rep] notification channel.
They do NOT yet share a live lead state database.

Cross-channel sync rule (current):
- If a prospect is in an email sequence AND messages on WhatsApp → WA takes over, email sequence paused manually
- If a prospect books via Calendly from an email → treat as HOT, notify [Sales Rep] via WA brief

**Full automated cross-channel sync is PROPOSED, not EXISTING.**

---

## 17. SUCCESS METRICS

The 100-prospect experiment (first 4 weeks) measures:

| Metric | Definition |
|---|---|
| Delivery rate | Emails delivered / emails sent. Target > 95% |
| Open rate | Proxy signal only. Target > 35% |
| Reply rate | Replies / delivered. Target > 3% for cold, > 8% for inbound |
| Click rate | Clicks / delivered. Target > 5% |
| Meeting rate | Calendly bookings / qualified replies |
| HOT conversion | Prospects reaching HOT state from email signals |
| Revenue attribution | Closed deals traced to email as first or assisted touch |

If reply rate < 1% after 2 weeks: review subject lines and E1 copy before adding more prospects.
If bounce rate > 5%: pause and review list quality immediately.
