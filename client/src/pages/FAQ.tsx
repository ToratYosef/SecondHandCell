import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQ() {
  const faqCategories = [
    {
      category: "Getting Started",
      faqs: [
        {
          question: "How do I create a wholesale account?",
          answer: "Click 'Apply Now' in the header and complete the registration form with your company details. You'll need to provide your business information, reseller certificate (if applicable), and first shipping address. Our team typically reviews applications within one business day.",
        },
        {
          question: "What documents do I need to get approved?",
          answer: "You'll need valid business registration documents and a reseller certificate (if your state requires one). We also verify your business address and contact information during the approval process.",
        },
        {
          question: "How long does the approval process take?",
          answer: "Most applications are reviewed and approved within 1 business day. If we need additional information, we'll reach out to you via email. Complex cases may take up to 2-3 business days.",
        },
      ],
    },
    {
      category: "Orders & Payments",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept credit cards (via Stripe), wire transfers, ACH payments, and offer net terms (Net 15/30) for qualified approved accounts. Payment method availability depends on your account status and credit approval.",
        },
        {
          question: "How does tiered pricing work?",
          answer: "Our tiered pricing gives you better per-unit prices as you increase your order quantity. For example, buying 10-24 units might be $200 each, while 25-49 units could be $195 each, and 50+ units $190 each. You'll see all tier breakpoints on each product page.",
        },
        {
          question: "Can I combine different devices in one order?",
          answer: "Yes! You can mix different models, conditions, and storage capacities in a single order. Tiered pricing applies per device variant, so quantities of the same variant determine which price tier you receive for that item.",
        },
        {
          question: "What is your return policy?",
          answer: "We offer a 7-day inspection period for all orders. If devices don't match their grading or have functional issues, contact us immediately for a return authorization. Devices must be in the same condition as received. Cosmetic preference returns are not accepted for wholesale orders.",
        },
      ],
    },
    {
      category: "Grading & Devices",
      faqs: [
        {
          question: "How do you grade device condition?",
          answer: "Every device goes through a 60+ point inspection by certified technicians. Grade A is excellent with minimal wear, Grade B is very good with light use, Grade C is good with moderate wear, and Grade D is fair with heavy cosmetic wear but full functionality. All grades are fully functional.",
        },
        {
          question: "Are all devices unlocked?",
          answer: "Not all devices are unlocked. Each product listing clearly shows the network lock status: unlocked, locked to a specific carrier, or other. Filter by lock status in the catalog to find exactly what you need.",
        },
        {
          question: "Do devices come with accessories?",
          answer: "Unless specifically noted in the product description, devices are sold device-only without original packaging or accessories. We can quote bulk accessory orders separately if needed.",
        },
        {
          question: "How do you test devices?",
          answer: "Our testing includes power-on verification, screen quality assessment, button and port functionality, camera operation, battery health check, network connectivity, and cosmetic grading. Each device is also factory reset and cleaned before shipment.",
        },
      ],
    },
    {
      category: "Shipping & Logistics",
      faqs: [
        {
          question: "How fast do orders ship?",
          answer: "Orders placed before 2 PM EST typically ship within 24-48 hours. You'll receive tracking information via email as soon as your order ships. Larger orders (100+ units) may require an additional day for preparation.",
        },
        {
          question: "What shipping carriers do you use?",
          answer: "We primarily use FedEx and UPS for wholesale orders, with service level depending on order size and destination. Expedited shipping is available for an additional fee.",
        },
        {
          question: "Do you ship internationally?",
          answer: "Currently we ship within the United States only. International wholesale inquiries can be submitted through our support page for case-by-case review.",
        },
        {
          question: "How are devices packaged?",
          answer: "Devices are securely packaged in anti-static bags, separated by condition grade, and packed in sturdy boxes with protective material. Large orders may ship in multiple boxes or on pallets.",
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      
      <main className="flex-1">
        {/* Header */}
        <section className="border-b bg-muted/30 py-16 lg:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl" data-testid="text-faq-headline">
                Frequently Asked Questions
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Find answers to common questions about wholesale purchasing, grading, and logistics
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 lg:py-24">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-12">
              {faqCategories.map((category, catIndex) => (
                <Card key={catIndex} data-testid={`card-faq-category-${catIndex}`}>
                  <CardHeader>
                    <CardTitle className="text-2xl">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.faqs.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`item-${catIndex}-${faqIndex}`}>
                          <AccordionTrigger className="text-left" data-testid={`accordion-trigger-${catIndex}-${faqIndex}`}>
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm leading-relaxed text-muted-foreground" data-testid={`accordion-content-${catIndex}-${faqIndex}`}>
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
