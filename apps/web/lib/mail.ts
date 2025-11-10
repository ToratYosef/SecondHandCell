import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const SMTP_SECURE = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : undefined;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;

type MailTransporter = ReturnType<typeof nodemailer.createTransport>;
let transporter: MailTransporter | null = null;

function getTransporter() {
  if (!transporter) {
    if (!SMTP_HOST || !SMTP_PORT || EMAIL_FROM === undefined) {
      throw new Error("Missing SMTP configuration. Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, EMAIL_USER, EMAIL_PASS, and EMAIL_FROM env vars.");
    }

    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE ?? SMTP_PORT === 465,
      pool: true,
      auth: EMAIL_USER
        ? {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
          }
        : undefined,
    });
  }

  return transporter;
}

export type SendEmailParams = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
};

export async function sendEmail(params: SendEmailParams) {
  const { to, subject, html, text, from } = params;

  try {
    const mailer = getTransporter();
    const result = await mailer.sendMail({
      to,
      subject,
      html,
      text,
      from: from || EMAIL_FROM,
    });

    return { ok: true as const, result };
  } catch (error) {
    console.error("Failed to send email", error);
    return { ok: false as const, error };
  }
}

export async function sendOrderReceipt(orderId: string, email: string) {
  // TODO: Replace template with production-ready receipt content.
  return sendEmail({
    to: email,
    subject: `Your SecondHandCell order ${orderId}`,
    text: `Thanks for your order ${orderId}. We'll notify you when it ships!`,
  });
}

export async function sendClaimCode(email: string, claimCode: string) {
  // TODO: Harden claim code distribution (rate limits, templating, etc.).
  return sendEmail({
    to: email,
    subject: "Your claim code",
    text: `Use this claim code to access your order: ${claimCode}`,
  });
}
