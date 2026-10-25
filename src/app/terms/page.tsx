import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms of Service – Aurex AI Automation Platform",
  description: "Read Aurex's Terms of Service. Understand your rights and responsibilities when using our AI automation platform, including billing, acceptable use, and data policies.",
  keywords: ["Aurex terms of service", "AI platform terms", "SaaS terms and conditions", "user agreement AI platform"],
  robots: { index: true, follow: false },
  alternates: { canonical: "https://aurex.payroo.xyz/terms" },
  openGraph: { url: "https://aurex.payroo.xyz/terms", title: "Terms of Service – Aurex", description: "Terms and conditions for using the Aurex AI automation platform." },
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using Aurex ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.

These Terms apply to all users of the Service, including users who are also contributors of content, information, and other materials.`,
  },
  {
    title: "2. Description of Service",
    content: `Aurex is an AI automation platform that allows businesses to create, deploy, and manage AI agents for customer support, lead follow-up, appointment booking, and report generation.

We reserve the right to modify, suspend, or discontinue the Service at any time with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.`,
  },
  {
    title: "3. Account Registration",
    content: `To use certain features of the Service, you must register for an account. You agree to:

- Provide accurate, current, and complete information during registration
- Maintain and promptly update your account information
- Keep your password secure and confidential
- Notify us immediately of any unauthorized use of your account
- Accept responsibility for all activities that occur under your account

You must be at least 18 years old to create an account. By registering, you represent that you meet this requirement.`,
  },
  {
    title: "4. Subscription Plans and Billing",
    content: `Aurex offers both free and paid subscription plans. By selecting a paid plan, you agree to pay the applicable fees.

**Billing:** Subscriptions are billed monthly or annually in advance. All fees are non-refundable except as required by law.

**Upgrades/Downgrades:** You may change your plan at any time. Upgrades take effect immediately. Downgrades take effect at the end of the current billing period.

**Cancellation:** You may cancel your subscription at any time. Upon cancellation, you will retain access to paid features until the end of your current billing period.

**Price Changes:** We may change our prices with 30 days' notice. Continued use of the Service after a price change constitutes acceptance of the new price.

**Taxes:** You are responsible for all applicable taxes. Prices shown do not include VAT or other taxes unless stated.`,
  },
  {
    title: "5. Acceptable Use",
    content: `You agree not to use the Service to:

- Violate any applicable law or regulation
- Send spam, unsolicited messages, or engage in phishing
- Impersonate any person or entity
- Collect or harvest personal data without consent
- Transmit malware, viruses, or malicious code
- Interfere with or disrupt the Service or servers
- Attempt to gain unauthorized access to any part of the Service
- Use the Service to build a competing product
- Engage in any activity that could harm Aurex or its users

We reserve the right to terminate accounts that violate these terms without notice or refund.`,
  },
  {
    title: "6. AI-Generated Content",
    content: `The Service uses artificial intelligence to generate responses and content. You acknowledge that:

- AI-generated content may be inaccurate, incomplete, or inappropriate
- You are responsible for reviewing AI outputs before using them in your business
- Aurex does not guarantee the accuracy, reliability, or fitness of AI-generated content
- You retain ownership of content you input into the Service
- You grant Aurex a license to use your input to provide and improve the Service

You must not use AI-generated content in ways that are deceptive, harmful, or illegal.`,
  },
  {
    title: "7. Intellectual Property",
    content: `The Service and its original content, features, and functionality are owned by Aurex and are protected by international copyright, trademark, and other intellectual property laws.

You retain ownership of any content you create using the Service. By using the Service, you grant Aurex a non-exclusive, worldwide, royalty-free license to use, reproduce, and display your content solely to provide the Service.

You may not copy, modify, distribute, sell, or lease any part of the Service without our written permission.`,
  },
  {
    title: "8. Privacy",
    content: `Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy at aurex.payroo.xyz/privacy.`,
  },
  {
    title: "9. Disclaimers",
    content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

AUREX DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.

TO THE FULLEST EXTENT PERMITTED BY LAW, AUREX DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.`,
  },
  {
    title: "10. Limitation of Liability",
    content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, AUREX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL.

IN NO EVENT SHALL AUREX'S TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU PAID TO AUREX IN THE 12 MONTHS PRECEDING THE CLAIM.

SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR LIMITATION OF LIABILITY, SO SOME OF THE ABOVE MAY NOT APPLY TO YOU.`,
  },
  {
    title: "11. Termination",
    content: `We may terminate or suspend your account and access to the Service immediately, without prior notice, if you breach these Terms.

Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.`,
  },
  {
    title: "12. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law provisions.

Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of Makati City, Metro Manila, Philippines.`,
  },
  {
    title: "13. Changes to Terms",
    content: `We reserve the right to modify these Terms at any time. We will provide notice of significant changes by email or by posting a notice on the Service. Your continued use of the Service after changes take effect constitutes your acceptance of the revised Terms.`,
  },
  {
    title: "14. Contact",
    content: `If you have questions about these Terms, please contact us at:

**Aurex Technologies Inc.**
Email: legal@aurex.payroo.xyz
Address: Manila, Philippines`,
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white pt-24">

        {/* Header */}
        <section className="bg-gray-950 py-20 text-center">
          <div className="max-w-3xl mx-auto px-8">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-4">Legal</p>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Terms of Service</h1>
            <p className="text-white/30 text-sm">Last updated: January 1, 2025 · Effective: January 1, 2025</p>
          </div>
        </section>

        {/* Quick nav */}
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-3xl mx-auto px-8 py-4">
            <p className="text-xs text-gray-400">
              These Terms govern your use of Aurex. By using our platform, you agree to these terms. Questions? Email{" "}
              <a href="mailto:legal@aurex.payroo.xyz" className="text-amber-600 hover:underline">legal@aurex.payroo.xyz</a>
            </p>
          </div>
        </div>

        {/* Content */}
        <section className="max-w-3xl mx-auto px-8 py-20">
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
