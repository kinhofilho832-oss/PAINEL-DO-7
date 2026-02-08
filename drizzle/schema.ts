import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Admin settings for site customization
 * Stores colors, button names, and other personalization options
 */
export const adminSettings = mysqlTable("adminSettings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  adminCode: varchar("adminCode", { length: 64 }).notNull(),
  primaryColor: varchar("primaryColor", { length: 7 }).default("#000000").notNull(),
  secondaryColor: varchar("secondaryColor", { length: 7 }).default("#FFFFFF").notNull(),
  accentColor: varchar("accentColor", { length: 7 }).default("#FF0000").notNull(),
  siteTitle: varchar("siteTitle", { length: 255 }).default("Painel Premium").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminSettings = typeof adminSettings.$inferSelect;
export type InsertAdminSettings = typeof adminSettings.$inferInsert;

/**
 * Custom buttons for the dashboard
 * Stores button names, labels, and their order
 */
export const customButtons = mysqlTable("customButtons", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  buttonName: varchar("buttonName", { length: 255 }).notNull(),
  buttonLabel: varchar("buttonLabel", { length: 255 }).notNull(),
  buttonIcon: varchar("buttonIcon", { length: 64 }).default("Square").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomButton = typeof customButtons.$inferSelect;
export type InsertCustomButton = typeof customButtons.$inferInsert;

/**
 * Balance and transaction history
 * Stores user balance and transaction records
 */
export const balanceHistory = mysqlTable("balanceHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: int("amount").notNull(),
  type: mysqlEnum("type", ["entrada", "saida"]).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  pixKey: varchar("pixKey", { length: 255 }),
  status: mysqlEnum("status", ["pendente", "concluido", "cancelado"]).default("concluido").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BalanceHistory = typeof balanceHistory.$inferSelect;
export type InsertBalanceHistory = typeof balanceHistory.$inferInsert;

/**
 * Current balance for each user
 * Stores the current balance amount
 */
export const userBalance = mysqlTable("userBalance", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  balance: int("balance").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserBalance = typeof userBalance.$inferSelect;
export type InsertUserBalance = typeof userBalance.$inferInsert;