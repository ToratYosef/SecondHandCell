import { test, expect } from "@playwright/test";

test.describe("Sell flow", () => {
  test.fixme("implements full seller -> checkout flow once UI is wired", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /SecondHandCell/ })).toBeVisible();
    // TODO: Implement automated quote selection, checkout, and webhook simulation.
  });
});
