import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Truck, MessageSquare, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Quote } from "@shared/schema";
import { format } from "date-fns";

const fetchQuote = async (id: string): Promise<Quote> => {
  const res = await apiRequest("GET", `/api/quotes/${id}`);
  return await res.json();
};

export default function ThankYouPage() {
  const [, params] = useRoute<{ id: string }>("/thank-you/:id");
  const quoteId = params?.id ?? "";

  const { data: quote, isLoading, isError } = useQuery({
    queryKey: ["quote", quoteId],
    queryFn: () => fetchQuote(quoteId),
    enabled: Boolean(quoteId),
  });

  const payoutTotal = quote ? (quote.workflow.totalDue ?? quote.price) : 0;
  const formattedPayout = payoutTotal.toFixed(2);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-primary/5">
      <Navbar />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          {isLoading && (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">Retrieving your order details…</CardContent>
            </Card>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertTitle>Order not found</AlertTitle>
              <AlertDescription>
                We couldn't locate your confirmation. Please contact support if you believe this is a mistake.
              </AlertDescription>
            </Alert>
          )}

          {quote && (
            <div className="space-y-8">
              <Card className="border-primary/30">
                <CardHeader className="text-center space-y-2">
                  <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
                  <CardTitle className="text-3xl">Thank you! Your device is reserved.</CardTitle>
                  <p className="text-muted-foreground">We emailed your confirmation and our admin team has your order in queue.</p>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-primary">Order summary</h3>
                    <p className="text-sm text-muted-foreground">
                      Order <span className="font-semibold text-foreground">{quote.orderNumber}</span> • {format(new Date(quote.createdAt), "PPpp")}
                    </p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{quote.modelName}</p>
                      <p>{quote.storage}GB • {quote.condition} • {quote.workflow.lockStatus}</p>
                      <p>Carrier: <span className="font-semibold text-foreground">{quote.workflow.carrier}</span></p>
                    </div>
                    <Badge className="bg-secondary text-secondary-foreground text-lg px-4 py-2 w-fit">
                      Payout: ${formattedPayout}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-primary">Shipping details</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{quote.workflow.shippingInfo.name}</p>
                      <p>{quote.workflow.shippingInfo.address1}</p>
                      {quote.workflow.shippingInfo.address2 && <p>{quote.workflow.shippingInfo.address2}</p>}
                      <p>
                        {quote.workflow.shippingInfo.city}, {quote.workflow.shippingInfo.state} {quote.workflow.shippingInfo.postalCode}
                      </p>
                      <p>{quote.workflow.shippingInfo.phone}</p>
                      <p className="font-semibold text-foreground">{quote.workflow.shippingMethod === "shipping-kit" ? "Shipping kit on the way ($10 deducted)" : "Email label"}</p>
                    </div>
                    <Alert className="bg-primary/10 border-primary/30">
                      <AlertTitle>What happens next?</AlertTitle>
                      <AlertDescription>
                        Our admin will send your {quote.workflow.shippingMethod === "shipping-kit" ? "outbound & inbound ShipEngine kit" : "prepaid email label"}. We'll send a reminder 7 days after you receive the kit and cancel after 15 days if nothing ships back.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Prepare your device</p>
                      <p className="text-sm text-muted-foreground">Backup and factory reset before shipping. Remember, we cannot accept blacklisted phones.</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="font-semibold">Watch for emails</p>
                      <p className="text-sm text-muted-foreground">We'll email labels, reminders, and a Trustpilot review request after payout when eligible.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline">
                    Back to home
                  </Button>
                </Link>
                <Link href="/quote">
                  <Button>
                    Sell another device
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <iframe
                src={`https://scdcb.com/p.ashx?a=144&e=305&t=${quote.id}&p=${formattedPayout}`}
                height="1"
                width="1"
                frameBorder="0"
                title="SellCell tracking"
                style={{ position: "absolute", width: "1px", height: "1px", border: "0", overflow: "hidden" }}
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
