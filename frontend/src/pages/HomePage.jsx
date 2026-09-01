import React, { useState, useEffect } from 'react';

// ── Helpers ───────────────────────────────────────────────────────────────────
const WA_NUMBER = '91XXXXXXXXXX'; // update with real number
const WA_LINK   = `https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20CloudSwift`;

function waOpen(e) {
  e.preventDefault();
  window.open(WA_LINK, '_blank', 'noopener');
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
      borderBottom: '1px solid #e5e7eb',
      backdropFilter: 'blur(8px)',
      transition: 'box-shadow 0.2s',
      boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 800 }}>☁</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', letterSpacing: '-0.3px' }}>CloudSwift</div>
            <div style={{ fontSize: 10, color: '#2563eb', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', lineHeight: 1, marginTop: 1 }}>Azure Expert MSP</div>
          </div>
        </a>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          {['Services', 'About', 'Case Studies', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
              style={{ color: '#374151', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color='#2563eb'}
              onMouseLeave={e => e.target.style.color='#374151'}>
              {item}
            </a>
          ))}
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" onClick={waOpen}
            style={{ background: '#2563eb', color: '#fff', padding: '9px 20px', borderRadius: 9, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>💬</span> Talk to an expert
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section style={{ background: 'linear-gradient(160deg,#f0f6ff 0%,#ffffff 60%)', padding: '96px 24px 80px', textAlign: 'center' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 20, padding: '5px 14px', marginBottom: 28 }}>
          <div style={{ width: 8, height: 8, background: '#2563eb', borderRadius: '50%' }} />
          <span style={{ color: '#1d4ed8', fontSize: 12, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Fewer than 30 Azure Expert MSPs in India</span>
        </div>

        <h1 style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, color: '#0f172a', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 24 }}>
          Your Azure infrastructure,<br />
          <span style={{ color: '#2563eb' }}>owned end-to-end.</span>
        </h1>

        <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: '#475569', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 40px', fontWeight: 400 }}>
          CloudSwift is an Azure Expert MSP working with mid-market companies across India and the GCC on cloud infrastructure, Microsoft 365, and managed cloud.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" onClick={waOpen}
            style={{ background: '#2563eb', color: '#fff', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(37,99,235,0.3)' }}>
            <span style={{ fontSize: 18 }}>💬</span> Talk to an expert
          </a>
          <a href="#services"
            style={{ background: '#fff', color: '#111827', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
            Our services →
          </a>
        </div>

        {/* Partner logos row */}
        <div style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid #e5e7eb' }}>
          <div style={{ color: '#9ca3af', fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 20 }}>Microsoft Partner</div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
            {['Azure Expert MSP', 'Microsoft Solutions Partner', 'Cloud Platform', 'Modern Work'].map(p => (
              <div key={p} style={{ color: '#6b7280', fontSize: 13, fontWeight: 600, padding: '6px 14px', border: '1px solid #e5e7eb', borderRadius: 7 }}>{p}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    { icon: '☁', title: 'Azure Migration', desc: 'End-to-end migration from on-prem or other clouds to Azure. We own the outcome, not just the effort.', tags: ['VM migration', 'Data centre consolidation', 'Hybrid cloud'] },
    { icon: '🔧', title: 'Managed Cloud', desc: 'Ongoing management of your Azure environment — monitoring, patching, incident response, cost optimisation.', tags: ['24/7 NOC', 'SLA-backed', 'Cost reporting'] },
    { icon: '📧', title: 'Microsoft 365', desc: 'Licensing, migration, and ongoing management of Microsoft 365 and Dynamics 365 environments.', tags: ['Exchange', 'Teams', 'Dynamics 365'] },
    { icon: '🔒', title: 'Security & Compliance', desc: 'Azure security posture management, compliance frameworks, and Defender for Cloud implementation.', tags: ['Secure Score', 'Compliance', 'Defender'] },
    { icon: '💰', title: 'Cost Optimisation', desc: 'Free Azure Cost Review — we identify 20–35% recoverable spend across Reserved Instances, licensing, and dev/test pricing.', tags: ['Reserved Instances', 'Hybrid Benefit', 'RI coverage'] },
    { icon: '📊', title: 'Cloud Advisory', desc: 'Architecture reviews, MSP proposal second opinions, and Azure readiness assessments. No agenda.', tags: ['Architecture', 'Second opinion', 'Roadmap'] },
  ];

  return (
    <section id="services" style={{ padding: '96px 24px', background: '#f9fafb' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ color: '#2563eb', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>What we do</div>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 14 }}>Services</h2>
          <p style={{ color: '#64748b', fontSize: 18, maxWidth: 540, margin: '0 auto' }}>Everything your Azure environment needs, managed by certified experts.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 20 }}>
          {services.map(s => (
            <div key={s.title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 28, transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 32px rgba(37,99,235,0.1)'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
              <div style={{ width: 48, height: 48, background: '#eff6ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{s.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {s.tags.map(t => (
                  <span key={t} style={{ fontSize: 11, fontWeight: 600, color: '#2563eb', background: '#eff6ff', borderRadius: 5, padding: '3px 8px' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { number: '< 30', label: 'Azure Expert MSPs in India' },
    { number: '6 weeks', label: 'Average migration timeline' },
    { number: '20–35%', label: 'Azure cost typically recoverable' },
    { number: '24/7', label: 'Managed support, any hour' },
  ];
  return (
    <section style={{ background: '#0f172a', padding: '72px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32 }}>
        {items.map(i => (
          <div key={i.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: 900, color: '#2563eb', marginBottom: 8, letterSpacing: '-1px' }}>{i.number}</div>
            <div style={{ color: '#94a3b8', fontSize: 15, fontWeight: 500 }}>{i.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CaseStudy() {
  return (
    <section id="case-studies" style={{ padding: '96px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ color: '#2563eb', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>Proof</div>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px' }}>What we've delivered</h2>
        </div>
        <div style={{ background: 'linear-gradient(135deg,#eff6ff,#f0fdf4)', border: '1px solid #bfdbfe', borderRadius: 18, padding: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="case-card">
          <div>
            <div style={{ color: '#2563eb', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 14 }}>Migration Case Study</div>
            <h3 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 14, lineHeight: 1.25 }}>847 VMs. 3 data centres. 6 weeks.</h3>
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
              A mid-market client with a board-mandated deadline needed their entire on-prem infrastructure moved to Azure — without business disruption and without weekend downtime.
            </p>
            <p style={{ color: '#374151', fontSize: 15, fontStyle: 'italic', lineHeight: 1.7, marginBottom: 24, paddingLeft: 16, borderLeft: '3px solid #2563eb' }}>
              "The migration didn't appear on a single business operations report — nothing broke."
              <br /><span style={{ fontSize: 13, color: '#64748b', fontStyle: 'normal', marginTop: 6, display: 'block' }}>— IT Head, Client A</span>
            </p>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" onClick={waOpen}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              💬 Talk to us about your migration
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
            {[
              { n: '847', l: 'VMs migrated' },
              { n: '3', l: 'Data centres consolidated' },
              { n: '6 wks', l: 'Kick-off to handover' },
              { n: '0', l: 'Business ops incidents' },
            ].map(stat => (
              <div key={stat.l} style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#2563eb', minWidth: 70 }}>{stat.n}</div>
                <div style={{ color: '#374151', fontSize: 14, fontWeight: 600 }}>{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FreeAssessment() {
  return (
    <section style={{ background: '#eff6ff', padding: '80px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🆓</div>
        <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Free Azure Infrastructure Assessment</h2>
        <p style={{ color: '#475569', fontSize: 17, lineHeight: 1.7, marginBottom: 32, maxWidth: 560, margin: '0 auto 32px' }}>
          2 hours of your team's time. Written report. Specific recommendations you can act on immediately — regardless of whether you work with us.
        </p>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" onClick={waOpen}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#25D366', color: '#fff', padding: '15px 36px', borderRadius: 12, fontSize: 17, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 24px rgba(37,211,102,0.35)' }}>
          <span style={{ fontSize: 20 }}>📱</span> Book via WhatsApp
        </a>
        <div style={{ color: '#64748b', fontSize: 13, marginTop: 14 }}>No pitch. No obligation. Auto-reply in 90 seconds.</div>
      </div>
    </section>
  );
}

function WhyCloudSwift() {
  const reasons = [
    { icon: '🏆', title: 'Azure Expert MSP', desc: 'Fewer than 30 certified in India. We\'re accountable for outcomes, not just effort.' },
    { icon: '⚡', title: '90-second response', desc: 'WhatsApp auto-reply any hour. Hot leads reach our sales team within 2 minutes.' },
    { icon: '🇮🇳', title: 'India + GCC specialist', desc: 'Deep understanding of compliance requirements, data residency, and local licensing.' },
    { icon: '💡', title: 'No lock-in', desc: 'We\'ll review any MSP proposal for free — no agenda, just a peer review.' },
  ];
  return (
    <section id="about" style={{ padding: '96px 24px', background: '#f9fafb' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ color: '#2563eb', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>Why us</div>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px' }}>What makes CloudSwift different</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20 }}>
          {reasons.map(r => (
            <div key={r.title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{r.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#0f172a', marginBottom: 8 }}>{r.title}</div>
              <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.65 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name:'', phone:'', company:'', message:'' });
  const [status, setStatus] = useState('');

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleSubmit(e) {
    e.preventDefault();
    // Open WhatsApp with pre-filled message
    const text = encodeURIComponent(`Hi, I'm ${form.name} from ${form.company}.\n\n${form.message}\n\nContact: ${form.phone}`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank', 'noopener');
    setStatus('Opening WhatsApp…');
    setTimeout(() => setStatus(''), 3000);
  }

  return (
    <section id="contact" style={{ padding: '96px 24px', background: '#fff' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: '#2563eb', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>Get in touch</div>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 12 }}>Start a conversation</h2>
          <p style={{ color: '#64748b', fontSize: 16 }}>Fill the form below — it opens WhatsApp directly so you get a response within 90 seconds.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 16, padding: 36 }}>
          {[
            { k:'name',    l:'Your Name',        ph:'John Smith',          type:'text' },
            { k:'phone',   l:'WhatsApp Number',  ph:'+91 9XXXXXXXXX',      type:'tel' },
            { k:'company', l:'Company Name',     ph:'Acme Corp',           type:'text' },
          ].map(f => (
            <div key={f.k} style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', color: '#374151', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{f.l}</label>
              <input
                type={f.type}
                placeholder={f.ph}
                value={form[f.k]}
                onChange={e => set(f.k, e.target.value)}
                required
                style={{ width:'100%', padding:'12px 14px', border:'1px solid #d1d5db', borderRadius:9, fontSize:14, outline:'none', background:'#fff', fontFamily:'inherit' }}
              />
            </div>
          ))}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: '#374151', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>What are you trying to solve?</label>
            <textarea
              placeholder="Briefly describe your Azure challenge…"
              value={form.message}
              onChange={e => set('message', e.target.value)}
              required
              rows={4}
              style={{ width:'100%', padding:'12px 14px', border:'1px solid #d1d5db', borderRadius:9, fontSize:14, outline:'none', background:'#fff', fontFamily:'inherit', resize:'vertical' }}
            />
          </div>

          {status && <div style={{ color: '#22c55e', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>{status}</div>}

          <button type="submit"
            style={{ width:'100%', padding:'14px', background:'#25D366', border:0, borderRadius:10, color:'#fff', fontWeight:700, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <span style={{ fontSize: 18 }}>📱</span> Send via WhatsApp
          </button>
          <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 12, marginTop: 10 }}>Auto-reply in 90 seconds · Any hour</div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 800 }}>☁</div>
              <div style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 16 }}>CloudSwift</div>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>Azure Expert MSP for mid-market companies across India and the GCC.</div>
          </div>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '1px' }}>Services</div>
              {['Azure Migration', 'Managed Cloud', 'Microsoft 365', 'Security', 'Cost Review'].map(s => (
                <div key={s} style={{ fontSize: 13, marginBottom: 8 }}>{s}</div>
              ))}
            </div>
            <div>
              <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '1px' }}>Company</div>
              {['About', 'Case Studies', 'Contact', 'Free Assessment'].map(s => (
                <div key={s} style={{ fontSize: 13, marginBottom: 8 }}>{s}</div>
              ))}
            </div>
            <div>
              <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '1px' }}>Get Started</div>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" onClick={waOpen}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25D366', color: '#fff', padding: '10px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                <span>💬</span> WhatsApp us
              </a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 12 }}>
          <div>© {new Date().getFullYear()} CloudSwift. All rights reserved.</div>
          <div>Azure Expert MSP · Microsoft Solutions Partner</div>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Nav />
      <Hero />
      <Stats />
      <Services />
      <CaseStudy />
      <WhyCloudSwift />
      <FreeAssessment />
      <Contact />
      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .case-card { grid-template-columns: 1fr !important; }
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}
