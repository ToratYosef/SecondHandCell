import { notificationsAdapter } from '@/integrations/notificationsAdapter';
import { MailAdapter } from '@/integrations/mailAdapter';

const mail = new MailAdapter();

export async function notifyOrderSubmission(orderNumber: string, recipient: string) {
  await mail.send({
    to: recipient,
    subject: `We received your device order ${orderNumber}`,
    html: `<p>Thank you! Your order ${orderNumber} is on its way.</p>`
  });
}

export async function notifyAdmins(message: string, context: Record<string, string>) {
  await notificationsAdapter().sendToAdmins({
    title: message,
    body: JSON.stringify(context)
  });
}
