import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Quote, QuoteWorkflow, WorkflowLabel, ReminderStatus, LabelActionKind, QuoteEmailTemplate } from "@shared/schema";
import { SupportConsole } from "./support-console";
import {
  MailCheck,
  Ship,
  PackageCheck,
  DollarSign,
  RefreshCcw,
  Undo2,
  Clock,
  Printer,
  Plus,
  UploadCloud,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const emailSuccessMessages: Record<QuoteEmailTemplate, string> = {
  trustpilot: "Trustpilot invite sent to the customer.",
  requote: "Requote email delivered for approval.",
  reminder: "Reminder email sent to the customer.",
  cancel: "Cancellation notice emailed to the customer.",
};

interface PatchPayload {
  id: string;
  payload: any;
  successMessage?: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  label_sent: "bg-sky-100 text-sky-900",
  kit_prepared: "bg-emerald-100 text-emerald-900",
  awaiting_device: "bg-violet-100 text-violet-900",
  device_received: "bg-blue-100 text-blue-900",
  inspection_passed: "bg-green-100 text-green-900",
  ready_for_payment: "bg-lime-100 text-lime-900",
  paid: "bg-secondary text-secondary-foreground",
  requote_sent: "bg-orange-100 text-orange-900",
  awaiting_requote_confirmation: "bg-amber-200 text-amber-900",
  return_initiated: "bg-rose-100 text-rose-900",
  canceled: "bg-gray-200 text-gray-700",
};

const reminderLabels: Record<ReminderStatus, string> = {
  not_sent: "No reminders sent",
  seven_day: "7-day reminder sent",
  fifteen_day: "15-day warning sent",
  canceled: "Order canceled after reminder",
};

const fetchQuotes = async (): Promise<Quote[]> => {
  const res = await apiRequest("GET", "/api/quotes");
  return await res.json();
};

function buildWorkflow(base: QuoteWorkflow, updates: Partial<QuoteWorkflow>): QuoteWorkflow {
  return {
    ...base,
    ...updates,
    shippingInfo: updates.shippingInfo ?? base.shippingInfo,
    trustpilotEligible: updates.trustpilotEligible ?? base.trustpilotEligible,
    shippingKitFee: updates.shippingKitFee ?? base.shippingKitFee,
    payoutAmount: updates.payoutAmount ?? base.payoutAmount,
    totalDue: updates.totalDue ?? base.totalDue,
    reviewEmailSentAt: updates.reviewEmailSentAt ?? base.reviewEmailSentAt,
    paymentReleasedAt: updates.paymentReleasedAt ?? base.paymentReleasedAt,
    reminders: updates.reminders ?? base.reminders,
    adminNotes: updates.adminNotes ?? base.adminNotes,
    devicePhotos: updates.devicePhotos ?? base.devicePhotos,
    kitLabels: {
      outbound: updates.kitLabels?.outbound ?? base.kitLabels?.outbound,
      inbound: updates.kitLabels?.inbound ?? base.kitLabels?.inbound,
    },
    returnLabel: updates.returnLabel ?? base.returnLabel,
    statusHistory: updates.statusHistory ?? base.statusHistory,
  };
}

export function AdminDashboard() {
  const { toast } = useToast();
  const { data: quotes, isLoading, refetch } = useQuery({ queryKey: ["admin-quotes"], queryFn: fetchQuotes });
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [labelNotes, setLabelNotes] = useState("");
  const [outboundLabel, setOutboundLabel] = useState<WorkflowLabel>({});
  const [inboundLabel, setInboundLabel] = useState<WorkflowLabel>({});
  const [returnLabel, setReturnLabel] = useState<WorkflowLabel>({});
  const [photoUrl, setPhotoUrl] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [requoteValue, setRequoteValue] = useState("");
  const [labelSending, setLabelSending] = useState(false);
  const [kitLoading, setKitLoading] = useState<"outbound" | "inbound" | null>(null);
  const [returnSending, setReturnSending] = useState(false);
  const [emailAction, setEmailAction] = useState<QuoteEmailTemplate | null>(null);

  const selectedQuote = useMemo(() => {
    if (!quotes || quotes.length === 0) return null;
    if (selectedQuoteId) {
      return quotes.find((quote) => quote.id === selectedQuoteId) ?? quotes[0];
    }
    return quotes[0];
  }, [quotes, selectedQuoteId]);

  useEffect(() => {
    if (selectedQuote) {
      setAdminNotes(selectedQuote.workflow.adminNotes ?? "");
      setOutboundLabel(selectedQuote.workflow.kitLabels?.outbound ?? {});
      setInboundLabel(selectedQuote.workflow.kitLabels?.inbound ?? {});
      setReturnLabel(selectedQuote.workflow.returnLabel ?? {});
      setRequoteValue(selectedQuote.price.toString());
    }
  }, [selectedQuote?.id]);

  const mutation = useMutation({
    mutationFn: async (variables: PatchPayload) => {
      const res = await apiRequest("PATCH", `/api/quotes/${variables.id}`, variables.payload);
      const updated = await res.json();
      return { quote: updated as Quote, successMessage: variables.successMessage };
    },
    onSuccess: ({ quote, successMessage }) => {
      toast({
        title: "Order updated",
        description: successMessage ?? "The workflow has been refreshed.",
      });
      setSelectedQuoteId(quote.id);
      void refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message ?? "Unable to update order",
        variant: "destructive",
      });
    },
  });

  const syncFromQuote = (quote: Quote) => {
    setSelectedQuoteId(quote.id);
    setAdminNotes(quote.workflow.adminNotes ?? "");
    setOutboundLabel(quote.workflow.kitLabels?.outbound ?? {});
    setInboundLabel(quote.workflow.kitLabels?.inbound ?? {});
    setReturnLabel(quote.workflow.returnLabel ?? {});
    setRequoteValue(quote.price.toString());
  };

  const executeLabelAction = async (
    kind: LabelActionKind,
    options: { notes?: string; sendEmail?: boolean } = {}
  ) => {
    if (!selectedQuote) return undefined;
    const res = await apiRequest("POST", `/api/quotes/${selectedQuote.id}/labels`, {
      kind,
      notes: options.notes,
      sendEmail: options.sendEmail,
      adminNotes,
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error ?? "Unable to create label");
    }
    const data = await res.json();
    const updated = data.quote as Quote;
    syncFromQuote(updated);
    return updated;
  };

  const sendQuoteEmail = async (template: QuoteEmailTemplate, data: Record<string, unknown> = {}) => {
    if (!selectedQuote) return;
    setEmailAction(template);
    try {
      const res = await apiRequest("POST", `/api/quotes/${selectedQuote.id}/emails`, {
        template,
        adminNotes,
        ...data,
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error ?? "Unable to send email");
      }
      toast({
        title: "Email sent",
        description: emailSuccessMessages[template],
      });
      return await res.json();
    } catch (error: any) {
      toast({
        title: "Email failed",
        description: error.message ?? "Unable to send email",
        variant: "destructive",
      });
      throw error;
    } finally {
      setEmailAction(null);
    }
  };

  const appendStatus = (status: string, note?: string) => {
    if (!selectedQuote) return undefined;
    return [
      ...selectedQuote.workflow.statusHistory,
      {
        status,
        changedAt: new Date().toISOString(),
        note,
      },
    ];
  };

  const runUpdate = async (options: {
    status?: string;
    workflowUpdates?: Partial<QuoteWorkflow>;
    successMessage?: string;
    reviewEmailSent?: boolean;
    price?: number;
    note?: string;
  }) => {
    if (!selectedQuote) return undefined;
    const { status, workflowUpdates = {}, successMessage, reviewEmailSent, price, note } = options;

    const mergedWorkflow = buildWorkflow(selectedQuote.workflow, {
      ...workflowUpdates,
      statusHistory: status ? appendStatus(status, note) : workflowUpdates.statusHistory ?? selectedQuote.workflow.statusHistory,
    });

    const payload: Record<string, unknown> = {
      workflow: mergedWorkflow,
    };

    if (status) {
      payload.status = status;
    }
    if (typeof reviewEmailSent === "boolean") {
      payload.reviewEmailSent = reviewEmailSent;
    }
    if (typeof price === "number" && !Number.isNaN(price)) {
      payload.price = price;
    }

    const result = await mutation.mutateAsync({ id: selectedQuote.id, payload, successMessage });
    syncFromQuote(result.quote);
    return result.quote;
  };

  const handleSendLabelEmail = async () => {
    if (!selectedQuote) return;
    setLabelSending(true);
    try {
      await executeLabelAction("email_label", {
        notes: labelNotes || undefined,
        sendEmail: true,
      });
      toast({
        title: "Label emailed",
        description: "Customer received their prepaid label.",
      });
      setLabelNotes("");
      void refetch();
    } catch (error: any) {
      toast({
        title: "Label email failed",
        description: error.message ?? "Unable to send label",
        variant: "destructive",
      });
    } finally {
      setLabelSending(false);
    }
  };

  const handleShippingKitUpdate = async (direction: "outbound" | "inbound") => {
    if (!selectedQuote) return;
    setKitLoading(direction);
    try {
      await executeLabelAction(direction === "outbound" ? "kit_outbound" : "kit_inbound", {
        notes: direction === "inbound" ? labelNotes || undefined : undefined,
        sendEmail: direction === "inbound",
      });
      toast({
        title: direction === "outbound" ? "Outbound label ready" : "Inbound label sent",
        description:
          direction === "inbound"
            ? "Customer received the kit instructions."
            : "Download and print the kit label for shipping.",
      });
      if (direction === "inbound") {
        setLabelNotes("");
      }
      void refetch();
    } catch (error: any) {
      toast({
        title: "Label generation failed",
        description: error.message ?? "Unable to generate label",
        variant: "destructive",
      });
    } finally {
      setKitLoading(null);
    }
  };

  const handleMarkReceived = async () => {
    try {
      await runUpdate({
        status: "device_received",
        workflowUpdates: { adminNotes },
        successMessage: "Device marked as received",
        note: "Device checked in",
      });
    } catch {
      // mutation error already surfaced via toast
    }
  };

  const handleApprovePayment = async () => {
    if (!selectedQuote) return;
    try {
      await runUpdate({
        status: "paid",
        workflowUpdates: {
          paymentReleasedAt: new Date().toISOString(),
          adminNotes,
        },
        successMessage: "Payment recorded",
        note: "Customer paid",
      });
    } catch {
      // toast already handled
    }
  };

  const handleSendTrustpilot = async () => {
    try {
      const updated = await runUpdate({
        workflowUpdates: {
          reviewEmailSentAt: new Date().toISOString(),
          adminNotes,
        },
        reviewEmailSent: true,
        successMessage: "Trustpilot invite noted",
        note: "Trustpilot invite sent",
      });
      if (updated) {
        try {
          await sendQuoteEmail("trustpilot");
        } catch {
          // toast handled in sendQuoteEmail
        }
      }
    } catch {
      // mutation toast already displayed
    }
  };

  const handleRequote = async () => {
    if (!selectedQuote) return;
    const nextPrice = Number.parseFloat(requoteValue);
    const payout = Number.isNaN(nextPrice) ? selectedQuote.price : nextPrice;
    try {
      const updated = await runUpdate({
        status: "requote_sent",
        workflowUpdates: {
          payoutAmount: payout,
          totalDue:
            selectedQuote.workflow.shippingMethod === "shipping-kit"
              ? Math.max(payout - selectedQuote.workflow.shippingKitFee, 0)
              : payout,
          trustpilotEligible: false,
          adminNotes,
        },
        price: payout,
        successMessage: "Requote sent to customer",
        note: "Requote emailed",
      });
      if (updated) {
        try {
          await sendQuoteEmail("requote", { requoteAmount: payout });
        } catch {
          // handled above
        }
      }
    } catch {
      // mutation toast already displayed
    }
  };

  const handleRequoteAccepted = async () => {
    if (!selectedQuote) return;
    const payout = Number.parseFloat(requoteValue);
    const next = Number.isNaN(payout) ? selectedQuote.price : payout;
    try {
      await runUpdate({
        status: "ready_for_payment",
        workflowUpdates: {
          payoutAmount: next,
          totalDue:
            selectedQuote.workflow.shippingMethod === "shipping-kit"
              ? Math.max(next - selectedQuote.workflow.shippingKitFee, 0)
              : next,
          trustpilotEligible: true,
          adminNotes,
        },
        price: next,
        successMessage: "Requote accepted",
        note: "Customer approved requote",
      });
    } catch {
      // toast already displayed
    }
  };

  const handleReturnLabel = async () => {
    if (!selectedQuote) return;
    setReturnSending(true);
    try {
      await executeLabelAction("return_label", {
        notes: returnLabel.notes || undefined,
        sendEmail: true,
      });
      toast({
        title: "Return started",
        description: "Return tracking emailed to the customer.",
      });
      void refetch();
    } catch (error: any) {
      toast({
        title: "Return label failed",
        description: error.message ?? "Unable to create return label",
        variant: "destructive",
      });
    } finally {
      setReturnSending(false);
    }
  };

  const handleReminder = async (type: ReminderStatus) => {
    try {
      const updated = await runUpdate({
        workflowUpdates: {
          reminders: {
            status: type,
            lastSentAt: new Date().toISOString(),
          },
          adminNotes,
        },
        successMessage:
          type === "seven_day"
            ? "7-day reminder logged"
            : type === "fifteen_day"
              ? "15-day warning recorded"
              : "Reminder status updated",
        note: type === "seven_day" ? "7-day reminder" : type === "fifteen_day" ? "15-day warning" : undefined,
      });
      if (updated && (type === "seven_day" || type === "fifteen_day")) {
        try {
          await sendQuoteEmail("reminder", { reminderType: type });
        } catch {
          // handled in sendQuoteEmail
        }
      }
    } catch {
      // mutation toast already surfaced
    }
  };

  const handleCancelAfterReminder = async () => {
    try {
      const updated = await runUpdate({
        status: "canceled",
        workflowUpdates: {
          reminders: {
            status: "canceled",
            lastSentAt: new Date().toISOString(),
          },
          adminNotes,
        },
        successMessage: "Order canceled after reminder",
        note: "Order canceled after reminder",
      });
      if (updated) {
        try {
          await sendQuoteEmail("cancel");
        } catch {
          // toast already shown
        }
      }
    } catch {
      // mutation toast already displayed
    }
  };

  const handleAddPhoto = () => {
    if (!selectedQuote || !photoUrl) return;
    const currentPhotos = selectedQuote.workflow.devicePhotos ?? [];
    void runUpdate({
      workflowUpdates: {
        devicePhotos: [...currentPhotos, photoUrl],
        adminNotes,
      },
      successMessage: "Photo added",
    });
    setPhotoUrl("");
  };

  const stats = useMemo(() => {
    if (!quotes) {
      return { total: 0, pending: 0, kits: 0, awaitingReturn: 0 };
    }
    const total = quotes.length;
    const pending = quotes.filter((quote) => quote.status === "pending" || quote.status === "label_sent").length;
    const kits = quotes.filter((quote) => quote.workflow.shippingMethod === "shipping-kit").length;
    const awaitingReturn = quotes.filter((quote) => quote.status === "return_initiated").length;
    return { total, pending, kits, awaitingReturn };
  }, [quotes]);

  const analytics = useMemo(() => {
    if (!quotes || quotes.length === 0) {
      return { daily: [] as { day: string; orders: number; payout: number }[], shippingKit: 0, emailLabel: 0, pipeline: 0, average: 0 };
    }

    const dailyMap = new Map<string, { orders: number; payout: number }>();
    let shippingKit = 0;
    let pipeline = 0;

    quotes.forEach((quote) => {
      if (quote.workflow.shippingMethod === "shipping-kit") {
        shippingKit += 1;
      }
      pipeline += quote.workflow.totalDue;

      const key = format(new Date(quote.createdAt), "yyyy-MM-dd");
      const entry = dailyMap.get(key) ?? { orders: 0, payout: 0 };
      entry.orders += 1;
      entry.payout += quote.workflow.totalDue;
      dailyMap.set(key, entry);
    });

    const daily = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([key, entry]) => ({
        day: format(new Date(key), "MMM d"),
        orders: entry.orders,
        payout: Number(entry.payout.toFixed(2)),
      }));

    const emailLabel = quotes.length - shippingKit;
    const average = quotes.length ? pipeline / quotes.length : 0;

    return { daily, shippingKit, emailLabel, pipeline, average };
  }, [quotes]);

  const shippingTotal = analytics.shippingKit + analytics.emailLabel;
  const kitPercent = shippingTotal ? Math.round((analytics.shippingKit / shippingTotal) * 100) : 0;
  const emailPercent = shippingTotal ? 100 - kitPercent : 0;

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Loading orders…</p>
      </div>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <ShieldCheck className="h-12 w-12 text-primary mx-auto" />
        <h2 className="text-2xl font-semibold">No orders yet</h2>
        <p className="text-muted-foreground">Quotes will appear here once customers secure their payouts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total orders</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-3xl font-bold text-primary">{stats.total}</span>
            <PackageCheck className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Awaiting action</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-3xl font-bold text-secondary">{stats.pending}</span>
            <Clock className="h-8 w-8 text-secondary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Shipping kits</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-3xl font-bold text-primary">{stats.kits}</span>
            <Ship className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Returns in progress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-3xl font-bold text-destructive">{stats.awaitingReturn}</span>
            <Undo2 className="h-8 w-8 text-destructive" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              Order velocity
              <span className="text-xs text-muted-foreground">Last 7 days</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.daily.length ? (
              <ChartContainer
                config={{
                  orders: { label: "Orders", color: "hsl(var(--primary))" },
                  payout: { label: "Payout", color: "hsl(var(--secondary))" },
                }}
                className="h-[260px]"
              >
                <LineChart data={analytics.daily}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} className="stroke-border" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis yAxisId="right" orientation="right" hide />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                  <Line yAxisId="left" type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="payout" stroke="var(--color-payout)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground">No order history yet to visualize.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pipeline snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Total payout pipeline</p>
              <p className="text-2xl font-semibold text-foreground">${analytics.pipeline.toLocaleString()}</p>
              <p className="text-xs mt-1">Average payout ${analytics.average.toFixed(2)}</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Shipping kits</span>
                <span>{kitPercent}%</span>
              </div>
              <Progress value={kitPercent} className="h-2 mt-2" />
              <p className="mt-1 text-xs">{analytics.shippingKit} orders using $10 kits</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Email labels</span>
                <span>{emailPercent}%</span>
              </div>
              <Progress value={emailPercent} className="h-2 mt-2" />
              <p className="mt-1 text-xs">{analytics.emailLabel} orders on instant labels</p>
            </div>
            <p className="text-xs">
              Keep an eye on kit usage to forecast ShipEngine spend and schedule reminder cadence.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[520px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Payout</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <TableRow
                      key={quote.id}
                      className={`cursor-pointer ${selectedQuote?.id === quote.id ? "bg-primary/5" : ""}`}
                      onClick={() => setSelectedQuoteId(quote.id)}
                    >
                      <TableCell>
                        <div className="font-semibold">{quote.orderNumber}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(quote.createdAt), "MMM d, yyyy")}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusStyles[quote.status] ?? "bg-muted text-muted-foreground"}>{quote.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">${quote.workflow.totalDue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {selectedQuote && (
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-primary/30">
                    <AvatarFallback>{selectedQuote.customerName?.[0] ?? "C"}</AvatarFallback>
                  </Avatar>
                  <span>Order {selectedQuote.orderNumber}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedQuote.customerName ?? "Guest"} • {selectedQuote.customerEmail}
                </p>
              </div>
              <Badge className={statusStyles[selectedQuote.status] ?? "bg-muted text-muted-foreground"}>{selectedQuote.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Device details</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <span className="font-semibold text-foreground">{selectedQuote.modelName}</span> • {selectedQuote.storage}GB • {selectedQuote.condition}
                    </p>
                    <p>Carrier: <span className="font-semibold text-foreground">{selectedQuote.workflow.carrier}</span> ({selectedQuote.workflow.lockStatus})</p>
                    <p>Initial quote: <span className="font-semibold">${selectedQuote.price.toLocaleString()}</span></p>
                    <p>Kit fee: <span className="font-semibold">${selectedQuote.workflow.shippingKitFee}</span></p>
                    <p>Estimated payout: <span className="font-semibold">${selectedQuote.workflow.totalDue.toLocaleString()}</span></p>
                    <p>Shipping option: <span className="font-semibold capitalize">{selectedQuote.workflow.shippingMethod.replace("-", " ")}</span></p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-primary">Shipping details</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{selectedQuote.workflow.shippingInfo.name}</p>
                    <p>{selectedQuote.workflow.shippingInfo.address1}</p>
                    {selectedQuote.workflow.shippingInfo.address2 && <p>{selectedQuote.workflow.shippingInfo.address2}</p>}
                    <p>
                      {selectedQuote.workflow.shippingInfo.city}, {selectedQuote.workflow.shippingInfo.state} {selectedQuote.workflow.shippingInfo.postalCode}
                    </p>
                    <p>Phone: {selectedQuote.workflow.shippingInfo.phone}</p>
                  </div>
                  <Alert className="bg-muted/50 border-muted">
                    <AlertTitle>Reminder policy</AlertTitle>
                    <AlertDescription>
                      {reminderLabels[selectedQuote.workflow.reminders?.status ?? "not_sent"]}
                      {selectedQuote.workflow.reminders?.lastSentAt && (
                        <span className="block mt-1 text-xs">Last action: {format(new Date(selectedQuote.workflow.reminders.lastSentAt), "PPpp")}</span>
                      )}
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-primary flex items-center gap-2"><Ship className="h-4 w-4" /> Label management</h3>
                  <Textarea
                    placeholder={
                      selectedQuote.workflow.shippingMethod === "shipping-kit"
                        ? "Optional note to include in the inbound kit email"
                        : "Notes to include in the shipping label email"
                    }
                    value={labelNotes}
                    onChange={(event) => setLabelNotes(event.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    {selectedQuote.workflow.shippingMethod === "email-label" && (
                      <Button variant="outline" onClick={handleSendLabelEmail} disabled={labelSending || mutation.isPending}>
                        <MailCheck className="h-4 w-4 mr-2" /> Generate &amp; email label
                      </Button>
                    )}
                    {selectedQuote.workflow.shippingMethod === "shipping-kit" && (
                      <Button
                        variant="outline"
                        onClick={() => handleShippingKitUpdate("outbound")}
                        disabled={kitLoading === "outbound" || mutation.isPending}
                      >
                        <UploadCloud className="h-4 w-4 mr-2" /> Generate outbound kit label
                      </Button>
                    )}
                    {selectedQuote.workflow.shippingMethod === "shipping-kit" && (
                      <Button
                        variant="outline"
                        onClick={() => handleShippingKitUpdate("inbound")}
                        disabled={kitLoading === "inbound" || mutation.isPending}
                      >
                        <UploadCloud className="h-4 w-4 mr-2" /> Generate &amp; email inbound label
                      </Button>
                    )}
                  </div>
                  {selectedQuote.workflow.shippingMethod === "shipping-kit" && (
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <LabelledInput
                          label="Outbound tracking"
                          value={outboundLabel.trackingNumber ?? ""}
                          readOnly
                          description={outboundLabel.trackingNumber ? "Share with the customer if they need an ETA." : undefined}
                        />
                        <LabelledInput
                          label="Outbound label URL"
                          value={outboundLabel.url ?? ""}
                          readOnly
                          description={outboundLabel.url ? "Open to print the kit you send to the customer." : undefined}
                        />
                      {outboundLabel.url && (
                        <Button variant="ghost" asChild className="px-0 text-primary">
                          <a href={outboundLabel.url} target="_blank" rel="noreferrer">
                            Open outbound label
                          </a>
                        </Button>
                      )}
                      </div>
                      <div className="space-y-2">
                        <LabelledInput
                          label="Inbound tracking"
                          value={inboundLabel.trackingNumber ?? ""}
                          readOnly
                          description={inboundLabel.trackingNumber ? "Monitor the return from the customer." : undefined}
                        />
                        <LabelledInput
                          label="Inbound label URL"
                          value={inboundLabel.url ?? ""}
                          readOnly
                          description={inboundLabel.url ? "Link included in the customer email." : undefined}
                        />
                        {inboundLabel.url && (
                          <Button variant="ghost" asChild className="px-0 text-primary">
                            <a href={inboundLabel.url} target="_blank" rel="noreferrer">
                              Open inbound label
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  {selectedQuote.workflow.shippingMethod === "email-label" && (inboundLabel.trackingNumber || inboundLabel.url) && (
                    <div className="space-y-2">
                      <LabelledInput
                        label="Label tracking"
                        value={inboundLabel.trackingNumber ?? ""}
                        readOnly
                        description="Used by the customer when they drop off the package."
                      />
                      <LabelledInput label="Label URL" value={inboundLabel.url ?? ""} readOnly />
                      {inboundLabel.url && (
                        <Button variant="ghost" asChild className="px-0 text-primary">
                          <a href={inboundLabel.url} target="_blank" rel="noreferrer">
                            Open shipping label
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-primary flex items-center gap-2"><DollarSign className="h-4 w-4" /> Inspection outcomes</h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <Button variant="outline" onClick={handleMarkReceived} disabled={mutation.isPending}>
                      <PackageCheck className="h-4 w-4 mr-2" /> Device received
                    </Button>
                    <Button variant="outline" onClick={handleApprovePayment} disabled={mutation.isPending}>
                      <DollarSign className="h-4 w-4 mr-2" /> Approve &amp; pay
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSendTrustpilot}
                      disabled={
                        mutation.isPending ||
                        emailAction === "trustpilot" ||
                        selectedQuote.reviewEmailSent ||
                        !selectedQuote.workflow.trustpilotEligible
                      }
                    >
                      <MailCheck className="h-4 w-4 mr-2" /> Send Trustpilot invite
                    </Button>
                    <Button variant="outline" onClick={handleReturnLabel} disabled={returnSending || mutation.isPending}>
                      <Undo2 className="h-4 w-4 mr-2" /> Start return
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleReminder("seven_day")}
                      disabled={mutation.isPending || emailAction === "reminder"}
                    >
                      <Clock className="h-4 w-4 mr-2" /> Log 7-day reminder
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReminder("fifteen_day")}
                      disabled={mutation.isPending || emailAction === "reminder"}
                    >
                      <Clock className="h-4 w-4 mr-2" /> Log 15-day warning
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelAfterReminder}
                      disabled={mutation.isPending || emailAction === "cancel"}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" /> Cancel after reminder
                    </Button>
                    <Button variant="outline" onClick={handleRequoteAccepted} disabled={mutation.isPending}>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Requote accepted
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <LabelledInput
                      label="Requote payout"
                      value={requoteValue}
                      onChange={(value) => setRequoteValue(value)}
                      type="number"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleRequote}
                        disabled={mutation.isPending || emailAction === "requote"}
                      >
                        <RefreshCcw className="h-4 w-4 mr-2" /> Send requote
                      </Button>
                      <Button variant="outline" onClick={() => handleReminder("not_sent")} disabled={mutation.isPending}>
                        <ShieldCheck className="h-4 w-4 mr-2" /> Reset reminders
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <LabelledInput
                      label="Return tracking"
                      value={returnLabel.trackingNumber ?? ""}
                      readOnly
                      description={returnLabel.trackingNumber ? "Share with the customer for their reference." : undefined}
                    />
                    <LabelledInput
                      label="Return label URL"
                      value={returnLabel.url ?? ""}
                      readOnly
                    />
                    {returnLabel.url && (
                      <Button variant="ghost" asChild className="px-0 text-primary">
                        <a href={returnLabel.url} target="_blank" rel="noreferrer">
                          Open return label
                        </a>
                      </Button>
                    )}
                    <LabelledInput
                      label="Return email note"
                      value={returnLabel.notes ?? ""}
                      onChange={(value) => setReturnLabel((prev) => ({ ...prev, notes: value }))}
                      placeholder="Optional message to include in the email"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-primary flex items-center gap-2"><Printer className="h-4 w-4" /> 4x2 Order card</h3>
                  <div className="border rounded-lg p-4 bg-white text-sm" style={{ width: "256px", height: "128px" }}>
                    <div className="font-semibold text-primary">{selectedQuote.orderNumber}</div>
                    <div>{selectedQuote.workflow.shippingInfo.name}</div>
                    <div className="mt-1">
                      {selectedQuote.modelName} • {selectedQuote.storage}GB
                    </div>
                    <div>{selectedQuote.condition} • {selectedQuote.workflow.lockStatus}</div>
                    <div className="mt-2 text-primary font-bold">${selectedQuote.workflow.totalDue.toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground mt-2">Include this card with every shipping kit.</div>
                  </div>
                  <Button variant="outline" onClick={() => window.print()} className="mt-2 w-fit">
                    <Printer className="h-4 w-4 mr-2" /> Print order card
                  </Button>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-primary flex items-center gap-2"><Plus className="h-4 w-4" /> Media &amp; notes</h3>
                  <Textarea
                    value={adminNotes}
                    onChange={(event) => setAdminNotes(event.target.value)}
                    placeholder="Internal notes for this order"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={photoUrl}
                      onChange={(event) => setPhotoUrl(event.target.value)}
                      placeholder="https://example.com/device-photo.jpg"
                    />
                    <Button variant="outline" onClick={handleAddPhoto} disabled={!photoUrl}>
                      Add photo
                    </Button>
                  </div>
                  {selectedQuote.workflow.devicePhotos && selectedQuote.workflow.devicePhotos.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedQuote.workflow.devicePhotos.map((photo) => (
                        <a
                          key={photo}
                          href={photo}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs underline text-primary"
                        >
                          {photo}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-foreground">Live support control center</h2>
          <p className="text-muted-foreground">
            Monitor conversations, preview what customers are typing, and trigger ShipEngine actions without leaving the dashboard.
          </p>
        </div>
        <SupportConsole />
      </section>
    </div>
  );
}

function LabelledInput({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
  placeholder,
  description,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  readOnly?: boolean;
  placeholder?: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-muted-foreground block">{label}</label>
      <Input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        type={type}
        readOnly={readOnly}
        placeholder={placeholder}
        className={readOnly ? "bg-muted/60 cursor-text" : undefined}
      />
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}
