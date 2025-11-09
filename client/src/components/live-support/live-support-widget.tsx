import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type SupportSessionDetail,
  type Quote,
} from "@shared/schema";
import {
  createSupportSession,
  fetchSupportSession,
  sendSupportMessage,
  updateSupportTyping,
  markSupportMessagesRead,
} from "@/lib/support";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowUpRight,
  Headset,
  Loader2,
  Mail,
  MessageCircle,
  PhoneCall,
  Send,
  History,
} from "lucide-react";
import { format } from "date-fns";

const SESSION_STORAGE_KEY = "shc-support-session-id";

interface SessionFormState {
  name: string;
  email: string;
  phone: string;
  orderNumber: string;
}

export function LiveSupportWidget() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [form, setForm] = useState<SessionFormState>({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      setSessionId(stored);
    }
  }, []);

  const detailQuery = useQuery<SupportSessionDetail>({
    queryKey: ["support", "session", sessionId],
    queryFn: () => fetchSupportSession(sessionId!),
    enabled: Boolean(sessionId),
    refetchInterval: isOpen ? 4000 : 15000,
  });

  const sessionDetail = detailQuery.data;
  const session = sessionDetail?.session;
  const messages = useMemo(() => {
    if (!sessionDetail) return [];
    return [...sessionDetail.messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [sessionDetail]);

  const markReadMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) return;
      await markSupportMessagesRead(sessionId, "customer");
      await queryClient.invalidateQueries({ queryKey: ["support", "session", sessionId] });
    },
  });

  useEffect(() => {
    if (!sessionId || !sessionDetail || !isOpen) return;
    markReadMutation.mutate();
  }, [sessionDetail?.messages.length, sessionId, isOpen]);

  useEffect(() => {
    if (!sessionDetail) return;
    if (!selectedOrderId && sessionDetail.orders.length > 0) {
      setSelectedOrderId(sessionDetail.orders[0].id);
    }
  }, [sessionDetail, selectedOrderId]);

  const createMutation = useMutation({
    mutationFn: createSupportSession,
    onSuccess: (detail) => {
      setSessionId(detail.session.id);
    },
  });

  useEffect(() => {
    if (!sessionId || typeof window === "undefined") return;
    window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }, [sessionId]);

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) return;
      const trimmed = draft.trim();
      if (!trimmed) return;
      await sendSupportMessage(sessionId, { sender: "customer", content: trimmed });
    },
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["support", "session", sessionId] }).catch(() => undefined);
    },
    onError: (error: any) => {
      toast({
        title: "Message failed",
        description: error.message ?? "We couldn't send your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const typingMutation = useMutation({
    mutationFn: async (preview: string) => {
      if (!sessionId) return;
      await updateSupportTyping(sessionId, { role: "customer", preview });
    },
  });

  useEffect(() => {
    if (!sessionId) return;
    const handle = setTimeout(() => {
      typingMutation.mutate(draft);
    }, 350);
    return () => clearTimeout(handle);
  }, [draft, sessionId]);

  const handleStartSession = async () => {
    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) {
      toast({
        title: "Missing email",
        description: "Add an email address so we can keep the conversation going.",
        variant: "destructive",
      });
      return;
    }

    try {
      const detail = await createMutation.mutateAsync({
        customerName: form.name.trim() || undefined,
        customerEmail: trimmedEmail,
        customerPhone: form.phone.trim() || undefined,
        orderNumber: form.orderNumber.trim() || undefined,
      });
      setSessionId(detail.session.id);
      setForm({ name: "", email: trimmedEmail, phone: "", orderNumber: "" });
      setIsOpen(true);
      toast({
        title: "Support chat ready",
        description: "An agent will join shortly. Feel free to share device photos or order numbers.",
      });
    } catch (error: any) {
      toast({
        title: "Unable to start support",
        description: error.message ?? "Please verify your details and try again.",
        variant: "destructive",
      });
    }
  };

  const unreadCount = session?.unreadForCustomer ?? 0;
  const isLoading = createMutation.isPending || detailQuery.isLoading;

  const activeOrder = useMemo(() => {
    if (!sessionDetail) return undefined;
    return sessionDetail.orders.find((order) => order.id === selectedOrderId);
  }, [sessionDetail, selectedOrderId]);

  const renderMessage = (message: SupportSessionDetail["messages"][number]) => {
    const isCustomer = message.sender === "customer";
    return (
      <div key={message.id} className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
            isCustomer
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          <span className="mt-2 block text-[0.65rem] uppercase tracking-wide opacity-70">
            {format(new Date(message.createdAt), "MMM d, h:mm a")}
          </span>
        </div>
      </div>
    );
  };

  const renderOrder = (order: Quote) => {
    const isActive = order.id === selectedOrderId;
    return (
      <button
        key={order.id}
        type="button"
        onClick={() => setSelectedOrderId(order.id)}
        className={`w-full rounded-lg border px-3 py-2 text-left transition ${
          isActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
        }`}
      >
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>{order.orderNumber}</span>
          <ArrowUpRight className="h-4 w-4" />
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {format(new Date(order.createdAt), "MMM d, yyyy")} • {order.modelName}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {order.storage}GB • {order.condition} • {order.workflow.carrier}
        </div>
      </button>
    );
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 sm:bottom-8 sm:right-8">
        <Badge className="bg-primary/20 text-primary hidden sm:inline-flex items-center gap-1 px-3 py-1">
          <Headset className="h-3.5 w-3.5" />
          Live Support
        </Badge>
        <Button
          size="lg"
          className="shadow-lg px-6 py-6 text-base font-semibold"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Chat with us
          {unreadCount > 0 && (
            <span className="ml-2 rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="space-y-2">
            <SheetTitle className="flex items-center gap-2 text-2xl">
              <Headset className="h-6 w-6 text-primary" />
              SecondHandCell Live Support
            </SheetTitle>
            <SheetDescription>
              Our specialists can review your orders, ShipEngine labels, and payouts in real time. We never accept blacklisted
              phones.
            </SheetDescription>
          </SheetHeader>

          {!sessionId && (
            <div className="mt-8 space-y-6">
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle>Start a new conversation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    Share the email you used for your quote so we can surface your past orders instantly.
                  </p>
                  <div className="grid gap-4">
                    <label className="space-y-1">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</span>
                      <Input
                        value={form.name}
                        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder="Your name"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</span>
                      <Input
                        required
                        type="email"
                        value={form.email}
                        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                        placeholder="you@example.com"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone (optional)</span>
                      <Input
                        value={form.phone}
                        onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                        placeholder="(555) 555-5555"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Order number (optional)</span>
                      <Input
                        value={form.orderNumber}
                        onChange={(event) => setForm((prev) => ({ ...prev, orderNumber: event.target.value }))}
                        placeholder="SHC-12345"
                      />
                    </label>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleStartSession} disabled={createMutation.isPending}>
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting chat…
                      </>
                    ) : (
                      <>
                        <Headset className="mr-2 h-4 w-4" /> Connect me with support
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-muted/40 border-muted/60">
                <CardContent className="flex items-center gap-3 text-sm text-muted-foreground py-4">
                  <History className="h-5 w-5" />
                  We’ll automatically surface all quotes tied to your email so you can ask about specific orders instantly.
                </CardContent>
              </Card>
            </div>
          )}

          {sessionId && session && (
            <div className="mt-6 flex h-full flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                <Badge className="bg-primary/15 text-primary">{session.status}</Badge>
                <span>Joined {format(new Date(session.createdAt), "MMM d, yyyy")}</span>
                {session.adminTypingPreview && (
                  <span className="flex items-center gap-1 text-primary">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Admin typing: {session.adminTypingPreview}
                  </span>
                )}
              </div>

              <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                <Card className="h-[420px] lg:h-[480px]">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageCircle className="h-5 w-5 text-primary" /> Conversation
                    </CardTitle>
                  </CardHeader>
                  <Separator className="mx-6" />
                  <CardContent className="h-full pt-4">
                    <ScrollArea className="h-[320px] pr-4">
                      <div className="space-y-3">
                        {messages.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            Share more about your device or shipping preference and we’ll respond right away.
                          </p>
                        )}
                        {messages.map((message) => renderMessage(message))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card className="h-[420px] lg:h-[480px]">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Mail className="h-5 w-5 text-primary" /> Your orders
                    </CardTitle>
                  </CardHeader>
                  <Separator className="mx-6" />
                  <CardContent className="space-y-3 pt-4 text-sm">
                    {sessionDetail?.orders.length ? (
                      <div className="space-y-3">
                        <ScrollArea className="h-[260px] pr-2">
                          <div className="space-y-2">
                            {sessionDetail.orders.map((order) => renderOrder(order))}
                          </div>
                        </ScrollArea>
                        {activeOrder && (
                          <div className="rounded-lg bg-muted/30 p-3 text-xs leading-relaxed">
                            <div className="font-semibold text-foreground">{activeOrder.modelName}</div>
                            <div className="text-muted-foreground">
                              {activeOrder.storage}GB • {activeOrder.condition} • {activeOrder.workflow.lockStatus.toUpperCase()}
                            </div>
                            <div className="mt-1 text-muted-foreground">
                              Preferred shipping: {activeOrder.workflow.shippingMethod === "shipping-kit" ? "Shipping kit ($10)" : "Email label"}
                            </div>
                            <div className="mt-1 text-foreground font-semibold">
                              Quote total: ${activeOrder.workflow.totalDue.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No orders yet. Ask us to help you build your first quote—remember, we do not accept blacklisted phones.
                      </p>
                    )}
                    <div className="rounded-lg border border-dashed border-muted/60 p-3 text-xs text-muted-foreground">
                      Need labels or a shipping kit? Mention it in chat and we’ll trigger ShipEngine emails or $10 kits instantly.
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <Textarea
                  placeholder="Type your message here…"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={3}
                />
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4" />
                    Prefer a call? Include your best phone number and a time.
                  </div>
                  <Button
                    size="lg"
                    onClick={() => sendMutation.mutate()}
                    disabled={!draft.trim() || sendMutation.isPending || isLoading}
                  >
                    {sendMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send message
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
