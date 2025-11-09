import tls from "tls";
import { env, requireEnv } from "./env";

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface SmtpResponse {
  code: number;
  message: string;
}

function buildMimeMessage(options: MailOptions, fromAddress: string) {
  const boundary = `----=_SHC_${Date.now().toString(36)}`;
  const headers = [
    `From: SecondHandCell <${fromAddress}>`,
    `To: ${options.to}`,
    `Subject: ${options.subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary=\"${boundary}\"`,
  ].join("\r\n");

  const plain = `--${boundary}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${options.text}\r\n`;
  const html = `--${boundary}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${options.html}\r\n`;
  const closing = `--${boundary}--`;

  return `${headers}\r\n\r\n${plain}${html}${closing}\r\n`;
}

function waitForResponse(socket: tls.TLSSocket): Promise<SmtpResponse> {
  return new Promise((resolve, reject) => {
    const chunks: string[] = [];

    const onData = (data: Buffer | string) => {
      const text = data.toString();
      chunks.push(text);
      if (!text.endsWith("\r\n")) {
        return;
      }
      cleanup();
      const message = chunks.join("");
      const code = Number.parseInt(message.slice(0, 3), 10);
      if (!Number.isFinite(code)) {
        return reject(new Error(`Unexpected SMTP response: ${message.trim()}`));
      }
      resolve({ code, message });
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const onClose = () => {
      cleanup();
      reject(new Error("SMTP connection closed"));
    };

    const cleanup = () => {
      socket.removeListener("data", onData);
      socket.removeListener("error", onError);
      socket.removeListener("close", onClose);
    };

    socket.on("data", onData);
    socket.once("error", onError);
    socket.once("close", onClose);
  });
}

async function sendCommand(socket: tls.TLSSocket, command?: string) {
  if (command !== undefined) {
    socket.write(`${command}\r\n`);
  }
  const response = await waitForResponse(socket);
  if (response.code >= 400) {
    throw new Error(`SMTP command failed (${response.code}): ${response.message.trim()}`);
  }
  return response;
}

function encodeBase64(value: string) {
  return Buffer.from(value, "utf-8").toString("base64");
}

export async function sendMail(options: MailOptions) {
  const user = requireEnv("EMAIL_USER");
  const pass = requireEnv("EMAIL_PASS");

  const socket = tls.connect({
    host: "smtp.gmail.com",
    port: 465,
    rejectUnauthorized: false,
  });

  socket.setEncoding("utf8");

  try {
    await sendCommand(socket);
    await sendCommand(socket, `EHLO secondhandcell.com`);
    await sendCommand(socket, "AUTH LOGIN");
    await sendCommand(socket, encodeBase64(user));
    await sendCommand(socket, encodeBase64(pass));
    await sendCommand(socket, `MAIL FROM:<${user}>`);
    await sendCommand(socket, `RCPT TO:<${options.to}>`);
    await sendCommand(socket, "DATA");

    const message = buildMimeMessage(options, user);
    socket.write(`${message}\r\n.\r\n`);
    await sendCommand(socket);
    await sendCommand(socket, "QUIT");
  } finally {
    socket.end();
  }
}

export function isEmailConfigured(): boolean {
  return Boolean(env.EMAIL_USER && env.EMAIL_PASS);
}
