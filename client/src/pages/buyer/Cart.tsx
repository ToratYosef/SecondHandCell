import { BuyerLayout } from "@/components/BuyerLayout";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Truck } from "lucide-react";

const items = [
  {
    title: "iPhone 14 Pro Mix",
    condition: "Grade A/B",
    qty: 50,
    price: 420,
    total: 21000,
  },
  {
    title: "Samsung S22 Lot",
    condition: "Grade A",
    qty: 30,
    price: 285,
    total: 8550,
  },
];

export default function Cart() {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const freight = 620;
  const total = subtotal + freight;

  return (
    <BuyerLayout>
      <PageShell
        title="Cart"
        description="Review quantities and freight before you finalize checkout."
        badge="Ready to ship"
        actions={<Button asChild><a href="/buyer/checkout">Proceed to checkout</a></Button>}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Lots selected</CardTitle>
              <CardDescription>Reserved for 48 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.title} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.condition}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">IMEI clean</Badge>
                      <Badge variant="secondary">Unlocked</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <Button variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
                    <Input type="number" value={item.qty} className="w-20 text-center" readOnly />
                    <Button variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">${item.price}/unit</p>
                      <p className="text-lg font-semibold">${item.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Taxes calculated at payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Freight estimate
                </div>
                <span className="font-semibold">${freight.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <Button className="w-full" asChild>
                <a href="/buyer/checkout">Checkout</a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/buyer/saved-lists">Save for later</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    </BuyerLayout>
  );
}
