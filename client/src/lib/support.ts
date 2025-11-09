import {
  type InsertSupportSession,
  type InsertSupportMessage,
  type SupportSessionDetail,
  type SupportSession,
  type SupportTypingUpdate,
  type SupportRole,
  type UpdateSupportSession,
} from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function createSupportSession(
  payload: InsertSupportSession,
): Promise<SupportSessionDetail> {
  const res = await apiRequest("POST", "/api/support/sessions", payload);
  return await res.json();
}

export async function fetchSupportSessions(): Promise<SupportSession[]> {
  const res = await apiRequest("GET", "/api/support/sessions");
  return await res.json();
}

export async function fetchSupportSession(
  sessionId: string,
): Promise<SupportSessionDetail> {
  const res = await apiRequest("GET", `/api/support/sessions/${sessionId}`);
  return await res.json();
}

export async function sendSupportMessage(
  sessionId: string,
  payload: InsertSupportMessage,
): Promise<SupportSessionDetail> {
  const res = await apiRequest("POST", `/api/support/sessions/${sessionId}/messages`, payload);
  return await res.json();
}

export async function updateSupportTyping(
  sessionId: string,
  payload: SupportTypingUpdate,
): Promise<SupportSession> {
  const res = await apiRequest("PATCH", `/api/support/sessions/${sessionId}/typing`, payload);
  return await res.json();
}

export async function markSupportMessagesRead(
  sessionId: string,
  role: SupportRole,
): Promise<SupportSession> {
  const res = await apiRequest("POST", `/api/support/sessions/${sessionId}/read`, { role });
  return await res.json();
}

export async function updateSupportSessionMeta(
  sessionId: string,
  payload: UpdateSupportSession,
): Promise<SupportSessionDetail> {
  const res = await apiRequest("PATCH", `/api/support/sessions/${sessionId}`, payload);
  return await res.json();
}
