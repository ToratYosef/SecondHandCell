import { MousePointerClick, Package, Search, Banknote } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    number: 1,
    title: "Get Quote",
    description: "Answer a few questions about your device to get an instant quote.",
  },
  {
    icon: Package,
    number: 2,
    title: "Ship Device",
    description: "Pack your device and ship it using our free prepaid shipping label.",
  },
  {
    icon: Search,
    number: 3,
    title: "Inspection",
    description: "Our experts inspect your device to confirm its condition.",
  },
  {
    icon: Banknote,
    number: 4,
    title: "Get Paid",
    description: "Receive payment within 2 business days via your preferred method.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selling your device is easy with our simple 4-step process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative" data-testid={`step-${index}`}>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              <div className="relative bg-card border border-card-border rounded-md p-6 hover-elevate">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-10 w-10 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
