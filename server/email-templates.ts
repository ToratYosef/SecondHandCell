import { Quote, WorkflowLabel, ReminderStatus } from "@shared/schema";

function resolveCustomerName(quote: Quote) {
  return quote.customerName || quote.workflow.shippingInfo.name || "there";
}

function orderSummaryHtml(quote: Quote) {
  const storage = quote.storage >= 1000 ? `${quote.storage / 1000}TB` : `${quote.storage}GB`;
  return `
    <ul style="padding-left:16px; margin:16px 0; color:#1f2933;">
      <li><strong>Device:</strong> ${quote.modelName} (${storage})</li>
      <li><strong>Condition:</strong> ${quote.condition}</li>
      <li><strong>Carrier:</strong> ${quote.workflow.carrier}</li>
      <li><strong>Lock status:</strong> ${quote.workflow.lockStatus}</li>
      <li><strong>Quoted price:</strong> ${formatCurrency(quote.price)}</li>
      <li><strong>Order number:</strong> ${quote.orderNumber}</li>
    </ul>
  `;
}

function orderSummaryText(quote: Quote) {
  const storage = quote.storage >= 1000 ? `${quote.storage / 1000}TB` : `${quote.storage}GB`;
  return [
    `Device: ${quote.modelName} (${storage})`,
    `Condition: ${quote.condition}`,
    `Carrier: ${quote.workflow.carrier}`,
    `Lock status: ${quote.workflow.lockStatus}`,
    `Quoted price: ${formatCurrency(quote.price)}`,
    `Order number: ${quote.orderNumber}`,
  ].join("\n");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatLabelDetails(label?: WorkflowLabel) {
  if (!label) return { html: "", text: "" };
  const rows: string[] = [];
  const lines: string[] = [];
  if (label.trackingNumber) {
    rows.push(`<li><strong>Tracking:</strong> ${label.trackingNumber}</li>`);
    lines.push(`Tracking: ${label.trackingNumber}`);
  }
  if (label.url) {
    rows.push(`<li><strong>Label:</strong> <a href="${label.url}">Download PDF</a></li>`);
    lines.push(`Label: ${label.url}`);
  }
  if (label.notes) {
    rows.push(`<li><strong>Notes:</strong> ${label.notes}</li>`);
    lines.push(`Notes: ${label.notes}`);
  }
  return {
    html: rows.length ? `<ul style="padding-left:16px; margin:12px 0; color:#1f2933;">${rows.join("")}</ul>` : "",
    text: lines.length ? lines.join("\n") : "",
  };
}

export function buildEmailLabelMessage(quote: Quote, inboundLabel: WorkflowLabel, outboundLabel?: WorkflowLabel, extraNote?: string) {
  const name = resolveCustomerName(quote);
  const intro = extraNote
    ? `<p style="margin:0 0 12px 0;">${extraNote}</p>`
    : `<p style="margin:0 0 12px 0;">Your prepaid shipping label is ready. Please attach it securely to your package and drop it off within 7 days.</p>`;
  const instructions = quote.workflow.shippingMethod === "shipping-kit"
    ? `<p style="margin:12px 0;">We've also included your outbound kit label so you can print the envelope if you need another copy.</p>`
    : `<p style="margin:12px 0;">Print the attached label, place your device and any accessories securely in the box, and hand it to the carrier.</p>`;

  const inboundDetails = formatLabelDetails(inboundLabel);
  const outboundDetails = formatLabelDetails(outboundLabel);

  const html = `
    <div style="font-family:Inter,Arial,sans-serif; color:#111827;">
      <p>Hi ${name},</p>
      ${intro}
      ${instructions}
      <h3 style="margin:16px 0 8px 0;">Order summary</h3>
      ${orderSummaryHtml(quote)}
      <h3 style="margin:16px 0 8px 0;">Inbound label</h3>
      ${inboundDetails.html || "<p>Tracking details will appear once the carrier scans the package.</p>"}
      ${outboundDetails.html ? `<h3 style="margin:16px 0 8px 0;">Outbound kit label</h3>${outboundDetails.html}` : ""}
      <p style="margin:16px 0;">Need help? Reply to this email or chat with us on secondhandcell.com.</p>
      <p style="margin:16px 0;">— The SecondHandCell Team</p>
    </div>
  `;

  const text = [
    `Hi ${name},`,
    extraNote ? extraNote : `Your prepaid shipping label is ready. Please ship your device within 7 days.`,
    "",
    "Order summary:",
    orderSummaryText(quote),
    "",
    "Inbound label:",
    inboundDetails.text || "Tracking details will appear once the carrier scans the package.",
  ];

  if (outboundDetails.text) {
    text.push("", "Outbound kit label:", outboundDetails.text);
  }

  text.push("", "Need help? Reply to this email or chat with us on secondhandcell.com.", "— The SecondHandCell Team");

  return {
    subject: `Your SecondHandCell shipping label (${quote.orderNumber})`,
    html,
    text: text.join("\n"),
  };
}

export function buildReturnLabelMessage(quote: Quote, label: WorkflowLabel) {
  const name = resolveCustomerName(quote);
  const labelDetails = formatLabelDetails(label);
  const html = `
    <div style="font-family:Inter,Arial,sans-serif; color:#111827;">
      <p>Hi ${name},</p>
      <p>We've prepared a prepaid return label so we can get your device back to you quickly.</p>
      <p>Please expect the package to arrive soon. You can track the return using the information below.</p>
      <h3 style="margin:16px 0 8px 0;">Return tracking</h3>
      ${labelDetails.html}
      <h3 style="margin:16px 0 8px 0;">Order summary</h3>
      ${orderSummaryHtml(quote)}
      <p style="margin:16px 0;">If anything looks off, reply to this email and we'll help immediately.</p>
      <p style="margin:16px 0;">— The SecondHandCell Team</p>
    </div>
  `;

  const text = [
    `Hi ${name},`,
    "We've prepared a prepaid return label so we can send your device back right away.",
    "Track the shipment with the details below:",
    labelDetails.text,
    "",
    "Order summary:",
    orderSummaryText(quote),
    "",
    "Need help? Reply to this email and we'll take care of it.",
    "— The SecondHandCell Team",
  ].join("\n");

  return {
    subject: `Return initiated for order ${quote.orderNumber}`,
    html,
    text,
  };
}

export function buildTrustpilotEmail(quote: Quote) {
  const name = resolveCustomerName(quote);
  const html = `
    <div style="font-family:Inter,Arial,sans-serif; color:#111827;">
      <p>Hi ${name},</p>
      <p>Thanks again for selling your device to SecondHandCell! We'd love to hear how everything went.</p>
      <p><a href="https://www.trustpilot.com/evaluate/secondhandcell.com" style="color:#2563eb;">Leave a quick review on Trustpilot</a> — it only takes a minute and helps other customers feel confident.</p>
      <h3 style="margin:16px 0 8px 0;">Your order</h3>
      ${orderSummaryHtml(quote)}
      <p style="margin:16px 0;">If there's anything we can do better, just reply to this email.</p>
      <p style="margin:16px 0;">— The SecondHandCell Team</p>
    </div>
  `;

  const text = [
    `Hi ${name},`,
    "Thanks for selling your device to SecondHandCell! We'd love a quick Trustpilot review:",
    "https://www.trustpilot.com/evaluate/secondhandcell.com",
    "",
    "Order details:",
    orderSummaryText(quote),
    "",
    "Need help? Reply any time.",
    "— The SecondHandCell Team",
  ].join("\n");

  return {
    subject: `How did we do on order ${quote.orderNumber}?`,
    html,
    text,
  };
}

export function buildRequoteEmail(quote: Quote, amount: number) {
  const name = resolveCustomerName(quote);
  const payout = formatCurrency(amount);
  const html = `
    <div style="font-family:Inter,Arial,sans-serif; color:#111827;">
      <p>Hi ${name},</p>
      <p>We inspected your device and prepared an updated offer.</p>
      <p style="margin:12px 0; font-size:18px;"><strong>New payout:</strong> ${payout}</p>
      <p>Reply to this email to accept or ask questions. Once you approve, we'll release payment right away.</p>
      <h3 style="margin:16px 0 8px 0;">Order summary</h3>
      ${orderSummaryHtml(quote)}
      <p style="margin:16px 0;">If you'd prefer to have the device returned, let us know and we'll email a prepaid label.</p>
      <p style="margin:16px 0;">— The SecondHandCell Team</p>
    </div>
  `;

  const text = [
    `Hi ${name},`,
    "We've inspected your device and have a new offer ready.",
    `New payout: ${payout}`,
    "Reply to this email to accept or ask questions.",
    "",
    "Order details:",
    orderSummaryText(quote),
    "",
    "Prefer a return? Let us know and we'll send a prepaid label.",
    "— The SecondHandCell Team",
  ].join("\n");

  return {
    subject: `Updated offer for order ${quote.orderNumber}`,
    html,
    text,
  };
}

export function buildReminderEmail(quote: Quote, type: Exclude<ReminderStatus, "not_sent" | "canceled">) {
  const name = resolveCustomerName(quote);
  const isFifteen = type === "fifteen_day";
  const html = `
    <div style="font-family:Inter,Arial,sans-serif; color:#111827;">
      <p>Hi ${name},</p>
      <p>${isFifteen ? "It's been over two weeks since we sent your kit, and we still haven't received your device." : "Just a friendly reminder that we haven't seen a scan on your shipping label yet."}</p>
      <p>${isFifteen ? "If we don't see movement in the next 48 hours, we'll need to cancel the order and deactivate the label." : "Pop your device in the box and drop it off so we can keep your quote locked in."}</p>
      <h3 style="margin:16px 0 8px 0;">Order summary</h3>
      ${orderSummaryHtml(quote)}
      <p style="margin:16px 0;">Need another label or have questions? Reply and we'll help right away.</p>
      <p style="margin:16px 0;">— The SecondHandCell Team</p>
    </div>
  `;

  const text = [
    `Hi ${name},`,
    isFifteen
      ? "It's been over two weeks since we shipped your kit and we haven't received your device."
      : "Friendly reminder: we haven't seen a scan on your shipping label yet.",
    isFifteen
      ? "If we don't see movement in the next 48 hours, we'll need to cancel the order and deactivate the label."
      : "Please drop your package off soon to keep your quote locked in.",
    "",
    "Order details:",
    orderSummaryText(quote),
    "",
    "Need another label? Reply and we'll send one right away.",
    "— The SecondHandCell Team",
  ].join("\n");

  return {
    subject: `${isFifteen ? "Final reminder" : "Friendly reminder"} for order ${quote.orderNumber}`,
    html,
    text,
  };
}

export function buildCancellationEmail(quote: Quote) {
  const name = resolveCustomerName(quote);
  const html = `
    <div style="font-family:Inter,Arial,sans-serif; color:#111827;">
      <p>Hi ${name},</p>
      <p>We haven't received your device, so we've canceled order ${quote.orderNumber} and deactivated the prepaid label.</p>
      <p>If you'd still like to sell to us, you can start a fresh quote anytime at <a href="https://secondhandcell.com" style="color:#2563eb;">secondhandcell.com</a>.</p>
      <h3 style="margin:16px 0 8px 0;">Original quote</h3>
      ${orderSummaryHtml(quote)}
      <p style="margin:16px 0;">If you believe this was a mistake, reply and we'll reopen your order.</p>
      <p style="margin:16px 0;">— The SecondHandCell Team</p>
    </div>
  `;

  const text = [
    `Hi ${name},`,
    `We've canceled order ${quote.orderNumber} and deactivated the prepaid label.`,
    "Start a new quote anytime at https://secondhandcell.com.",
    "",
    "Original quote:",
    orderSummaryText(quote),
    "",
    "Need help? Reply and we'll take a look.",
    "— The SecondHandCell Team",
  ].join("\n");

  return {
    subject: `Order ${quote.orderNumber} has been canceled`,
    html,
    text,
  };
}
