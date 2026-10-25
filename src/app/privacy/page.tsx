import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, subscribe to a plan, or contact us for support.

**Account Information:** Name, email address, password (hashed), and billing information.

**Usage Data:** Information about how you use Aurex, including agents created, conversations handled, API calls made, and features accessed.

**Device & Log Data:** IP address, browser type, operating system, referring URLs, and pages visited.

**Payment Information:** We use Stripe, PayMongo, and Xendit to process payments. We do not store your full card number or bank account details on our servers.

**Communications:** If you contact us, we keep records of that correspondence.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:

- Provide, maintain, and improve the Aurex platform
- Process transactions and send related information
- Send technical notices, updates, and support messages
- Respond to your comments and questions
- Monitor and analyze usage patterns to improve user experience
- Detect, investigate, and prevent fraudulent or unauthorized activity
- Comply with legal obligations`,
  },
  {
    title: "3. Sharing of Information",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:

**Service Providers:** We share data with vendors who help us operate the platform (e.g., cloud hosting, payment processors, email delivery). These providers are contractually bound to protect your data.

**Legal Requirements:** We may disclose information if required by law, court order, or government authority.

**Business Transfers:** If Aurex is acquired or merges with another company, your information may be transferred as part of that transaction.

**With Your Consent:** We may share information for any other purpose with your explicit consent.`,
  },
  {
    title: "4. Data Retention",
    content: `We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting privacy@aurex.io.

Conversation logs and AI-generated content are retained for 90 days by default. You may configure shorter retention periods in your account settings.

We may retain certain information for longer periods as required by law or for legitimate business purposes such as fraud prevention.`,
  },
  {
    title: "5. Security",
    content: `We implement industry-standard security measures to protect your information:

- All data is encrypted in transit using TLS 1.3
- Passwords are hashed using bcrypt with a cost factor of 12
- Database access is restricted and audited
- API keys are hashed before storage
- We conduct regular security reviews

No method of transmission over the internet is 100% secure. We cannot guarantee absolute security, but we take every reasonable precaution.`,
  },
  {
    title: "6. Cookies",
    content: `We use cookies and similar tracking technologies to:

- Keep you logged in to your account
- Remember your preferences
- Analyze how our platform is used
- Improve performance

You can control cookies through your browser settings. Disabling cookies may affect the functionality of the platform.`,
  },
  {
    title: "7. Your Rights",
    content: `Depending on your location, you may have the following rights regarding your personal data:

- **Access:** Request a copy of the personal data we hold about you
- **Correction:** Request correction of inaccurate or incomplete data
- **Deletion:** Request deletion of your personal data
- **Portability:** Request your data in a machine-readable format
- **Objection:** Object to certain types of processing

To exercise any of these rights, contact us at privacy@aurex.io. We will respond within 30 days.`,
  },
  {
    title: "8. Children's Privacy",
    content: `Aurex is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately at privacy@aurex.io.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on our platform. Your continued use of Aurex after changes take effect constitutes your acceptance of the updated policy.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have questions about this Privacy Policy or our data practices, please contact us at:

**Aurex Technologies Inc.**
Email: privacy@aurex.io
Address: Manila, Philippines`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white pt-24">

        {/* Header */}
        <section className="bg-gray-950 py-20 text-center">
          <div className="max-w-3xl mx-auto px-8">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-4">Legal</p>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Privacy Policy</h1>
            <p className="text-white/30 text-sm">Last updated: January 1, 2025</p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-3xl mx-auto px-8 py-20">
          <p className="text-gray-500 leading-relaxed mb-12 text-base">
            At Aurex, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully.
          </p>

          <div className="space-y-12">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-xl font-black text-gray-900 mb-4">{s.title}</h2>
                <div className="text-gray-500 leading-relaxed text-sm space-y-3">
                  {s.content.split("\n\n").map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{
                      __html: para
                        .replace(/\*\*(.*?)\*\*/g, "<strong class='text-gray-700'>$1</strong>")
                        .replace(/\n/g, "<br/>")
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
