export interface AuthOptions {
  user?: string;
  pass?: string;
}

export interface TransportOptions {
  host?: string;
  port?: number;
  secure?: boolean;
  pool?: boolean;
  auth?: AuthOptions;
}

export interface SentMessageInfo {
  messageId?: string;
  [key: string]: unknown;
}

export interface Transporter {
  sendMail(options: Record<string, unknown>): Promise<SentMessageInfo>;
}

export function createTransport(options: TransportOptions): Transporter;

declare const nodemailer: {
  createTransport: typeof createTransport;
};

export default nodemailer;
