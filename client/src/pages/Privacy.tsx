import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

export default function Privacy() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      
      <main className="flex-1">
        <div className="container max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-4xl font-bold tracking-tight" data-testid="text-privacy-headline">
            Privacy Policy
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="mb-4 text-2xl font-semibold">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information you provide directly when creating an account, including your name, email address, phone number, company details, business documentation, and shipping/billing addresses. We also collect payment information processed securely through Stripe.
              </p>
              <p className="text-muted-foreground">
                Automatically collected information includes IP addresses, browser type, device information, pages visited, time spent on pages, and referral sources through standard web analytics.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">2. How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use collected information to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Process and fulfill your wholesale orders</li>
                <li>Verify your business credentials and approve accounts</li>
                <li>Communicate about orders, quotes, and account status</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Improve our platform, products, and services</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Detect and prevent fraud or unauthorized access</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">3. Information Sharing</h2>
              <p className="text-muted-foreground">
                We do not sell your personal information. We share information only in these limited circumstances:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>With service providers who assist with payment processing, shipping, and platform operations</li>
                <li>With your consent or at your direction</li>
                <li>To comply with legal requirements, court orders, or government requests</li>
                <li>To protect our rights, property, or safety, or that of our users</li>
                <li>In connection with a merger, sale, or acquisition (with notice to you)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures including encryption, secure servers, and access controls. Payment card information is processed by Stripe and never stored on our servers. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">5. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Keep you logged in and remember your preferences</li>
                <li>Understand how you use our platform</li>
                <li>Improve user experience and site functionality</li>
                <li>Measure the effectiveness of our marketing</li>
              </ul>
              <p className="text-muted-foreground">
                You can control cookies through your browser settings, though some features may not work properly if cookies are disabled.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">6. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your information for as long as your account is active or as needed to provide services. After account closure, we retain certain information for legitimate business purposes and legal compliance, typically for 7 years in accordance with business record retention requirements.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">7. Your Rights</h2>
              <p className="text-muted-foreground">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Access and receive a copy of your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Object to or restrict certain processing of your information</li>
                <li>Opt out of marketing communications</li>
              </ul>
              <p className="text-muted-foreground">
                To exercise these rights, contact us at privacy@secondhandwholecell.com.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">8. California Privacy Rights</h2>
              <p className="text-muted-foreground">
                California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected, sold, or disclosed, and the right to opt out of sales of personal information. We do not sell personal information as defined by the CCPA.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">9. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our services are designed for business use and not intended for individuals under 18. We do not knowingly collect information from minors.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">10. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy periodically. Material changes will be communicated via email or prominent notice on the platform. Continued use after changes indicates acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">11. Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy-related questions or to exercise your rights, contact us at:
              </p>
              <p className="text-muted-foreground">
                Email: privacy@secondhandwholecell.com<br />
                Mail: SecondHand(Whole)Cell, Privacy Department, [Address]
              </p>
            </section>

            <p className="pt-8 text-xs text-muted-foreground">
              Last updated: November 2024
            </p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
