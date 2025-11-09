import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type SupportSession, type SupportSessionDetail } from "@shared/schema";
import {
  fetchSupportSessions,
  fetchSupportSession,
  sendSupportMessage,
  updateSupportTyping,
  markSupportMessagesRead,
  updateSupportSessionMeta,
} from "@/lib/support";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  CheckCircle2,
  Clock,
  Loader2,
  MessageCircle,
  PhoneCall,
  Send,
  Users,
  Zap,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

const STATUS_BADGES: Record<string, string> = {
  open: "bg-primary/10 text-primary border border-primary/30",
  waiting: "bg-secondary/10 text-secondary border border-secondary/30",
  closed: "bg-muted text-muted-foreground border border-border",
};

const QUICK_REPLIES = [
  "Thanks for sending your device! We'll confirm condition shortly and release payment.",
  "Your shipping kit includes outbound and inbound ShipEngine labels plus a 4x2 order card.",
  "We've triggered a fresh email label for you—please check your inbox in the next few minutes.",
  "Reminder: we do not accept blacklisted or finance-locked devices. Let us know if you have another IMEI.",
];

export function SupportConsole() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const sessionsQuery = useQuery({
    queryKey: ["support", "sessions"],
    queryFn: fetchSupportSessions,
    refetchInterval: 5000,
  });

  const detailQuery = useQuery<SupportSessionDetail | null>({
    queryKey: ["support", "session", selectedSessionId, "admin"],
    queryFn: () => fetchSupportSession(selectedSessionId!),
    enabled: Boolean(selectedSessionId),
    refetchInterval: 4000,
    retry: false,
  });

  const sessions = sessionsQuery.data ?? [];
  const sessionDetail = detailQuery.data;

  useEffect(() => {
    if (!selectedSessionId && sessions.length > 0) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId]);

  const stats = useMemo(() => {
    const total = sessions.length;
    const open = sessions.filter((session) => session.status === "open").length;
    const waiting = sessions.filter((session) => session.status === "waiting").length;
    const closed = sessions.filter((session) => session.status === "closed").length;
    return { total, open, waiting, closed };
  }, [sessions]);

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSessionId) return;
      const trimmed = draft.trim();
      if (!trimmed) return;
      await sendSupportMessage(selectedSessionId, { sender: "admin", content: trimmed });
    },
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["support", "session", selectedSessionId, "admin"] }).catch(() => undefined);
      queryClient.invalidateQueries({ queryKey: ["support", "sessions"] }).catch(() => undefined);
    },
    onError: (error: any) => {
      toast({
        title: "Unable to send message",
        description: error.message ?? "Check your connection and try again.",
        variant: "destructive",
      });
    },
  });

  const typingMutation = useMutation({
    mutationFn: async (preview: string) => {
      if (!selectedSessionId) return;
      await updateSupportTyping(selectedSessionId, { role: "admin", preview });
    },
  });

  useEffect(() => {
    if (!selectedSessionId) return;
    const handle = setTimeout(() => {
      typingMutation.mutate(draft);
    }, 300);
    return () => clearTimeout(handle);
  }, [draft, selectedSessionId]);

  const markReadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSessionId) return;
      await markSupportMessagesRead(selectedSessionId, "admin");
      await queryClient.invalidateQueries({ queryKey: ["support", "sessions"] });
    },
  });

  useEffect(() => {
    if (!selectedSessionId || !sessionDetail) return;
    markReadMutation.mutate();
  }, [sessionDetail?.messages.length, selectedSessionId]);

  useEffect(() => {
    if (!selectedSessionId) return;
    if (!detailQuery.isSuccess) return;
    if (sessionDetail !== null) return;

    toast({
      title: "Session ended",
      description: "The conversation is no longer available. We've selected the next one for you.",
    });

    const fallback = sessions.find((session) => session.id !== selectedSessionId) ?? null;
    if (fallback) {
      setSelectedSessionId(fallback.id);
      return;
    }

    setSelectedSessionId(null);
    setDraft("");
  }, [detailQuery.isSuccess, sessionDetail, selectedSessionId, sessions, toast]);

  const updateSessionMutation = useMutation({
    mutationFn: async (payload: { status?: SupportSession["status"]; priority?: SupportSession["priority"]; }) => {
      if (!selectedSessionId) return;
      await updateSupportSessionMeta(selectedSessionId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support", "sessions"] }).catch(() => undefined);
      queryClient.invalidateQueries({ queryKey: ["support", "session", selectedSessionId, "admin"] }).catch(() => undefined);
    },
  });

  const activeSession = useMemo(() => {
    if (!selectedSessionId) return undefined;
    return sessions.find((session) => session.id === selectedSessionId);
  }, [selectedSessionId, sessions]);

  const renderMessage = (message: SupportSessionDetail["messages"][number]) => {
    const isAdmin = message.sender === "admin";
    return (
      <div key={message.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
            isAdmin ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          <span className="mt-2 block text-[0.65rem] uppercase tracking-widest opacity-75">
            {format(new Date(message.createdAt), "MMM d, h:mm a")}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Live sessions</p>
              <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
            </div>
            <Users className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Open</p>
              <p className="text-2xl font-semibold text-primary">{stats.open}</p>
            </div>
            <Activity className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Waiting on customer</p>
              <p className="text-2xl font-semibold text-secondary">{stats.waiting}</p>
            </div>
            <Clock className="h-6 w-6 text-secondary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Closed today</p>
              <p className="text-2xl font-semibold text-muted-foreground">{stats.closed}</p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr]">
        <Card className="h-[560px]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              Inbox
              <Badge className="bg-primary/15 text-primary">{sessions.length} active</Badge>
            </CardTitle>
          </CardHeader>
          <Separator className="mx-6" />
          <CardContent className="pt-4">
            <ScrollArea className="h-[470px] pr-4">
              <div className="space-y-2">
                {sessions.length === 0 && (
                  <p className="text-sm text-muted-foreground">No support conversations yet.</p>
                )}
                {sessions.map((session) => {
                  const isActive = session.id === selectedSessionId;
                  return (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => setSelectedSessionId(session.id)}
                      className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                        isActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span>{session.customerEmail}</span>
                        <Badge className={STATUS_BADGES[session.status] ?? "bg-muted text-muted-foreground"}>
                          {session.status}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Updated {formatDistanceToNow(new Date(session.lastUpdatedAt), { addSuffix: true })}
                      </div>
                      {session.lastMessagePreview && (
                        <div className="mt-2 line-clamp-2 text-xs text-muted-foreground">{session.lastMessagePreview}</div>
                      )}
                      {session.priority === "urgent" && (
                        <span className="mt-2 inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                          Urgent
                        </span>
                      )}
                      {session.unreadForAdmin > 0 && (
                        <span className="mt-2 inline-flex items-center rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
                          {session.unreadForAdmin} unread
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {sessionDetail && activeSession ? (
            <>
              <Card className="border-primary/30">
                <CardHeader className="pb-2">
                  <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                    <span className="font-semibold text-foreground">{activeSession.customerEmail}</span>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Select
                        value={activeSession.status}
                        onValueChange={(value: SupportSession["status"]) => updateSessionMutation.mutate({ status: value })}
                      >
                        <SelectTrigger className="h-8 w-28 text-xs">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="waiting">Waiting</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={activeSession.priority}
                        onValueChange={(value: SupportSession["priority"]) => updateSessionMutation.mutate({ priority: value })}
                      >
                        <SelectTrigger className="h-8 w-28 text-xs">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardTitle>
                </CardHeader>
                <Separator className="mx-6" />
                <CardContent className="pt-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      Joined {format(new Date(activeSession.createdAt), "MMM d, yyyy • h:mm a")}
                    </span>
                    {sessionDetail.session.customerTypingPreview && (
                      <span className="flex items-center gap-1 text-primary">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Customer typing: {sessionDetail.session.customerTypingPreview}
                      </span>
                    )}
                    {sessionDetail.orders.length > 0 && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MessageCircle className="h-3 w-3" /> {sessionDetail.orders.length} related orders
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-muted">
                <CardContent className="pt-6">
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                      {sessionDetail.messages.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No messages yet. Send a welcome message and confirm their device details.
                        </p>
                      )}
                      {sessionDetail.messages.map((message) => renderMessage(message))}
                    </div>
                  </ScrollArea>
                  <div className="mt-4 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {QUICK_REPLIES.map((reply) => (
                        <Button
                          key={reply}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setDraft((prev) => (prev ? `${prev}\n\n${reply}` : reply))}
                        >
                          <Zap className="mr-1 h-3 w-3" />
                          {reply.slice(0, 28)}…
                        </Button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Reply to the customer…"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      rows={3}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <PhoneCall className="h-4 w-4" />
                        Offer to schedule a call once inspection is complete.
                      </div>
                      <Button
                        size="lg"
                        onClick={() => sendMutation.mutate()}
                        disabled={!draft.trim() || sendMutation.isPending}
                      >
                        {sendMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" /> Send reply
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-muted/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Order timeline</CardTitle>
                </CardHeader>
                <Separator className="mx-6" />
                <CardContent className="pt-4">
                  {sessionDetail.orders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No linked orders yet.</p>
                  ) : (
                    <div className="space-y-3 text-sm">
                      {sessionDetail.orders.map((order) => (
                        <div key={order.id} className="rounded-lg border border-border/60 p-3">
                          <div className="flex items-center justify-between text-sm font-semibold">
                            <span>{order.orderNumber}</span>
                            <span>${order.workflow.totalDue.toLocaleString()}</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {order.modelName} • {order.storage}GB • {order.condition} • {order.workflow.carrier}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {order.workflow.statusHistory[order.workflow.statusHistory.length - 1]?.status ?? order.status} •
                            Updated {format(new Date(order.createdAt), "MMM d, yyyy")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-[560px]">
              <CardContent className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <MessageCircle className="h-10 w-10 text-muted-foreground" />
                <p>Select a session to view the conversation and respond in real time.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
