import { BuyerLayout } from "@/components/BuyerLayout";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";

export default function Checkout() {
  return (
    <BuyerLayout>
      <PageShell
        title="Checkout"
        description="Confirm freight, payment, and delivery preferences to finalize your order."
        badge="Secure"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Delivery & payment</CardTitle>
              <CardDescription>We keep your details secure and reusable for reorders.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Label className="text-sm font-semibold">Shipping address</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input placeholder="Company name" />
                  <Input placeholder="Contact name" />
                  <Input placeholder="Street address" className="sm:col-span-2" />
                  <Input placeholder="City" />
                  <Input placeholder="State" />
                  <Input placeholder="Postal code" />
                  <Input placeholder="Country" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold">Freight method</Label>
                <RadioGroup defaultValue="freight" className="space-y-3">
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4">
                    <RadioGroupItem value="freight" />
                    <div>
                      <p className="font-semibold">LTL Freight</p>
                      <p className="text-sm text-muted-foreground">Best for pallets and large mixes. 2-4 day transit.</p>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4">
                    <RadioGroupItem value="parcel" />
                    <div>
                      <p className="font-semibold">Insured Parcel</p>
                      <p className="text-sm text-muted-foreground">Fast delivery for smaller lots. Tracking provided.</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold">Payment</Label>
                <Tabs defaultValue="card" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="card">Card</TabsTrigger>
                    <TabsTrigger value="ach">ACH/Wire</TabsTrigger>
                    <TabsTrigger value="terms">Net terms</TabsTrigger>
                  </TabsList>
                  <TabsContent value="card" className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input placeholder="Name on card" />
                      <Input placeholder="Card number" />
                      <Input placeholder="Expiry" />
                      <Input placeholder="CVC" />
                    </div>
                    <p className="text-xs text-muted-foreground">We tokenize your payment info for next time.</p>
                  </TabsContent>
                  <TabsContent value="ach" className="space-y-3">
                    <Input placeholder="Routing number" />
                    <Input placeholder="Account number" />
                    <p className="text-xs text-muted-foreground">We will hold inventory while ACH clears.</p>
                  </TabsContent>
                  <TabsContent value="terms" className="space-y-3">
                    <p className="text-sm text-muted-foreground">Approved accounts can use net terms for frictionless reorders.</p>
                    <Button variant="outline">Talk to finance</Button>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
              <CardDescription>Reserved for the next 48 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Lots</span>
                <span className="font-semibold">$29,550</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Freight
                </div>
                <span className="font-semibold">$620</span>
              </div>
              <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
                <span>Total due</span>
                <span>$30,170</span>
              </div>
              <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 text-emerald-600">
                  <ShieldCheck className="h-4 w-4" />
                  Secure checkout with instant confirmations
                </div>
                <p className="mt-2">Need an invoice? We’ll email PDFs instantly after payment.</p>
              </div>
              <Button className="w-full">Place order</Button>
              <Button variant="ghost" className="w-full">Schedule later</Button>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    </BuyerLayout>
  );
}
