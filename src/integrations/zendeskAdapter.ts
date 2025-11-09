export interface ZendeskTicketPayload {
  subject: string;
  body: string;
  requesterEmail: string;
}

export class ZendeskAdapter {
  async createTicket(payload: ZendeskTicketPayload): Promise<void> {
    console.info('Zendesk ticket stub', payload);
  }
}
