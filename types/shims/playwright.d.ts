export interface PageFixture {
  goto(url: string): Promise<void>;
  getByRole(role: string, options?: Record<string, unknown>): {
    toBeVisible(): Promise<void>;
  };
}

export interface TestFixtures {
  page: PageFixture;
}

type TestFunction = (name: string, fn: (fixtures: TestFixtures) => Promise<void> | void) => void;

export interface TestApi extends TestFunction {
  describe(name: string, fn: () => void): void;
  fixme(name: string, fn: (fixtures: TestFixtures) => Promise<void>): void;
}

export const test: TestApi;
export const expect: (value: unknown) => {
  toBeVisible(): Promise<void>;
};
