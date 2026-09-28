"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { company } from "@/lib/data";
import styles from "./ContactPage.module.css";

export default function ContactPage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    interest: "Managed Azure",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, source: "website" }),
        }
      );
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again or email us directly.");
      }
    } catch {
      setError("Could not send message. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.sidebar}>
            <a
              href={company.socials.linkedin}
              className={styles.sideIcon}
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              in
            </a>
            <a
              href={company.whatsapp}
              className={styles.sideIcon}
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              wa
            </a>
          </div>

          <div className={styles.heroContent}>
            <motion.p
              className={styles.available}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {company.eyebrow}
            </motion.p>

            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              Get in touch
            </motion.h1>

            <motion.p
              className={styles.heroBio}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
            >
              Speak directly with a senior cloud architect. No sales pitch —
              actionable engineering advice for Azure, Microsoft platforms, and AI.
            </motion.p>

            <motion.div
              className={styles.heroFooter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
            >
              <div>
                <p className={styles.projectLabel}>
                  Book a free consultation or send a message — we typically reply
                  within 1–2 business days.
                </p>
              </div>
              <div>
                <p className={styles.replyNote}>
                  Prefer calendar?
                  <br />
                  <a href={company.calendly} target="_blank" rel="noopener noreferrer">
                    <strong>Choose a time slot ↗</strong>
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className={styles.formSection} ref={ref}>
          <div className={styles.formInner}>
            <motion.div
              className={styles.formLeft}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className={styles.formTitle}>Send a message</h2>
              <p className={styles.formSubtitle}>
                Tell us about your cloud estate — we&apos;ll route you to the right
                architect.
              </p>

              <div className={styles.contactInfo}>
                <div>
                  <p className={styles.infoLabel}>India Offices</p>
                  <p className={styles.infoValue}>{company.address}</p>
                  <p className={styles.infoValue}>{company.addressMumbai}</p>
                  <p className={styles.infoKicker}>Email</p>
                  <p className={styles.infoValue}>
                    <a href={`mailto:${company.email}`}>{company.email}</a>
                    {" / "}
                    <a href={`mailto:${company.enquiryEmail}`}>
                      {company.enquiryEmail}
                    </a>
                  </p>
                </div>

                <div>
                  <p className={styles.infoLabel}>Cloud &amp; IT Services</p>
                  <p className={styles.infoValue}>
                    <a href="tel:+919845570066">{company.phone}</a>
                    {", "}
                    <a href="tel:+919148706809">{company.phoneAlt}</a>
                  </p>
                </div>

                <div>
                  <p className={styles.infoLabel}>AI Services &amp; Solutions</p>
                  <p className={styles.infoValue}>
                    <a href="tel:+919148706809">{company.phoneAlt}</a>
                  </p>
                </div>

                <div>
                  <p className={styles.infoLabel}>WhatsApp</p>
                  <p className={styles.infoValue}>
                    <a
                      href={company.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat on WhatsApp
                    </a>
                  </p>
                </div>

                <div>
                  <p className={styles.infoLabel}>United States</p>
                  <p className={styles.infoValue}>{company.addressUs}</p>
                  <p className={styles.infoKicker}>Email</p>
                  <p className={styles.infoValue}>
                    <a href={`mailto:${company.emailUsHello}`}>
                      {company.emailUsHello}
                    </a>
                    {" / "}
                    <a href={`mailto:${company.emailUs}`}>{company.emailUs}</a>
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={styles.formRight}
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              {submitted ? (
                <div className={styles.successMsg}>
                  <div className={styles.successIcon}>✓</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you. A CloudSwift teammate will get back to you soon.</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={styles.input}
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="email">
                      Work email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={styles.input}
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="company">
                      Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      className={styles.input}
                      placeholder="Company name"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="interest">
                      Service interest
                    </label>
                    <select
                      id="interest"
                      className={styles.input}
                      value={form.interest}
                      onChange={(e) => setForm({ ...form, interest: e.target.value })}
                    >
                      <option>Cloud Migration</option>
                      <option>Managed Azure</option>
                      <option>Managed AWS</option>
                      <option>Dynamics 365</option>
                      <option>Microsoft 365</option>
                      <option>AI Services</option>
                      <option>Managed Security</option>
                      <option>Help Desk</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className={styles.textarea}
                      placeholder="Tell us about your environment..."
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>

                  {error && (
                    <p style={{ color: "red", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                      {error}
                    </p>
                  )}
                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? "Sending…" : <> Send Message <span>→</span></>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </div>

      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </>
  );
}
