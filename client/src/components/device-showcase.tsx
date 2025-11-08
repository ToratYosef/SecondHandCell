import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import iphoneImage from "@assets/generated_images/iPhone_product_showcase_6fb9d967.png";
import samsungImage from "@assets/generated_images/Samsung_product_showcase_79f94af7.png";

const showcaseDevices = [
  {
    image: iphoneImage,
    title: "iPhones We Buy",
    models: ["iPhone 15 Pro Max", "iPhone 14 Pro", "iPhone 13"],
    startingPrice: 850,
  },
  {
    image: samsungImage,
    title: "Samsung Devices We Buy",
    models: ["Galaxy S24 Ultra", "Galaxy S23", "Galaxy Z Fold 5"],
    startingPrice: 750,
  },
];

export function DeviceShowcase() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Devices We Buy
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We purchase all recent iPhone and Samsung Galaxy models
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {showcaseDevices.map((device, index) => (
            <Card key={index} className="overflow-hidden hover-elevate" data-testid={`card-device-${index}`}>
              <CardContent className="p-8">
                <div className="flex flex-col items-center">
                  <img 
                    src={device.image} 
                    alt={device.title}
                    className="w-48 h-48 object-contain mb-6"
                  />
                  <h3 className="text-2xl font-semibold mb-4">{device.title}</h3>
                  <ul className="text-muted-foreground space-y-2 mb-6 text-center">
                    {device.models.map((model, idx) => (
                      <li key={idx}>{model}</li>
                    ))}
                  </ul>
                  <p className="text-3xl font-bold text-primary mb-6">
                    Starting at ${device.startingPrice}
                  </p>
                  <Link href="/devices">
                    <Button variant="outline" data-testid={`button-view-all-${index}`}>
                      See All Models
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/quote">
            <Button size="lg" data-testid="button-get-quote-showcase">
              Get Your Quote Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
