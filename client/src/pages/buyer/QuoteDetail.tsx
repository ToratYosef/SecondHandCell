// @ts-nocheck
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { ArrowLeft, Check, X, Package } from "lucide-react";
import type { Quote } from "@shared/schema";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";

export default function QuoteDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: quoteData, isLoading } = useQuery({
    queryKey: ["/api/quotes", id],
    enabled: !!id,
  });

  const updateQuoteMutation = useMutation({
    mutationFn: async (status: "accepted" | "rejected") => {
      return await apiRequest("PATCH", `/api/quotes/${id}`, { status });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      
      if (data.status === "accepted") {
        toast({
          title: "Quote accepted",
          description: "You have accepted this quote. Proceeding to checkout...",
        });
        // Will implement quote-to-order conversion in next task
        // setLocation("/buyer/checkout?quoteId=" + id);
      } else {
        toast({
          title: "Quote rejected",
          description: "You have rejected this quote",
        });
        setLocation("/buyer/quotes");
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update quote status",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-8 space-y-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setLocation("/buyer/quotes")}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <Card>
                <CardHeader>
                  <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                </CardHeader>
              </Card>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (!quoteData) {
    return (
      <div className="flex min-h-screen flex-col">
        <UnifiedHeader />
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-8 space-y-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <Button variant="ghost" onClick={() => setLocation("/buyer/quotes")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quotes
              </Button>
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Quote not found</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const quote = quoteData as Quote & { items: any[] };
  const totalAmount = parseFloat(quote.totalEstimate || "0");
  const canAcceptOrReject = quote.status === "sent" && totalAmount > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8 space-y-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              <Button variant="ghost" size="icon" onClick={() => setLocation("/buyer/quotes")} data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-semibold tracking-tight">{quote.quoteNumber}</h1>
                  <StatusBadge type="quote" status={quote.status} />
                </div>
                <p className="text-muted-foreground mt-1">
                  Requested {format(new Date(quote.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>

            {quote.validUntil && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Valid Until</span>
              <span className="font-medium">
                {format(new Date(quote.validUntil), "MMM d, yyyy")}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quote Items</CardTitle>
          <CardDescription>Devices included in this quote</CardDescription>
        </CardHeader>
        <CardContent>
          {quote.items && quote.items.length > 0 ? (
            <div className="space-y-4">
              {quote.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-start justify-between p-4 border rounded-md" data-testid={`item-${idx}`}>
                  <div className="flex-1">
                    <p className="font-medium">
                      {`${item.model?.brand} ${item.model?.name}`}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.variant?.storage} | {item.variant?.color} | Grade {item.variant?.conditionGrade}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">Qty: {item.quantity}</Badge>
                      {item.proposedUnitPrice !== "0" && (
                        <Badge variant="outline">
                          Unit Price: ${parseFloat(item.proposedUnitPrice).toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {item.lineTotalEstimate !== "0" && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Line Total</p>
                      <p className="text-lg font-semibold">
                        ${parseFloat(item.lineTotalEstimate).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No items in this quote</p>
          )}
        </CardContent>
      </Card>

      {quote.status === "sent" && totalAmount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pricing Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${parseFloat(quote.subtotal || "0").toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">${parseFloat(quote.shippingEstimate || "0").toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">${parseFloat(quote.taxEstimate || "0").toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-semibold">${totalAmount.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 flex-wrap">
            <Button
              onClick={() => updateQuoteMutation.mutate("accepted")}
              disabled={updateQuoteMutation.isPending}
              data-testid="button-accept"
            >
              <Check className="h-4 w-4 mr-2" />
              {updateQuoteMutation.isPending ? "Processing..." : "Accept Quote"}
            </Button>
            <Button
              variant="outline"
              onClick={() => updateQuoteMutation.mutate("rejected")}
              disabled={updateQuoteMutation.isPending}
              data-testid="button-reject"
            >
              <X className="h-4 w-4 mr-2" />
              Reject Quote
            </Button>
          </CardFooter>
        </Card>
      )}

      {quote.status === "draft" && (
        <Card>
          <CardContent className="py-8 text-center">
            <Package className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              This quote is pending review. Our team will respond with pricing shortly.
            </p>
          </CardContent>
        </Card>
      )}

      {quote.status === "accepted" && (
        <Card>
          <CardContent className="py-8 text-center">
            <Check className="h-12 w-12 mx-auto mb-2 text-green-600" />
            <p className="font-medium mb-1">Quote Accepted</p>
            <p className="text-muted-foreground text-sm">
              This quote has been accepted
            </p>
          </CardContent>
        </Card>
      )}

      {quote.status === "rejected" && (
        <Card>
          <CardContent className="py-8 text-center">
            <X className="h-12 w-12 mx-auto mb-2 text-red-600" />
            <p className="font-medium mb-1">Quote Rejected</p>
            <p className="text-muted-foreground text-sm">
              This quote has been rejected
            </p>
          </CardContent>
            </Card>
          )}
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
