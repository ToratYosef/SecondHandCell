import { Card, CardContent } from "@/components/ui/card";
import { Zap, DollarSign, Truck } from "lucide-react";

const propositions = [
  {
    icon: Zap,
    title: "Instant Quotes",
    description: "Get an accurate price for your device in under 30 seconds. No waiting, no hassle.",
  },
  {
    icon: DollarSign,
    title: "Top Dollar Prices",
    description: "We offer the best prices in the market. Price match guarantee on all devices.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Send us your device with our prepaid shipping label. Fast and secure delivery.",
  },
];

export function ValuePropositions() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose SecondhandCell?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We make selling your device simple, secure, and rewarding
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {propositions.map((prop, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-value-prop-${index}`}>
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-md bg-primary/10 mb-6">
                  <prop.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{prop.title}</h3>
                <p className="text-muted-foreground">{prop.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
