import type { Metadata } from "next";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Service | CloudSwift Technologies",
  description:
    "Terms governing CloudSwift Technologies Pvt. Ltd. managed cloud, Microsoft Azure, and AI services.",
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.updated}>Last updated: 26 September 2025</p>

        <section className={styles.section}>
          <h2>1. Agreement to Terms</h2>
          <p>
            By engaging CloudSwift Technologies Pvt. Ltd. (&ldquo;CloudSwift&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;) for any managed cloud, Microsoft, or AI
            services — whether through a Statement of Work, Purchase Order, or verbal
            agreement — you (&ldquo;Client&rdquo;) agree to these Terms of Service. If you
            are entering these terms on behalf of a company, you confirm you have authority
            to bind that company.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Services</h2>
          <p>
            CloudSwift provides managed cloud services including but not limited to:
            Microsoft Azure infrastructure management, cloud migration, Microsoft 365 and
            Dynamics 365 implementation, managed security, AI integration, and IT help
            desk services. The specific scope, SLAs, and pricing for each engagement are
            defined in a separate Statement of Work (&ldquo;SOW&rdquo;) or Order Form
            agreed in writing between both parties.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Service Level Agreements</h2>
          <p>
            Uptime targets, response times, and resolution SLAs are specified in the
            applicable SOW. Where no SLA is specified, CloudSwift will use commercially
            reasonable efforts to maintain continuity of service. SLA credits, if any, are
            the Client&rsquo;s sole and exclusive remedy for service disruptions caused by
            CloudSwift.
          </p>
          <p>
            SLA obligations do not apply to disruptions caused by: (a) third-party cloud
            provider outages (Azure, AWS, Microsoft 365); (b) the Client&rsquo;s own
            actions or omissions; (c) scheduled maintenance communicated at least 48 hours
            in advance; or (d) force majeure events.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Client Responsibilities</h2>
          <p>
            The Client agrees to: (a) provide CloudSwift with access, credentials, and
            documentation reasonably necessary to deliver the services; (b) designate a
            technical point of contact; (c) maintain valid licences for all third-party
            software (including Microsoft subscriptions) required by the engagement; and
            (d) notify CloudSwift promptly of any security incidents or changes to their
            cloud environment.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Data and Security</h2>
          <p>
            CloudSwift will implement industry-standard technical and organisational
            security measures appropriate to the services provided. The Client remains the
            data controller for all data stored in their cloud environment; CloudSwift acts
            as a data processor only as directed. Any data processing agreement required
            under applicable law will be executed separately.
          </p>
          <p>
            CloudSwift holds Microsoft Azure Expert MSP designation and operates under
            ISO-aligned security practices. Specific certifications applicable to an
            engagement are listed in the SOW.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Payment Terms</h2>
          <p>
            Invoices are due within 30 days of the invoice date unless otherwise agreed in
            writing. Managed services are billed monthly in advance. Project milestones are
            billed as defined in the SOW. Overdue invoices accrue interest at 1.5% per
            month or the maximum rate permitted by applicable law, whichever is lower.
            CloudSwift reserves the right to suspend services if an invoice remains unpaid
            for more than 15 days after the due date, with 7 days&rsquo; written notice.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Intellectual Property</h2>
          <p>
            Unless otherwise stated in the SOW, all pre-existing IP, tools, frameworks, and
            methodologies used by CloudSwift remain the property of CloudSwift or its
            licensors. Custom deliverables developed specifically for the Client and paid
            for in full become the Client&rsquo;s property upon receipt of full payment.
            CloudSwift may reference the Client&rsquo;s name and engagement type as part of
            its credentials unless the Client notifies us in writing to the contrary.
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Confidentiality</h2>
          <p>
            Both parties agree to keep confidential any non-public business, technical, or
            financial information received from the other party and to use it only for the
            purpose of the engagement. This obligation survives termination for a period of
            3 years.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, CloudSwift&rsquo;s total
            liability for any claim arising from these terms or the services shall not
            exceed the fees paid by the Client to CloudSwift in the 3 months preceding the
            claim. CloudSwift shall not be liable for any indirect, incidental, consequential,
            or punitive damages, including loss of data, revenue, or profits, even if
            advised of the possibility of such damages.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Termination</h2>
          <p>
            Either party may terminate a managed services engagement with 30 days&rsquo;
            written notice. Either party may terminate immediately for material breach that
            is not remedied within 14 days of written notice. On termination, the Client
            remains liable for fees accrued up to the effective termination date. CloudSwift
            will provide reasonable assistance to migrate data and configurations to the
            Client or a successor provider at the Client&rsquo;s request and cost.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India, including the Information
            Technology Act, 2000 and the Digital Personal Data Protection Act, 2023 where
            applicable. Any dispute shall be subject to the exclusive jurisdiction of the
            courts of Bengaluru, Karnataka, India.
          </p>
        </section>

        <section className={styles.section}>
          <h2>12. Contact</h2>
          <p>
            For questions about these Terms, contact us at{" "}
            <a href="mailto:hello.in@oncloudswift.com">hello.in@oncloudswift.com</a> or
            write to: CloudSwift Technologies Pvt. Ltd., Bengaluru, Karnataka, India.
          </p>
        </section>
      </div>
    </div>
  );
}
