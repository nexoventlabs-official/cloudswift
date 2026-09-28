"use client";

import type { ReactNode } from "react";
import { useVisualPlay } from "./useVisualPlay";
import styles from "./AiSectionVisual.module.css";

type Slot = "overview" | "definition";

function Caption({ children }: { children: string }) {
  return <p className={styles.caption}>{children}</p>;
}

/* ── Customer support: ticket stack → agent → two doors ── */
function SupportOverview() {
  return (
    <div className={styles.scene}>
      <div className={styles.canvas}>
        <div className={styles.stack}>
          <article>
            <em>#4821</em>
            <strong>Where is my order?</strong>
          </article>
          <article>
            <em>#4819</em>
            <strong>Reset my password</strong>
          </article>
          <article>
            <em>#4814</em>
            <strong>Invoice copy</strong>
          </article>
        </div>
        <div className={styles.agentCard}>
          <span>Support agent</span>
          <small>Reads knowledge + this thread</small>
        </div>
        <div className={styles.doors}>
          <div className={styles.doorOk}>
            <strong>Resolved</strong>
            <small>On-brand reply</small>
          </div>
          <div className={styles.doorHuman}>
            <strong>Human</strong>
            <small>Full thread handed off</small>
          </div>
        </div>
      </div>
      <Caption>Repeat tickets leave the queue. Judgement still reaches a person.</Caption>
    </div>
  );
}

/* ── Customer support: docs fly into a confidence gate ── */
function SupportDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.ask}>“Where is my order?”</div>
      <div className={styles.flyRow}>
        <span>Docs</span>
        <span>Past tickets</span>
        <span>Orders</span>
      </div>
      <div className={styles.gate}>
        <strong>Grounded?</strong>
        <small>Low confidence does not guess</small>
        <div className={styles.meter} aria-hidden>
          <i />
        </div>
      </div>
      <div className={styles.doors}>
        <div className={styles.doorOk}>
          <strong>Reply</strong>
          <small>Tied to your content</small>
        </div>
        <div className={styles.doorHuman}>
          <strong>Escalate</strong>
          <small>Human gets the thread</small>
        </div>
      </div>
      <Caption>A support agent is retrieval plus a gate — not a scripted menu.</Caption>
    </div>
  );
}

/* ── Knowledge: hub and spoke — sources wired into one agent ── */
function KnowledgeOverview() {
  const nodes = [
    { label: "Wiki", sub: "How teams write", x: 50, y: 12 },
    { label: "Policies", sub: "Rules to follow", x: 14, y: 48 },
    { label: "Product", sub: "Specs that change", x: 86, y: 48 },
    { label: "Chat / drives", sub: "Where answers hid", x: 50, y: 84 },
  ];
  return (
    <div className={styles.scene}>
      <div className={`${styles.canvas} ${styles.hubCanvas}`}>
        <div className={styles.hubGlobe} aria-hidden>
          <span />
          <span />
        </div>
        <svg className={styles.hubWires} viewBox="0 0 100 100" aria-hidden>
          <defs>
            <filter id="know-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="0.7" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {nodes.map((n, i) => (
            <g key={n.label}>
              <line x1="50" y1="48" x2={n.x} y2={n.y} className={styles.wireBase} />
              <circle r="1.1" fill="#d7f6ff" filter="url(#know-glow)">
                <animateMotion
                  dur="2.8s"
                  begin={`${i * 0.35}s`}
                  repeatCount="indefinite"
                  path={`M 50 48 L ${n.x} ${n.y}`}
                />
              </circle>
            </g>
          ))}
        </svg>
        <div className={styles.hubCenter}>
          <strong>Knowledge agent</strong>
          <small>One permitted answer</small>
        </div>
        {nodes.map((n) => (
          <div
            key={n.label}
            className={styles.hubNode}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <strong>{n.label}</strong>
            <small>{n.sub}</small>
          </div>
        ))}
      </div>
      <Caption>Many stores in. One governed answer out.</Caption>
    </div>
  );
}

/* ── Knowledge: permission layers ── */
function KnowledgeDefinition() {
  const layers = [
    { title: "Ask", sub: "Ordinary language, not keywords" },
    { title: "Role check", sub: "Existing permissions first" },
    { title: "Agentic RAG", sub: "Search and combine related docs" },
    { title: "Answer or flag", sub: "A gap stays a gap" },
  ];
  return (
    <div className={styles.scene}>
      <div className={styles.layers}>
        {layers.map((l, i) => (
          <div key={l.title} className={styles.layer} style={{ ["--d" as string]: `${i * 0.7}s` }}>
            <em>{String(i + 1).padStart(2, "0")}</em>
            <strong>{l.title}</strong>
            <small>{l.sub}</small>
          </div>
        ))}
        <i className={styles.layerDrop} aria-hidden />
      </div>
      <Caption>Not a search box. A governed answer, or a hole in the corpus.</Caption>
    </div>
  );
}

/* ── Deploy: horizontal pipe, package rides the rail ── */
function DeployOverview() {
  const stops = [
    { title: "Trained", sub: "Still in the notebook" },
    { title: "Pack", sub: "Container + deps" },
    { title: "Register", sub: "Version, then approve" },
    { title: "Serve", sub: "Live API or batch" },
  ];
  return (
    <div className={styles.scene}>
      <div className={styles.pipe}>
        <div className={styles.rail} aria-hidden>
          <i />
        </div>
        <ol>
          {stops.map((s, i) => (
            <li key={s.title} style={{ ["--d" as string]: `${i * 0.9}s` }}>
              <em>{String(i + 1).padStart(2, "0")}</em>
              <strong>{s.title}</strong>
              <small>{s.sub}</small>
            </li>
          ))}
        </ol>
      </div>
      <Caption>Deployment is this path — the moment a model can be called in production.</Caption>
    </div>
  );
}

/* ── Deploy: three concentric jobs ── */
function DeployDefinition() {
  return (
    <div className={styles.scene}>
      <div className={`${styles.canvas} ${styles.ringsCanvas}`}>
        <div className={`${styles.ring} ${styles.ringOuter}`} />
        <div className={`${styles.ring} ${styles.ringMid}`} />
        <div className={`${styles.ring} ${styles.ringCore}`}>
          <span>Live model</span>
        </div>
      </div>
      <ol className={styles.ringKeys}>
        <li>
          <em>Inner</em> Deployment — package, gates, release
        </li>
        <li>
          <em>Middle</em> Serving — the runtime that returns predictions
        </li>
        <li>
          <em>Outer</em> Monitoring — drift and latency after go-live
        </li>
      </ol>
      <Caption>Three jobs. Serving and monitoring are not the same as deployment.</Caption>
    </div>
  );
}

/* ── HR: pigeonholes — repeats drop to the assistant ── */
function HrOverview() {
  return (
    <div className={styles.scene}>
      <div className={styles.holes}>
        {["PTO", "Benefits", "Policy", "HRIS"].map((label) => (
          <div key={label} className={styles.hole}>
            <span>{label}</span>
          </div>
        ))}
        <i className={styles.letter} aria-hidden />
      </div>
      <div className={styles.agentCard}>
        <span>HR assistant</span>
        <small>Takes the repeats off the desk</small>
      </div>
      <div className={styles.doors}>
        <div className={styles.doorOk}>
          <strong>Instant answer</strong>
          <small>HRIS + policy</small>
        </div>
        <div className={styles.doorHuman}>
          <strong>HR team</strong>
          <small>Sensitive or unclear</small>
        </div>
      </div>
      <Caption>Same questions every week go to the assistant. Exceptions still reach HR.</Caption>
    </div>
  );
}

/* ── HR: chat transcript ── */
function HrDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.thread}>
        <div className={`${styles.bubble} ${styles.in}`}>How much PTO do I have left?</div>
        <div className={styles.lookup}>Looking up HRIS · handbook</div>
        <div className={`${styles.bubble} ${styles.out}`}>12 days remaining. Policy: request 14 days ahead.</div>
        <div className={`${styles.bubble} ${styles.in}`}>Can I take leave during probation?</div>
        <div className={styles.handoff}>Sensitive — handed to HR with the person attached</div>
      </div>
      <Caption>A permissioned lookup with a human path — not a public chatbot.</Caption>
    </div>
  );
}

/* ── Sales: funnel, lead falls through ── */
function SalesOverview() {
  const bands = [
    { title: "Lead in", sub: "Channels you already run" },
    { title: "Score", sub: "Who is worth a rep this week" },
    { title: "Write the CRM", sub: "Notes and fields, no after-hours typing" },
    { title: "Next action", sub: "Follow-up queued — rep in control" },
  ];
  return (
    <div className={styles.scene}>
      <div className={styles.funnel}>
        {bands.map((b, i) => (
          <div key={b.title} className={styles.band} style={{ ["--d" as string]: `${i * 0.85}s` }}>
            <strong>{b.title}</strong>
            <small>{b.sub}</small>
          </div>
        ))}
        <i className={styles.fall} aria-hidden />
      </div>
      <Caption>Admin moves down this funnel. The relationship does not.</Caption>
    </div>
  );
}

/* ── Sales: checklist vs the deal the rep owns ── */
function SalesDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.desk}>
        <section className={styles.checks}>
          <span className={styles.kicker}>Assistant handles</span>
          {["CRM fields after the call", "Follow-up drafted from the deal", "Lead scored for the week"].map(
            (t, i) => (
              <label key={t} style={{ ["--d" as string]: `${i * 0.8}s` }}>
                <i />
                {t}
              </label>
            )
          )}
        </section>
        <section className={styles.deal}>
          <span className={styles.kicker}>Rep keeps</span>
          <strong>Northwind · Stage 3</strong>
          <small>Fit, pricing, the close. CRM stays source of truth.</small>
        </section>
      </div>
      <Caption>Deal-grounded admin — not a bot that sells for you.</Caption>
    </div>
  );
}

/* ── Monitoring: oscilloscope + threshold + alert ── */
function MonitorOverview() {
  return (
    <div className={styles.scene}>
      <div className={styles.scope}>
        <span className={styles.threshold}>threshold</span>
        <svg viewBox="0 0 320 110" aria-hidden>
          <path
            className={styles.wave}
            d="M0 58 C28 58 36 58 52 58 C70 58 78 22 96 22 C114 22 118 86 138 86 C158 86 164 40 184 40 C204 40 214 58 232 58 C248 58 256 58 270 18 C282 18 290 18 320 18"
          />
        </svg>
        <b className={styles.alert}>ALERT</b>
      </div>
      <div className={styles.gauges}>
        <div>
          <strong>Drift</strong>
          <small>Live ≠ training</small>
        </div>
        <div>
          <strong>Latency</strong>
          <small>Serving slows</small>
        </div>
        <div>
          <strong>Accuracy</strong>
          <small>Quality slips</small>
        </div>
      </div>
      <Caption>Monitoring watches a live model so it does not fail quietly.</Caption>
    </div>
  );
}

/* ── Monitoring: circular live → detect → act loop ── */
function MonitorDefinition() {
  const stops = [
    { label: "Live", sub: "Already serving", x: 50, y: 12 },
    { label: "Detect", sub: "Drift, latency", x: 88, y: 50 },
    { label: "Act", sub: "Retrain or roll back", x: 50, y: 88 },
    { label: "Live again", sub: "Next version", x: 12, y: 50 },
  ];
  return (
    <div className={styles.scene}>
      <div className={`${styles.canvas} ${styles.loopCanvas}`}>
        <svg className={styles.loopSvg} viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="32" className={styles.loopRing} />
          <circle r="1.6" fill="#e0faff">
            <animateMotion dur="4s" repeatCount="indefinite" path="M 50 18 A 32 32 0 1 1 49.99 18" />
          </circle>
        </svg>
        <div className={styles.loopCore}>
          <strong>Observe</strong>
          <small>Then act</small>
        </div>
        {stops.map((s) => (
          <div key={s.label} className={styles.loopStop} style={{ left: `${s.x}%`, top: `${s.y}%` }}>
            <strong>{s.label}</strong>
            <small>{s.sub}</small>
          </div>
        ))}
      </div>
      <Caption>Observability is a loop you run, not a chart you glance at.</Caption>
    </div>
  );
}

/* ── Workflow: diamond flowchart with exception that rejoins ── */
function WorkflowOverview() {
  return (
    <div className={styles.scene}>
      <div className={`${styles.canvas} ${styles.flowCanvas}`}>
        <svg className={styles.flowWires} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <path d="M50 16 L50 30" className={styles.flowLine} />
          <path d="M50 46 L22 60" className={styles.flowLine} />
          <path d="M50 46 L78 60" className={styles.flowDash} />
          <path d="M22 74 L50 86" className={styles.flowLine} />
          <path d="M78 74 L50 86" className={styles.flowDash} />
          <circle r="1.3" fill="#e0faff">
            <animateMotion dur="4.2s" repeatCount="indefinite" path="M50 16 L50 38 L22 62 L50 88" />
          </circle>
        </svg>
        <div className={`${styles.flowNode} ${styles.fnIntake}`}>
          <strong>Intake</strong>
          <small>Event or a person</small>
        </div>
        <div className={`${styles.flowNode} ${styles.fnDecide}`}>
          <strong>Decide</strong>
          <small>Multi-step, not one if/then</small>
        </div>
        <div className={`${styles.flowNode} ${styles.fnAct}`}>
          <strong>Act + log</strong>
          <small>Writes to your tools</small>
        </div>
        <div className={`${styles.flowNode} ${styles.fnEx}`}>
          <strong>Exception</strong>
          <small>Human, then continue</small>
        </div>
        <div className={`${styles.flowNode} ${styles.fnJoin}`}>
          <strong>Case continues</strong>
          <small>Process does not die</small>
        </div>
      </div>
      <Caption>The case can branch. The process does not die at the first surprise.</Caption>
    </div>
  );
}

/* ── Workflow: broken chain vs living chain ── */
function WorkflowDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.chains}>
        <div className={`${styles.chain} ${styles.broken}`}>
          <span className={styles.kicker}>Brittle script</span>
          <b>Trigger</b>
          <i />
          <b>Same steps</b>
          <i className={styles.crack} />
          <b className={styles.dead}>Stops</b>
        </div>
        <div className={`${styles.chain} ${styles.alive}`}>
          <span className={styles.kicker}>Agentic workflow</span>
          <b>Trigger</b>
          <i />
          <b>Decide + tools</b>
          <i />
          <b>Logged outcome</b>
        </div>
      </div>
      <Caption>The difference is a decision in the middle — not another zap.</Caption>
    </div>
  );
}

/* ── Chat: three channels merge into one thread ── */
function ChatOverview() {
  return (
    <div className={styles.scene}>
      <div className={styles.channels}>
        <span>Web</span>
        <span>Email</span>
        <span>Voice</span>
      </div>
      <svg className={styles.merge} viewBox="0 0 100 28" aria-hidden>
        <path d="M16 2 C16 18 50 8 50 26" />
        <path d="M50 2 L50 26" />
        <path d="M84 2 C84 18 50 8 50 26" />
        <circle r="1.4" fill="#e0faff">
          <animateMotion dur="2.4s" repeatCount="indefinite" path="M16 2 C16 18 50 8 50 26" />
        </circle>
      </svg>
      <div className={styles.thread}>
        <div className={`${styles.bubble} ${styles.in}`}>Same customer, three channels</div>
        <div className={`${styles.bubble} ${styles.out}`}>One conversation. Same policy, same audit log.</div>
      </div>
      <Caption>Every channel lands in one thread. Nothing is a side bot with different rules.</Caption>
    </div>
  );
}

/* ── Chat: menu tree that dies vs retrieve path ── */
function ChatDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.treeVs}>
        <div className={styles.tree}>
          <span className={styles.kicker}>Scripted tree</span>
          <b>Pick a number</b>
          <div className={styles.treeKids}>
            <div>
              <b>Menu A</b>
              <em>Stuck</em>
            </div>
            <div>
              <b>Menu B</b>
              <em>Stuck</em>
            </div>
          </div>
        </div>
        <div className={styles.retrieve}>
          <span className={styles.kicker}>Enterprise chatbot</span>
          <ol>
            <li>Ask in natural language</li>
            <li>Retrieve knowledge + identity</li>
            <li>Reply, or hand off</li>
          </ol>
        </div>
      </div>
      <Caption>A demo bot walks a tree. An enterprise bot retrieves, then stops when it should.</Caption>
    </div>
  );
}

/* ── Documents: scan a page, fields lift out ── */
function DocOverview() {
  return (
    <div className={styles.scene}>
      <div className={styles.extract}>
        <div className={styles.page}>
          <span />
          <span />
          <span />
          <span />
          <i className={styles.scan} />
          <em>Invoice</em>
        </div>
        <ul>
          <li style={{ ["--d" as string]: "0.2s" }}>
            <em>Invoice no.</em>
            <strong>INV-4821</strong>
          </li>
          <li style={{ ["--d" as string]: "0.9s" }}>
            <em>Date</em>
            <strong>12 Mar 2026</strong>
          </li>
          <li style={{ ["--d" as string]: "1.6s" }}>
            <em>Amount</em>
            <strong>$4,280.00</strong>
          </li>
        </ul>
      </div>
      <Caption>Classified, then read as fields — a record, not a photo of text.</Caption>
    </div>
  );
}

/* ── Documents: OCR soup vs structured record to ERP ── */
function DocDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.ocrVs}>
        <div className={styles.soup}>
          <span className={styles.kicker}>OCR</span>
          <p>INV 4 8 2 1 &nbsp; M a r &nbsp; 1 2 &nbsp; $ 4 2 8 0 &nbsp; Qty 12 &nbsp; PO-9</p>
          <small>Characters. No type. Nowhere to send them.</small>
        </div>
        <div className={styles.record}>
          <span className={styles.kicker}>Document intelligence</span>
          <table>
            <tbody>
              <tr>
                <th>Type</th>
                <td>Invoice</td>
              </tr>
              <tr>
                <th>No.</th>
                <td>INV-4821</td>
              </tr>
              <tr>
                <th>Amount</th>
                <td>4280.00</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.toErp}>→ ERP</div>
        </div>
      </div>
      <Caption>OCR reads the page. Document intelligence understands it and ships a record.</Caption>
    </div>
  );
}

/* ── Infra: GPU blades lighting under orchestration ── */
function InfraOverview() {
  return (
    <div className={styles.scene}>
      <span className={styles.kicker}>Orchestration</span>
      <div className={styles.gpus}>
        {["Training job", "Inference pool", "Shared storage"].map((label, i) => (
          <div key={label} className={styles.gpu} style={{ ["--d" as string]: `${i * 0.7}s` }}>
            <strong>{label}</strong>
            <i />
          </div>
        ))}
      </div>
      <div className={styles.costBar}>
        <span>GPU spend</span>
        <em>tracked</em>
      </div>
      <Caption>Compute, storage, and cost sit under one orchestration layer — not three mystery bills.</Caption>
    </div>
  );
}

/* ── Infra: everyday IT vs AI-scale compute ── */
function InfraDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.stacks}>
        <div className={styles.cpuStack}>
          <span className={styles.kicker}>Standard IT</span>
          <b>Web / DB traffic</b>
          <b>CPU instances</b>
          <small>Fine until a training run hits</small>
        </div>
        <div className={styles.gpuStack}>
          <span className={styles.kicker}>AI infrastructure</span>
          <b>GPU / TPU</b>
          <b>High-throughput pipes</b>
          <b>Train + serve + watch</b>
        </div>
      </div>
      <Caption>AI infrastructure is concentrated compute on purpose — not a web stack asked to train a model.</Caption>
    </div>
  );
}

/* ── Dev: rising stages from idea to production ── */
function DevOverview() {
  const stairs = [
    { title: "Problem", sub: "A real workflow" },
    { title: "Ready?", sub: "Data + infra check" },
    { title: "POC", sub: "Cheap proof" },
    { title: "Production", sub: "Users, then MLOps" },
  ];
  return (
    <div className={styles.scene}>
      <div className={styles.stairs}>
        {stairs.map((s, i) => (
          <div key={s.title} className={styles.stair} style={{ ["--h" as string]: `${32 + i * 18}%`, ["--d" as string]: `${i * 0.7}s` }}>
            <strong>{s.title}</strong>
            <small>{s.sub}</small>
          </div>
        ))}
        <i className={styles.climber} aria-hidden />
      </div>
      <Caption>Custom AI starts with a check and a cheap proof — not a six-month leap.</Caption>
    </div>
  );
}

/* ── Dev: generic tool that doesn't fit vs custom around your data ── */
function DevDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.fit}>
        <div className={styles.misfit}>
          <span className={styles.kicker}>Off-the-shelf</span>
          <div className={styles.peg} />
          <div className={styles.hole} />
          <small>Generic case works. Your workflow does not.</small>
        </div>
        <div className={styles.fitted}>
          <span className={styles.kicker}>Custom AI</span>
          <div className={styles.pegOk} />
          <small>Shaped to your data, tools, and the one process that matters.</small>
        </div>
      </div>
      <Caption>Development services build the system around you. A product forces you around it.</Caption>
    </div>
  );
}

/* ── MVP: cut scope, then go or no-go ── */
function MvpOverview() {
  return (
    <div className={styles.scene}>
      <div className={styles.scope}>
        <div className={styles.fullBuild}>Full product</div>
        <div className={styles.cut}>MVP — one hypothesis</div>
      </div>
      <div className={styles.users}>
        <span>Real users</span>
        <span>Usage data</span>
      </div>
      <div className={styles.verdict}>
        <div className={styles.go}>Go</div>
        <div className={styles.nogo}>No-go</div>
      </div>
      <Caption>Smallest working version, real signal, then a decision — before the budget is spent.</Caption>
    </div>
  );
}

/* ── MVP: prototype vs POC vs MVP ── */
function MvpDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.rungs}>
        <div className={styles.rungDim}>
          <em>Prototype</em>
          <strong>Demo</strong>
          <small>Can look good. May never meet a user.</small>
        </div>
        <div className={styles.rungMid}>
          <em>POC</em>
          <strong>Can we build it?</strong>
          <small>Technical feasibility. Not always usage.</small>
        </div>
        <div className={styles.rungOn}>
          <em>AI MVP</em>
          <strong>Do users care?</strong>
          <small>Working feature. Real feedback.</small>
        </div>
      </div>
      <Caption>An MVP is the one built to be tested — not a slide, not a lab demo.</Caption>
    </div>
  );
}

/* ── ChatGPT: seats-only vs actually connected ── */
function ChatGptOverview() {
  return (
    <div className={styles.scene}>
      <div className={styles.seats}>
        <div className={styles.seatCard}>
          <span className={styles.kicker}>Seats purchased</span>
          <strong>ChatGPT tab</strong>
          <small>Copy-paste. No SSO. No policy.</small>
        </div>
        <div className={styles.seatLive}>
          <span className={styles.kicker}>Integrated</span>
          <strong>SSO · retention · connectors</strong>
          <small>Inside SharePoint, Slack, Drive — governed.</small>
        </div>
      </div>
      <Caption>Buying seats is not a rollout. Integration is the work after the invoice.</Caption>
    </div>
  );
}

/* ── ChatGPT: employee through SSO into governed usage ── */
function ChatGptDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.ssoPath}>
        <div className={styles.ssoNode}>
          <strong>Employee</strong>
          <small>Same identity</small>
        </div>
        <i className={styles.ssoLock} aria-hidden />
        <div className={styles.ssoNode}>
          <strong>IdP / SSO</strong>
          <small>Okta · Entra · Google</small>
        </div>
        <div className={styles.ssoCore}>
          <strong>ChatGPT Enterprise</strong>
          <small>OpenAI product, configured here</small>
        </div>
      </div>
      <div className={styles.ssoLegs}>
        <span>Retention</span>
        <span>DLP</span>
        <span>SharePoint / Slack</span>
      </div>
      <Caption>SSO in. Policy and connectors on. Independent of OpenAI — we configure, they license.</Caption>
    </div>
  );
}

/* ── Readiness: four dimensions fill, then a score ── */
function ReadinessOverview() {
  const dims = [
    { title: "Data", sub: "Quality & access" },
    { title: "Infrastructure", sub: "Compute & pipes" },
    { title: "Team", sub: "Skills vs assumed" },
    { title: "Alignment", sub: "One picture of ready" },
  ];
  return (
    <div className={styles.scene}>
      <div className={styles.scorecard}>
        {dims.map((d, i) => (
          <div key={d.title} className={styles.scoreRow} style={{ ["--d" as string]: `${i * 0.55}s` }}>
            <strong>{d.title}</strong>
            <small>{d.sub}</small>
            <i />
          </div>
        ))}
      </div>
      <div className={styles.scoreOut}>
        <span>Prioritized score</span>
        <em>Proceed · or name the gaps</em>
      </div>
      <Caption>Four bars against this initiative — not a vague “you’re not ready.”</Caption>
    </div>
  );
}

/* ── Readiness: this project vs whole-org maturity ── */
function ReadinessDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.dials}>
        <div className={styles.dialOn}>
          <span className={styles.kicker}>Readiness</span>
          <b>This project</b>
          <small>Can we start this, now — and what’s missing?</small>
        </div>
        <div className={styles.dialDim}>
          <span className={styles.kicker}>Maturity</span>
          <b>Whole org</b>
          <small>How sophisticated is AI across the business?</small>
        </div>
      </div>
      <Caption>Readiness is narrower: this initiative, right now. Maturity is a different question.</Caption>
    </div>
  );
}

/* ── Roadmap: sticky ideas snap into a sequence ── */
function RoadmapOverview() {
  return (
    <div className={styles.scene}>
      <div className={styles.notes}>
        <span>Pilot A</span>
        <span>Board idea</span>
        <span>Team wishlist</span>
        <span>Unnamed gap</span>
      </div>
      <div className={styles.seq}>
        <div><em>01</em><strong>Discover</strong></div>
        <div><em>02</em><strong>Score</strong></div>
        <div><em>03</em><strong>Sequence</strong></div>
      </div>
      <Caption>Scattered ideas become an ordered plan with owners — not a folder of slides.</Caption>
    </div>
  );
}

/* ── Roadmap: phases with a token riding the line ── */
function RoadmapDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.phases}>
        <div className={styles.phaseRail} aria-hidden>
          <i />
        </div>
        <ol>
          <li style={{ ["--d" as string]: "0s" }}>
            <strong>Discover</strong>
            <small>Use cases across the business</small>
          </li>
          <li style={{ ["--d" as string]: "0.9s" }}>
            <strong>Prioritize</strong>
            <small>Feasibility × impact</small>
          </li>
          <li style={{ ["--d" as string]: "1.8s" }}>
            <strong>Execute</strong>
            <small>MVP, then the build</small>
          </li>
        </ol>
      </div>
      <Caption>Discovery is the first phase of the same engagement — not a separate product.</Caption>
    </div>
  );
}

/* ── SaaS: bolt-on sticker vs AI as the product core ── */
function SaasOverview() {
  return (
    <div className={styles.scene}>
      <div className={styles.saasTwin}>
        <div className={styles.saasBolt}>
          <span className={styles.kicker}>Bolt-on</span>
          <strong>Generic SaaS</strong>
          <small>Auth, billing, then a sticker</small>
          <em className={styles.saasSticker}>+ AI</em>
        </div>
        <div className={styles.saasNative}>
          <span className={styles.kicker}>AI-native</span>
          <i className={styles.saasCore} aria-hidden />
          <strong>The reason it exists</strong>
          <small>Architecture around the model</small>
        </div>
      </div>
      <Caption>AI as a sticker is a rebuild waiting to happen. AI as the core is a different product.</Caption>
    </div>
  );
}

/* ── SaaS: tenant floors with a cost meter that actually fills ── */
function SaasDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.saasFloors}>
        <div style={{ ["--d" as string]: "0s" }}>
          <em>01</em>
          <strong>Idea / MVP</strong>
          <small>Validate before full scope</small>
        </div>
        <div style={{ ["--d" as string]: "0.45s" }}>
          <em>02</em>
          <strong>Auth & billing</strong>
          <small>Multi-tenant SaaS layer</small>
        </div>
        <div style={{ ["--d" as string]: "0.9s" }}>
          <em>03</em>
          <strong>AI integration</strong>
          <small>LLM, RAG, inference</small>
        </div>
        <div className={styles.saasCost} style={{ ["--d" as string]: "1.35s" }}>
          <em>04</em>
          <strong>Usage & cost tracking</strong>
          <small>Price reflects inference, not hope</small>
          <i />
        </div>
      </div>
      <Caption>Infrastructure, AI, and cost tracking designed together — not discovered after launch.</Caption>
    </div>
  );
}

/* ── Multi-agent: orchestration, three roles, a packet, then a gate ── */
function MultiAgentOverview() {
  return (
    <div className={styles.scene}>
      <div className={styles.masOrch}>
        <span className={styles.kicker}>Orchestration</span>
        <strong>Task division & routing</strong>
      </div>
      <div className={styles.masAgents}>
        <div style={{ ["--d" as string]: "0s" }}>
          <strong>Triage</strong>
          <small>Scope A</small>
        </div>
        <div style={{ ["--d" as string]: "0.35s" }}>
          <strong>Research</strong>
          <small>Scope B</small>
        </div>
        <div style={{ ["--d" as string]: "0.7s" }}>
          <strong>Draft</strong>
          <small>Scope C</small>
        </div>
      </div>
      <div className={styles.masTrack} aria-hidden>
        <i className={styles.masPacket} />
      </div>
      <div className={styles.masGuard}>
        <strong>Validation</strong>
        <small>Then the customer sees it</small>
      </div>
      <Caption>Specialized agents with a handoff trail — not one agent trying to do every step.</Caption>
    </div>
  );
}

/* ── Multi-agent: cascade vs a guardrail that stops the blast ── */
function MultiAgentDefinition() {
  return (
    <div className={styles.scene}>
      <div className={styles.masVs}>
        <div className={styles.masCascade}>
          <span className={styles.kicker}>No containment</span>
          <ol>
            <li>Agent A</li>
            <li>Agent B</li>
            <li>Agent C</li>
          </ol>
          <small>One bad output infects the rest</small>
        </div>
        <div className={styles.masContain}>
          <span className={styles.kicker}>Guardrail</span>
          <ol>
            <li>Agent A</li>
            <li className={styles.masBar}>Stopped</li>
            <li>Agent B · C stay clean</li>
          </ol>
          <small>Blast radius ends at the gate</small>
        </div>
      </div>
      <Caption>Failure modes are architecture. Containment is designed in, not hoped for.</Caption>
    </div>
  );
}

const PAGES: Record<
  string,
  { overview: () => ReactNode; definition: () => ReactNode; labels: { overview: string; definition: string } }
> = {
  "ai-customer-agent": {
    labels: {
      overview: "Tickets in a queue, then resolved or handed to a human",
      definition: "A question, retrieved sources, then a grounding gate",
    },
    overview: SupportOverview,
    definition: SupportDefinition,
  },
  "ai-knowledge-agent": {
    labels: {
      overview: "Wiki, policy, product, and chat wired into one knowledge agent",
      definition: "Ask, then role check, then retrieval, then answer or a gap",
    },
    overview: KnowledgeOverview,
    definition: KnowledgeDefinition,
  },
  "ai-deploy": {
    labels: {
      overview: "A model packaged, registered, and served along a pipeline",
      definition: "Deployment inside serving, inside monitoring",
    },
    overview: DeployOverview,
    definition: DeployDefinition,
  },
  "ai-hr-agent": {
    labels: {
      overview: "PTO, benefits, policy, and HRIS dropping into an HR assistant",
      definition: "An employee chat that looks up HRIS or hands off to HR",
    },
    overview: HrOverview,
    definition: HrDefinition,
  },
  "ai-sales-agent": {
    labels: {
      overview: "A lead falling through score, CRM, and next action",
      definition: "A checklist of admin beside the deal the rep still owns",
    },
    overview: SalesOverview,
    definition: SalesDefinition,
  },
  "ai-monitoring": {
    labels: {
      overview: "A live waveform crossing a threshold and raising an alert",
      definition: "A loop: live, detect, act, live again",
    },
    overview: MonitorOverview,
    definition: MonitorDefinition,
  },
  "ai-workflow-agent": {
    labels: {
      overview: "Intake, a decision diamond, then act or exception, then rejoin",
      definition: "A script that snaps versus a workflow that keeps a decision in the middle",
    },
    overview: WorkflowOverview,
    definition: WorkflowDefinition,
  },
  "ai-chatbot-enterprise": {
    labels: {
      overview: "Web, email, and voice merging into one conversation",
      definition: "A menu tree that dead-ends beside retrieve and reply",
    },
    overview: ChatOverview,
    definition: ChatDefinition,
  },
  "ai-doc-intelligence": {
    labels: {
      overview: "A scanned invoice with number, date, and amount lifting out",
      definition: "A soup of OCR characters beside a structured record going to ERP",
    },
    overview: DocOverview,
    definition: DocDefinition,
  },
  "ai-infra": {
    labels: {
      overview: "GPU blades under orchestration, with spend tracked",
      definition: "Standard IT beside AI-scale GPU infrastructure",
    },
    overview: InfraOverview,
    definition: InfraDefinition,
  },
  "ai-powered-apps": {
    labels: {
      overview: "Problem, readiness, proof of concept, then production",
      definition: "An off-the-shelf tool that does not fit beside custom AI that does",
    },
    overview: DevOverview,
    definition: DevDefinition,
  },
  "ai-mvp": {
    labels: {
      overview: "A full product cut down to one hypothesis, then go or no-go",
      definition: "Prototype, proof of concept, and an AI MVP compared",
    },
    overview: MvpOverview,
    definition: MvpDefinition,
  },
  "ai-chatgpt": {
    labels: {
      overview: "Seats in a browser tab versus SSO, retention, and connectors",
      definition: "An employee through SSO into ChatGPT Enterprise, then policy and systems",
    },
    overview: ChatGptOverview,
    definition: ChatGptDefinition,
  },
  "ai-readiness": {
    labels: {
      overview: "Data, infrastructure, team, and alignment scored, then proceed or name the gaps",
      definition: "Readiness for this project beside maturity for the whole organization",
    },
    overview: ReadinessOverview,
    definition: ReadinessDefinition,
  },
  "ai-roadmap": {
    labels: {
      overview: "Scattered AI ideas snapping into discover, score, sequence",
      definition: "A token riding discover, prioritize, then execute",
    },
    overview: RoadmapOverview,
    definition: RoadmapDefinition,
  },
  "ai-saas": {
    labels: {
      overview: "A generic SaaS box with an AI sticker beside a product built around AI",
      definition: "Idea, auth, AI integration, then a cost meter that fills with real usage",
    },
    overview: SaasOverview,
    definition: SaasDefinition,
  },
  "ai-multi-agent": {
    labels: {
      overview: "Orchestration routing a task to triage, research, and draft, then a validation gate",
      definition: "A cascade of infected agents beside a guardrail that stops the blast",
    },
    overview: MultiAgentOverview,
    definition: MultiAgentDefinition,
  },
};

export default function AiSectionVisual({
  catalogId,
  title,
  slot,
}: {
  catalogId: string;
  title: string;
  slot: Slot;
}) {
  const { ref, playing } = useVisualPlay();
  const page = PAGES[catalogId] ?? PAGES["ai-customer-agent"];
  const Scene = page[slot];

  return (
    <div
      ref={ref}
      className={`${styles.stage} ${playing ? styles.isPlaying : ""}`}
      role="img"
      aria-label={page.labels[slot] ?? `${title} — ${slot}`}
    >
      <div className={styles.grid} aria-hidden />
      <Scene />
    </div>
  );
}
