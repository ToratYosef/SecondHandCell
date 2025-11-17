import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";

export default function Terms() {
  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      
      <main className="flex-1">
        <div className="container max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-4xl font-bold tracking-tight" data-testid="text-terms-headline">
            Terms of Service
          </h1>
          
          <div className="prose prose-gray max-w-none space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="mb-4 text-2xl font-semibold">1. Eligibility</h2>
              <p className="text-muted-foreground">
                SecondHand(Whole)Cell services are available only to business customers engaged in the resale, refurbishment, or repair of electronic devices. By creating an account, you represent that you are authorized to enter into this agreement on behalf of your business entity.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">2. Use of Platform</h2>
              <p className="text-muted-foreground">
                You agree to use the platform solely for lawful wholesale purchasing purposes. You may not resell access to the platform, share account credentials, or use automated tools to access inventory data without written permission.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">3. Account Registration</h2>
              <p className="text-muted-foreground">
                You must provide accurate and complete information during registration. You are responsible for maintaining the security of your account credentials. All activity under your account is your responsibility.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">4. Orders and Pricing</h2>
              <p className="text-muted-foreground">
                All prices are quoted in USD and are subject to change. Tiered pricing applies based on quantity per device variant. Orders are subject to acceptance and inventory availability. We reserve the right to cancel orders that appear fraudulent or in violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">5. Payment Terms</h2>
              <p className="text-muted-foreground">
                Payment is due at time of order unless net terms have been approved for your account. Credit card payments are processed via Stripe. Wire transfers and ACH payments must clear before shipment. Late payments on net terms accounts may result in suspension of purchasing privileges.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">6. Device Grading and Condition</h2>
              <p className="text-muted-foreground">
                All devices are graded according to our published standards (Grades A, B, C, D). While we test every device, grading is subjective and some variation may exist. Devices are sold as-is with no manufacturer warranty. We stand behind our grading and offer a 7-day inspection period.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">7. Returns and Refunds</h2>
              <p className="text-muted-foreground">
                Returns are accepted within 7 days of delivery if devices do not match their stated grade or have undisclosed functional defects. Cosmetic preference returns are not accepted. Return shipping costs are the responsibility of the buyer unless the error was ours. Refunds are processed within 5-10 business days.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">8. Shipping and Risk of Loss</h2>
              <p className="text-muted-foreground">
                Title and risk of loss pass to buyer upon shipment. We are not responsible for carrier delays or damage in transit. Claims for shipping damage must be filed with the carrier. We will assist with documentation as needed.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">9. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Our liability is limited to the purchase price of the devices in question. We are not liable for consequential, indirect, or punitive damages including but not limited to lost profits, business interruption, or reputational harm.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">10. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on this platform including product descriptions, images, and pricing data is our proprietary information. You may not republish, redistribute, or use our content without written permission.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">11. Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate accounts for violation of these terms, fraudulent activity, or at our discretion. Upon termination, all outstanding payment obligations become immediately due.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">12. Governing Law</h2>
              <p className="text-muted-foreground">
                These terms are governed by the laws of the State of Delaware. Any disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">13. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms. Material changes will be communicated via email to registered account holders.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">14. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these terms, please contact us at legal@secondhandwholecell.com.
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
