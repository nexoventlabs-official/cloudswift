import type { Metadata } from "next";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | CloudSwift Technologies",
  description:
    "How CloudSwift Technologies Pvt. Ltd. collects, uses, and protects your personal data under the Digital Personal Data Protection Act, 2023.",
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: 26 September 2025</p>

        <section className={styles.section}>
          <p>
            CloudSwift Technologies Pvt. Ltd. (&ldquo;CloudSwift&rdquo;, &ldquo;we&rdquo;,
            &ldquo;us&rdquo;) is committed to protecting the privacy of individuals whose
            data we process. This policy explains what personal data we collect, why we
            collect it, and the rights you have over it. It is written to comply with
            India&rsquo;s Digital Personal Data Protection Act, 2023 (&ldquo;DPDP
            Act&rdquo;).
          </p>
        </section>

        <section className={styles.section}>
          <h2>1. Data We Collect</h2>
          <p>We collect the following categories of personal data:</p>
          <ul>
            <li>
              <strong>Contact and identity data:</strong> name, work email address, phone
              number, company name — collected when you fill in a contact form, request a
              consultation, or communicate with us.
            </li>
            <li>
              <strong>Usage data:</strong> IP address, browser type, pages visited, and
              interaction data collected automatically via cookies and analytics tools.
            </li>
            <li>
              <strong>Client operational data:</strong> technical information about your
              cloud environment shared with us in the course of delivering managed
              services. This is governed by a separate data processing agreement.
            </li>
          </ul>
          <p>We do not knowingly collect personal data from minors under 18.</p>
        </section>

        <section className={styles.section}>
          <h2>2. Why We Process Your Data</h2>
          <p>We process personal data for the following purposes:</p>
          <ul>
            <li>
              <strong>To respond to your enquiries</strong> and provide pre-sales
              information about our services.
            </li>
            <li>
              <strong>To deliver contracted services</strong> — managing cloud
              infrastructure, Microsoft platforms, and AI integrations for Clients.
            </li>
            <li>
              <strong>To send service communications</strong> — updates, invoices, and
              notices required for the delivery of services.
            </li>
            <li>
              <strong>To improve our website and services</strong> using aggregated,
              anonymised usage analytics.
            </li>
            <li>
              <strong>To comply with legal obligations</strong> under Indian law, including
              the DPDP Act, 2023, IT Act, 2000, and GST regulations.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. Lawful Basis for Processing</h2>
          <p>
            Under the DPDP Act, 2023, we process your data on the following bases: (a) your
            consent, which you may withdraw at any time; (b) legitimate use for fulfilling
            a contract or service you have requested; or (c) compliance with a legal
            obligation. Where we rely on consent, you will be asked explicitly and have the
            right to withdraw it without affecting prior processing.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share data with:
          </p>
          <ul>
            <li>
              <strong>Cloud infrastructure providers</strong> (Microsoft Azure, Google
              Cloud) to deliver contracted services.
            </li>
            <li>
              <strong>Communication and CRM tools</strong> used internally for client
              management, subject to confidentiality obligations.
            </li>
            <li>
              <strong>Legal or regulatory authorities</strong> if required by applicable
              law, court order, or government directive.
            </li>
          </ul>
          <p>All third-party processors are contractually required to protect your data.</p>
        </section>

        <section className={styles.section}>
          <h2>5. International Data Transfers</h2>
          <p>
            Some of our cloud infrastructure and tools process data outside India (primarily
            in the United States and the European Union). Where such transfers occur, we
            ensure adequate safeguards are in place in accordance with the DPDP Act and
            applicable regulations.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Data Retention</h2>
          <p>
            We retain personal data only for as long as necessary for the purpose it was
            collected: contact enquiry data is retained for up to 24 months; client
            operational data is retained for the duration of the contract plus 5 years for
            legal and compliance purposes; website analytics data is retained for 14 months.
            You may request earlier deletion (see Your Rights below).
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Cookies</h2>
          <p>
            Our website uses cookies for analytics (Google Analytics / Google Tag Manager)
            and to remember your preferences. Non-essential cookies are loaded only after
            your consent. You may manage your cookie preferences at any time through our
            cookie banner or your browser settings. Withdrawing consent for analytics
            cookies does not affect your ability to use the website.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Your Rights</h2>
          <p>
            Under the DPDP Act, 2023, you have the right to:
          </p>
          <ul>
            <li>
              <strong>Access</strong> — request a summary of personal data we hold about
              you.
            </li>
            <li>
              <strong>Correction</strong> — request that inaccurate or incomplete data be
              corrected.
            </li>
            <li>
              <strong>Erasure</strong> — request deletion of your data where we no longer
              have a lawful basis to retain it.
            </li>
            <li>
              <strong>Grievance redressal</strong> — raise a complaint with our Grievance
              Officer (see below).
            </li>
            <li>
              <strong>Nominate</strong> — nominate another individual to exercise these
              rights on your behalf.
            </li>
          </ul>
          <p>
            To exercise any of these rights, email{" "}
            <a href="mailto:privacy@oncloudswift.com">privacy@oncloudswift.com</a>. We will
            respond within 30 days.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Grievance Redressal (DPDP Act, 2023)</h2>
          <p>
            In accordance with the Digital Personal Data Protection Act, 2023, we have
            designated a Grievance Officer for data privacy matters:
          </p>
          <p>
            <strong>Grievance Officer:</strong> [Name — to be updated]
            <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:privacy@oncloudswift.com">privacy@oncloudswift.com</a>
            <br />
            <strong>Address:</strong> CloudSwift Technologies Pvt. Ltd., Bengaluru,
            Karnataka, India
          </p>
          <p>
            You may lodge a complaint with the Grievance Officer within 30 days of the
            relevant event. If your grievance is not resolved within 30 days, you may
            escalate to the Data Protection Board of India once it is constituted under the
            DPDP Act.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy as our practices or legal obligations change.
            Material changes will be notified via email to registered Clients or via a
            notice on our website. Continued use of our services after the effective date
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Contact</h2>
          <p>
            For general privacy questions, contact us at{" "}
            <a href="mailto:privacy@oncloudswift.com">privacy@oncloudswift.com</a> or{" "}
            <a href="mailto:hello.in@oncloudswift.com">hello.in@oncloudswift.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
