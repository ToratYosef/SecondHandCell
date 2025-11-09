import nodemailer from 'nodemailer';

export interface MailPayload {
  to: string;
  subject: string;
  html: string;
}

export class MailAdapter {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST ?? 'localhost',
    port: Number(process.env.MAIL_PORT ?? 1025),
    secure: false,
    auth: process.env.MAIL_USER
      ? {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        }
      : undefined
  });

  async send(payload: MailPayload): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM ?? 'ops@secondhandcell.test',
      ...payload
    });
  }
}
