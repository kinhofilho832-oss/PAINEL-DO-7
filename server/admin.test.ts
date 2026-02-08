import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `sample-user-${userId}`,
    email: `sample${userId}@example.com`,
    name: `Sample User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("admin settings", () => {
  it("returns default settings structure", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getSettings();

    expect(result).toHaveProperty('adminCode');
    expect(result).toHaveProperty('primaryColor');
    expect(result).toHaveProperty('secondaryColor');
    expect(result).toHaveProperty('accentColor');
    expect(result).toHaveProperty('siteTitle');
  });

  it("verifies admin code correctly", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.verifyAdminCode({ code: "WRONGCODE" });
    expect(result.success).toBe(false);
  });

  it("updates settings successfully", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.updateSettings({
      primaryColor: '#FF0000',
      siteTitle: 'My Custom Panel'
    });

    expect(result.success).toBe(true);
  });
});

describe("custom buttons", () => {
  it("returns list of buttons for user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await caller.auth.me();

    const buttons = await caller.buttons.list();

    expect(Array.isArray(buttons)).toBe(true);
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("updates button label successfully", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await caller.auth.me();

    const buttons = await caller.buttons.list();
    if (buttons.length > 0) {
      const result = await caller.buttons.update({
        buttonId: buttons[0].id,
        buttonLabel: 'Novo Rótulo'
      });

      expect(result.success).toBe(true);
    }
  });
});

describe("balance management", () => {
  it("returns balance as number", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await caller.auth.me();

    const balance = await caller.balance.getBalance();

    expect(typeof balance).toBe('number');
  });

  it("returns history as array", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await caller.auth.me();

    const history = await caller.balance.getHistory();

    expect(Array.isArray(history)).toBe(true);
  });

  it("adds transaction successfully", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await caller.auth.me();

    const balanceBefore = await caller.balance.getBalance();

    const result = await caller.balance.addTransaction({
      amount: 10000,
      type: 'entrada',
      description: 'Depósito de teste'
    });

    expect(result.success).toBe(true);

    const balanceAfter = await caller.balance.getBalance();
    expect(balanceAfter).toBeGreaterThan(balanceBefore);
  });
});
