import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MousePointerClick, Package, Search, Banknote, Shield, Clock, Truck, CheckCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const steps = [
  {
    icon: MousePointerClick,
    number: 1,
    title: "Get Your Quote",
    description: "Select your device brand, model, storage capacity, and condition to receive an instant price estimate. Our pricing is transparent and competitive.",
    details: [
      "Answer simple questions about your device",
      "Get an instant, accurate quote",
      "No commitment required",
    ],
  },
  {
    icon: Package,
    number: 2,
    title: "Ship Your Device",
    description: "After accepting your quote, we'll send you a prepaid shipping label via email. Pack your device securely and drop it off at any shipping location.",
    details: [
      "Free prepaid shipping label provided",
      "No shipping costs for you",
      "Fully insured during transit",
    ],
  },
  {
    icon: Search,
    number: 3,
    title: "Device Inspection",
    description: "Once we receive your device, our expert technicians will inspect it to verify the condition matches your description.",
    details: [
      "Professional inspection process",
      "24-48 hour turnaround time",
      "Confirmation email sent upon receipt",
    ],
  },
  {
    icon: Banknote,
    number: 4,
    title: "Get Paid",
    description: "After inspection, you'll receive payment within 2 business days via your preferred method. It's that simple!",
    details: [
      "Multiple payment options available",
      "Fast 2 business day processing",
      "Secure payment methods",
    ],
  },
];

const faqs = [
  {
    question: "How accurate are the quotes?",
    answer: "Our quotes are based on current market values and device condition. As long as the device matches the description you provided, you'll receive the quoted amount.",
  },
  {
    question: "What if my device condition doesn't match?",
    answer: "If our inspection reveals a different condition than described, we'll contact you with a revised offer. You can accept the new offer or have your device returned for free.",
  },
  {
    question: "How is my device data protected?",
    answer: "We recommend performing a factory reset before shipping. Upon receipt, we perform a complete data wipe using industry-standard security protocols.",
  },
  {
    question: "What payment methods do you offer?",
    answer: "We offer payment via direct deposit, PayPal, Venmo, or check. You can select your preferred method after accepting the quote.",
  },
  {
    question: "Is there a warranty or guarantee?",
    answer: "Yes! We offer a price match guarantee. If you find a better quote within 48 hours, we'll match it. All transactions are backed by our satisfaction guarantee.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                How It Works
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Selling your device is easy with our simple 4-step process
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6" data-testid={`step-detail-${index}`}>
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {step.number}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Secure & Safe</h3>
                  <p className="text-sm text-muted-foreground">
                    Your device is fully insured during shipping and handling
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Fast Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive payment within 2 business days of inspection
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Free Shipping</h3>
                  <p className="text-sm text-muted-foreground">
                    Prepaid shipping label included at no cost to you
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-card-border rounded-md px-6"
                  data-testid={`faq-${index}`}
                >
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get your instant quote and start the process today
            </p>
            <Link href="/quote">
              <Button size="lg" data-testid="button-start-quote">
                Get Your Quote Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
