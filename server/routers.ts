import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getAdminSettings, updateAdminSettings, getCustomButtons, updateCustomButton, getUserBalance, getBalanceHistory, addBalanceTransaction, initializeUserData } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(async (opts) => {
      if (opts.ctx.user) {
        const adminCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        await initializeUserData(opts.ctx.user.id, adminCode);
      }
      return opts.ctx.user;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  admin: router({
    getSettings: protectedProcedure.query(async ({ ctx }) => {
      const settings = await getAdminSettings(ctx.user.id);
      return settings || { adminCode: '', primaryColor: '#000000', secondaryColor: '#FFFFFF', accentColor: '#FF0000', siteTitle: 'Painel Premium' };
    }),
    verifyAdminCode: protectedProcedure.input(z.object({ code: z.string() })).mutation(async ({ ctx, input }) => {
      const settings = await getAdminSettings(ctx.user.id);
      if (!settings) return { success: false, message: 'Admin settings not found' };
      return { success: settings.adminCode === input.code };
    }),
    updateSettings: protectedProcedure
      .input(z.object({
        adminCode: z.string().optional(),
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        accentColor: z.string().optional(),
        siteTitle: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateAdminSettings(ctx.user.id, input);
        return { success: true };
      }),
  }),
  buttons: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getCustomButtons(ctx.user.id);
    }),
    update: protectedProcedure
      .input(z.object({
        buttonId: z.number(),
        buttonLabel: z.string().optional(),
        buttonName: z.string().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { buttonId, ...updates } = input;
        await updateCustomButton(buttonId, updates);
        return { success: true };
      }),
  }),
  balance: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const balance = await getUserBalance(ctx.user.id);
      return balance?.balance || 0;
    }),
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return await getBalanceHistory(ctx.user.id);
    }),
    addTransaction: protectedProcedure
      .input(z.object({
        amount: z.number(),
        type: z.enum(['entrada', 'saida']),
        description: z.string(),
        pixKey: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await addBalanceTransaction(ctx.user.id, input);
        return { success: true };
      }),
  })
});

export type AppRouter = typeof appRouter;
