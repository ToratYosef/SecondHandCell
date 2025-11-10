export interface NextRequest extends Request {
  json(): Promise<any>;
}

export declare class NextResponse extends Response {
  static json(data: any, init?: ResponseInit): NextResponse;
}
