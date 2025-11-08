import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { deviceModels } from "@/lib/device-data";
import { DeviceBrand } from "@shared/schema";

export default function Devices() {
  const [selectedBrand, setSelectedBrand] = useState<DeviceBrand | "All">("All");

  const filteredDevices = selectedBrand === "All" 
    ? deviceModels 
    : deviceModels.filter(d => d.brand === selectedBrand);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Devices We Buy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse all the iPhone and Samsung devices we purchase
            </p>
          </div>

          <div className="flex gap-4 justify-center mb-8 flex-wrap">
            <Button
              variant={selectedBrand === "All" ? "default" : "outline"}
              onClick={() => setSelectedBrand("All")}
              data-testid="button-filter-all"
            >
              All Devices
            </Button>
            <Button
              variant={selectedBrand === "iPhone" ? "default" : "outline"}
              onClick={() => setSelectedBrand("iPhone")}
              data-testid="button-filter-iphone"
            >
              iPhone
            </Button>
            <Button
              variant={selectedBrand === "Samsung" ? "default" : "outline"}
              onClick={() => setSelectedBrand("Samsung")}
              data-testid="button-filter-samsung"
            >
              Samsung
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevices.map((device) => (
              <Card key={device.id} className="hover-elevate" data-testid={`card-device-${device.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {device.brand}
                      </Badge>
                      <h3 className="text-xl font-semibold">{device.name}</h3>
                      {device.year && (
                        <p className="text-sm text-muted-foreground">{device.year}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Storage Options:</p>
                    <div className="flex gap-2 flex-wrap">
                      {device.storageOptions.map((storage) => (
                        <Badge key={storage} variant="outline">
                          {storage >= 1000 ? `${storage / 1000}TB` : `${storage}GB`}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Starting at</p>
                      <p className="text-2xl font-bold text-primary">
                        ${device.basePrice}
                      </p>
                    </div>
                    <Link href="/quote">
                      <Button data-testid={`button-quote-${device.id}`}>
                        Get Quote
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
