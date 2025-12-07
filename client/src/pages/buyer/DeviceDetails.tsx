import { BuyerLayout } from "@/components/BuyerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { PageShell } from "@/components/PageShell";

const specList = [
  { label: "Model", value: "iPhone 14 Pro" },
  { label: "Storage", value: "256GB" },
  { label: "Color mix", value: "Space Black, Deep Purple" },
  { label: "Condition", value: "Grade A/B tested" },
  { label: "Network", value: "Unlocked" },
];

const pricingTiers = [
  { range: "10-49 units", price: "$435", savings: "Save $15" },
  { range: "50-149 units", price: "$420", savings: "Save $30" },
  { range: "150+ units", price: "$405", savings: "Save $45" },
];

export default function DeviceDetails() {
  return (
    <BuyerLayout>
      <PageShell
        title="Device detail"
        description="All the data you need to commit to a lot with confidence."
        badge="Lot overview"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="icon"><Heart className="h-4 w-4" /></Button>
            <Button asChild><a href="/buyer/cart">Add to cart</a></Button>
          </div>
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>iPhone 14 Pro Mixed Lot</CardTitle>
              <CardDescription>Unlocked • Face ID calibrated • Tested on PhoneCheck</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {specList.map((spec) => (
                  <div key={spec.label} className="rounded-xl border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{spec.label}</p>
                    <p className="text-base font-semibold">{spec.value}</p>
                  </div>
                ))}
              </div>

              <Tabs defaultValue="pricing" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="testing">Testing</TabsTrigger>
                  <TabsTrigger value="grades">Cosmetics</TabsTrigger>
                </TabsList>
                <TabsContent value="pricing" className="grid gap-3 sm:grid-cols-3">
                  {pricingTiers.map((tier) => (
                    <Card key={tier.range} className="border-primary/20 hover:border-primary">
                      <CardHeader>
                        <CardTitle className="text-lg">{tier.range}</CardTitle>
                        <CardDescription>{tier.savings}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold">{tier.price}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="testing">
                  <Card className="border-dashed">
                    <CardHeader className="space-y-1">
                      <CardTitle>Certified diagnostics</CardTitle>
                      <CardDescription>Battery health, OEM parts check, secure data wipe documented.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <p>PhoneCheck report available for every IMEI.</p>
                      <p>30-day RMA on functional defects.</p>
                      <p>Carrier status validated for every unit.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="grades">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {["Grade A", "Grade B"].map((grade) => (
                      <Card key={grade}>
                        <CardHeader>
                          <CardTitle>{grade}</CardTitle>
                          <CardDescription>Detailed cosmetic expectations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                          <p>Minor surface wear allowed; no cracks.</p>
                          <p>Fully functional; buttons and biometrics tested.</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Order this lot</CardTitle>
              <CardDescription>Secure inventory for 48 hours while you finalize payment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border bg-muted/40 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Available units</span>
                  <span className="font-semibold">320</span>
                </div>
                <Progress value={82} className="mt-3" />
                <p className="mt-2 text-xs text-muted-foreground">High velocity lot — moving quickly</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-emerald-600">
                  <ShieldCheck className="h-4 w-4" />
                  30-day functional warranty included
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Truck className="h-4 w-4" />
                  Ships from Dallas in 24-48 hours
                </div>
                <div className="flex items-center gap-2 text-amber-600">
                  <Sparkles className="h-4 w-4" />
                  Eligible for grading photos on request
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" asChild>
                  <a href="/buyer/checkout">Start checkout</a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href="/buyer/quotes/new">Request quote</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          <AccordionItem value="faq-1" className="border rounded-xl px-4">
            <AccordionTrigger>What does grading include?</AccordionTrigger>
            <AccordionContent>
              Grade A includes light wear with no cracks; Grade B allows moderate signs of use with full functionality verified.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2" className="border rounded-xl px-4">
            <AccordionTrigger>Can I split shipments?</AccordionTrigger>
            <AccordionContent>
              Yes, select freight preferences at checkout or coordinate with your rep for staggered deliveries.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3" className="border rounded-xl px-4">
            <AccordionTrigger>Do you provide IMEI lists?</AccordionTrigger>
            <AccordionContent>
              Secure IMEI lists are provided upon purchase and available via CSV export.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </PageShell>
    </BuyerLayout>
  );
}
