import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getDb, hasDatabase } from "./db";
import { adminUsers } from "./db/schema";
import { eq } from "drizzle-orm";

const DEV_ADMIN = {
  email: "avers.freelance@gmail.com",
  password: "Pinterg123!",
  id: 0,
  name: "Salon Admin",
} as const;

const COOKIE_NAME = "salon_admin_token";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production"
);

export type AdminSession = {
  id: number;
  email: string;
  name: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(admin: AdminSession) {
  const token = await new SignJWT({
    id: admin.id,
    email: admin.email,
    name: admin.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as number,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function loginAdmin(email: string, password: string) {
  if (
    process.env.NODE_ENV !== "production" &&
    !hasDatabase() &&
    email === DEV_ADMIN.email &&
    password === DEV_ADMIN.password
  ) {
    const session: AdminSession = {
      id: DEV_ADMIN.id,
      email: DEV_ADMIN.email,
      name: DEV_ADMIN.name,
    };
    await createSession(session);
    return session;
  }

  const db = getDb();
  if (!db) return null;

  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  if (!admin) return null;

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) return null;

  const session: AdminSession = {
    id: admin.id,
    email: admin.email,
    name: admin.name,
  };

  await createSession(session);
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
