import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, adminSettings, AdminSettings, balanceHistory, customButtons, CustomButton, userBalance, InsertBalanceHistory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAdminSettings(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(adminSettings)
    .where(eq(adminSettings.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateAdminSettings(
  userId: number,
  updates: Partial<Omit<AdminSettings, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .update(adminSettings)
    .set(updates)
    .where(eq(adminSettings.userId, userId));
  return result;
}

export async function getCustomButtons(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(customButtons)
    .where(eq(customButtons.userId, userId))
    .orderBy(customButtons.displayOrder);
}

export async function updateCustomButton(
  buttonId: number,
  updates: Partial<Omit<CustomButton, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
) {
  const db = await getDb();
  if (!db) return undefined;
  return await db
    .update(customButtons)
    .set(updates)
    .where(eq(customButtons.id, buttonId));
}

export async function getUserBalance(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(userBalance)
    .where(eq(userBalance.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBalanceHistory(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(balanceHistory)
    .where(eq(balanceHistory.userId, userId))
    .orderBy(desc(balanceHistory.createdAt))
    .limit(limit);
}

export async function addBalanceTransaction(
  userId: number,
  transaction: Omit<InsertBalanceHistory, 'userId'>
) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.insert(balanceHistory).values({
    ...transaction,
    userId,
  });
  
  // Update user balance
  const currentBalance = await getUserBalance(userId);
  const newBalance = currentBalance
    ? currentBalance.balance + (transaction.type === 'entrada' ? transaction.amount : -transaction.amount)
    : (transaction.type === 'entrada' ? transaction.amount : -transaction.amount);
  
  if (currentBalance) {
    await db.update(userBalance).set({ balance: newBalance }).where(eq(userBalance.userId, userId));
  } else {
    await db.insert(userBalance).values({ userId, balance: newBalance });
  }
  
  return result;
}

export async function initializeUserData(userId: number, adminCode: string) {
  const db = await getDb();
  if (!db) return;
  
  // Create admin settings
  await db.insert(adminSettings).values({
    userId,
    adminCode,
  }).onDuplicateKeyUpdate({ set: { adminCode } });
  
  // Create user balance
  await db.insert(userBalance).values({ userId, balance: 0 }).onDuplicateKeyUpdate({ set: { balance: 0 } });
  
  // Create default buttons
  const defaultButtons = [
    { buttonName: 'transferencia', buttonLabel: 'Transferência', displayOrder: 1 },
    { buttonName: 'deposito', buttonLabel: 'Depósito', displayOrder: 2 },
    { buttonName: 'saque', buttonLabel: 'Saque', displayOrder: 3 },
  ];
  
  for (const btn of defaultButtons) {
    await db.insert(customButtons).values({
      userId,
      ...btn,
    });
  }
}
