import { expect, test } from "@playwright/test";

test("health endpoint", async ({ request }) => {
  const response = await request.get("/health");

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.status).toBe("ok");
});
