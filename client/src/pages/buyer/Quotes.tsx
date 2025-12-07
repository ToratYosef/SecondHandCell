// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Plus, FileText } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import type { Quote } from "@shared/schema";
import { BuyerLayout } from "@/components/BuyerLayout";
import { PageShell } from "@/components/PageShell";

export default function Quotes() {
  const { data: user } = useQuery<any>({
    queryKey: ["/api/auth/me"],
  });

  const { data: company } = useQuery<any>({
    queryKey: ["/api/auth/company"],
    enabled: !!user,
  });

  const { data: quotes, isLoading } = useQuery<Quote[]>({
    queryKey: ["/api/companies", company?.id, "quotes"],
    enabled: !!company?.id,
  });

  const actionButton = (
    <Link href="/buyer/quotes/new">
      <Button data-testid="button-new-quote">
        <Plus className="mr-2 h-4 w-4" />
        Request New Quote
      </Button>
    </Link>
  );

  return (
    <BuyerLayout>
      <PageShell
        title="Quotes"
        description="View and manage your quote requests"
        className="mx-auto max-w-6xl"
        actions={actionButton}
      >
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 w-48 animate-pulse rounded bg-muted" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : quotes && quotes.length > 0 ? (
          <div className="grid gap-4">
            {quotes.map((quote: Quote) => (
              <Card key={quote.id} className="hover-elevate" data-testid={`quote-${quote.id}`}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {quote.quoteNumber}
                        <StatusBadge type="quote" status={quote.status} />
                      </CardTitle>
                      <CardDescription>
                        Requested {format(new Date(quote.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {quote.validUntil && new Date(quote.validUntil) > new Date() && (
                        <Badge variant="secondary">
                          Valid until {format(new Date(quote.validUntil), "MMM d, yyyy")}
                        </Badge>
                      )}
                      <Link href={`/buyer/quotes/${quote.id}`}>
                        <Button variant="outline" size="sm" data-testid={`button-view-${quote.id}`}>
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                {(quote.status === "sent" || quote.status === "accepted") && parseFloat(quote.totalEstimate || "0") > 0 && (
                  <CardContent>
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="text-sm text-muted-foreground">Total Estimate</div>
                      <div className="text-2xl font-semibold">
                        ${parseFloat(quote.totalEstimate).toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-16 w-16 text-muted-foreground opacity-50" />
              <h3 className="mb-2 text-lg font-semibold">No quotes yet</h3>
              <p className="mb-6 text-center text-muted-foreground">
                Request a custom quote for bulk orders or special requirements
              </p>
              <Link href="/buyer/quotes/new">
                <Button data-testid="button-first-quote">
                  <Plus className="mr-2 h-4 w-4" />
                  Request Your First Quote
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </PageShell>
    </BuyerLayout>
  );
}
