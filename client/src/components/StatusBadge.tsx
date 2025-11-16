import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, Ban, Truck, Package } from "lucide-react";

type OrderStatus = "pending_payment" | "payment_review" | "processing" | "shipped" | "completed" | "cancelled";
type CompanyStatus = "pending_review" | "approved" | "rejected" | "suspended";
type PaymentStatus = "unpaid" | "paid" | "partially_paid" | "refunded";
type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";
type TicketStatus = "open" | "in_progress" | "closed";

interface StatusBadgeProps {
  type: "order" | "company" | "payment" | "quote" | "ticket";
  status: OrderStatus | CompanyStatus | PaymentStatus | QuoteStatus | TicketStatus;
}

export function StatusBadge({ type, status }: StatusBadgeProps) {
  const getOrderConfig = (status: OrderStatus) => {
    const configs = {
      pending_payment: { label: "Pending Payment", variant: "secondary" as const, icon: Clock },
      payment_review: { label: "Payment Review", variant: "secondary" as const, icon: Clock },
      processing: { label: "Processing", variant: "default" as const, icon: Package },
      shipped: { label: "Shipped", variant: "default" as const, icon: Truck },
      completed: { label: "Completed", variant: "default" as const, icon: CheckCircle2 },
      cancelled: { label: "Cancelled", variant: "secondary" as const, icon: XCircle },
    };
    return configs[status];
  };

  const getCompanyConfig = (status: CompanyStatus) => {
    const configs = {
      pending_review: { label: "Pending Review", variant: "secondary" as const, icon: Clock },
      approved: { label: "Approved", variant: "default" as const, icon: CheckCircle2 },
      rejected: { label: "Rejected", variant: "destructive" as const, icon: XCircle },
      suspended: { label: "Suspended", variant: "destructive" as const, icon: Ban },
    };
    return configs[status];
  };

  const getPaymentConfig = (status: PaymentStatus) => {
    const configs = {
      unpaid: { label: "Unpaid", variant: "secondary" as const, icon: Clock },
      paid: { label: "Paid", variant: "default" as const, icon: CheckCircle2 },
      partially_paid: { label: "Partially Paid", variant: "secondary" as const, icon: Clock },
      refunded: { label: "Refunded", variant: "secondary" as const, icon: XCircle },
    };
    return configs[status];
  };

  const getQuoteConfig = (status: QuoteStatus) => {
    const configs = {
      draft: { label: "Draft", variant: "secondary" as const, icon: Clock },
      sent: { label: "Sent", variant: "default" as const, icon: Package },
      accepted: { label: "Accepted", variant: "default" as const, icon: CheckCircle2 },
      rejected: { label: "Rejected", variant: "destructive" as const, icon: XCircle },
      expired: { label: "Expired", variant: "secondary" as const, icon: XCircle },
    };
    return configs[status];
  };

  const getTicketConfig = (status: TicketStatus) => {
    const configs = {
      open: { label: "Open", variant: "default" as const, icon: Clock },
      in_progress: { label: "In Progress", variant: "default" as const, icon: Package },
      closed: { label: "Closed", variant: "secondary" as const, icon: CheckCircle2 },
    };
    return configs[status];
  };

  let config;
  if (type === "order") config = getOrderConfig(status as OrderStatus);
  else if (type === "company") config = getCompanyConfig(status as CompanyStatus);
  else if (type === "payment") config = getPaymentConfig(status as PaymentStatus);
  else if (type === "quote") config = getQuoteConfig(status as QuoteStatus);
  else config = getTicketConfig(status as TicketStatus);

  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1" data-testid={`badge-${type}-${status}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
