import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createServiceClient } from '@/lib/supabase/service';
import { db } from '@/lib/db';
import { admins } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '@env/server';

export const runtime = 'nodejs';

interface ProvisionRequestBody {
  email: string;
  password: string;
  fullName?: string;
}

interface ProvisionResult {
  userId: string;
  isNewUser: boolean;
}

export async function POST(req: Request) {
  try {
    // 1. Authentication
    if (!verifyProvisionSecret(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await safeParseRequest(req);
    const validationError = validateRequestBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    const { email, password, fullName } = body;

    const svc = createServiceClient();

    const { userId, isNewUser } = await provisionAdmin(svc, {
      email: email!,
      password: password!,
      fullName: fullName ?? undefined,
    });

    return NextResponse.json({
      ok: true,
      userId,
      isNewUser,
    });
  } catch (e) {
    console.error('Provision error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function provisionAdmin(
  svc: SupabaseClient,
  params: { email: string; password: string; fullName?: string },
): Promise<ProvisionResult> {
  const { email, password, fullName } = params;

  // 1. Find or create auth user
  const [authRes, authErr] = await findOrCreateAuthUser(svc, {
    email,
    password,
    fullName,
  });

  if (authErr || !authRes) {
    throw authErr ?? new Error('Unknown error while creating/finding auth user');
  }

  const { userId, isNewUser } = authRes;

  // 2. Ensure admin record exists (with rollback on failure)
  try {
    await ensureAdminRecord(userId, email, fullName);
  } catch (error) {
    if (isNewUser) {
      await cleanupAuthUser(svc, userId);
    }
    throw error;
  }

  return { userId, isNewUser };
}

async function findOrCreateAuthUser(
  svc: SupabaseClient,
  params: { email: string; password: string; fullName?: string },
): Promise<[{ userId: string; isNewUser: boolean } | null, Error | null]> {
  const { email, password, fullName } = params;

  const { data, error } = await svc.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: fullName ? { fullName } : undefined,
    app_metadata: {
      role: 'admin',
      isAdmin: true,
    },
  });

  if (error?.code === 'user_already_exists') {
    const userId = await getUserIdByEmail(svc, email);
    if (!userId) {
      return [null, new Error('User exists but could not retrieve ID')];
    }

    return [{ userId, isNewUser: false }, null];
  }

  if (error) {
    console.error('createUser failed', {
      code: error.code,
      message: error.message,
    });
    return [null, new Error('Failed to create auth user')];
  }

  // Success - new user created
  const userId = data.user?.id;
  if (!userId) {
    return [null, new Error('User created but ID is missing')];
  }

  return [{ userId, isNewUser: true }, null];
}

async function getUserIdByEmail(svc: SupabaseClient, email: string): Promise<string | null> {
  const normalizedEmail = email.toLowerCase();
  let page = 1;
  const perPage = 100;

  while (page <= 10) {
    // Safety limit: max 1000 users
    const { data, error } = await svc.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error || !data) break;

    const found = data.users.find((u) => u.email?.toLowerCase() === normalizedEmail);
    if (found) return found.id;

    // No more pages
    if (data.users.length < perPage) break;
    page++;
  }

  return null;
}

/**
 * Ensures admin record exists in database.
 * Idempotent: does nothing if record already exists.
 */
async function ensureAdminRecord(userId: string, email: string, fullName?: string): Promise<void> {
  const existing = await db
    .select({ id: admins.id })
    .from(admins)
    .where(eq(admins.id, userId))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(admins).values({
      id: userId,
      email,
      name: fullName,
      isActive: true,
      role: 'admin',
    });
  }
}

async function cleanupAuthUser(svc: SupabaseClient, userId: string): Promise<void> {
  try {
    await svc.auth.admin.deleteUser(userId);
    console.info('Rolled back auth user creation', { userId });
  } catch (error) {
    console.error('Failed to cleanup auth user', { userId, error });
  }
}

/**
 * Verifies the provision secret header.
 * Returns false instead of throwing to prevent information leakage.
 */
function verifyProvisionSecret(req: Request): boolean {
  const secret = env.ADMIN_PROVISION_SECRET;
  const provided = req.headers.get('X-Admin-Provision-Secret');
  return provided === secret;
}

async function safeParseRequest(req: Request): Promise<Partial<ProvisionRequestBody>> {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

function validateRequestBody(body: Partial<ProvisionRequestBody>): string | null {
  const email = sanitizeEmail(body.email);
  if (!email) {
    return 'email is required and must be valid';
  }
  const password = body.password;
  if (!password) {
    return 'password is required';
  }

  return null;
}

function sanitizeEmail(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed || !trimmed.includes('@')) return null;
  return trimmed;
}

function generateRandomPassword(): string {
  // 16 bytes → 32 hex chars; acceptable as a temporary random password
  return crypto.randomBytes(16).toString('hex');
}
