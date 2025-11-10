export interface CookieValue {
  value: string;
}

export interface CookiesStore {
  get(name: string): CookieValue | undefined;
}

export declare function cookies(): CookiesStore;
