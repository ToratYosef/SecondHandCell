// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Plus, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import type { Quote } from "@shared/schema";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { PublicFooter } from "@/components/PublicFooter";

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Clock className="h-4 w-4" />;
      case "sent":
        return <AlertCircle className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "expired":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "draft":
        return "default";
      case "sent":
        return "secondary";
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      case "expired":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <UnifiedHeader />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-semibold tracking-tight">Quotes</h1>
                <p className="text-muted-foreground mt-1">
                  View and manage your quote requests
                </p>
              </div>
              <Link href="/buyer/quotes/new">
                <Button data-testid="button-new-quote">
                  <Plus className="h-4 w-4 mr-2" />
                  Request New Quote
                </Button>
              </Link>
            </div>

            {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-48 animate-pulse" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : quotes && quotes.length > 0 ? (
        <div className="grid gap-4">
          {quotes.map((quote: Quote) => (
            <Card key={quote.id} className="hover-elevate" data-testid={`quote-${quote.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2">
                      {quote.quoteNumber}
                      <StatusBadge type="quote" status={quote.status} />
                    </CardTitle>
                    <CardDescription>
                      Requested {format(new Date(quote.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
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
            <FileText className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quotes yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Request a custom quote for bulk orders or special requirements
            </p>
            <Link href="/buyer/quotes/new">
              <Button data-testid="button-first-quote">
                <Plus className="h-4 w-4 mr-2" />
                Request Your First Quote
              </Button>
            </Link>
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
