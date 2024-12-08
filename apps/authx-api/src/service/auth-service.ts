import { StatusCodes } from 'http-status-codes';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { error } from 'elysia';
import { db } from '../database';
import { users } from '../database/models/user-model';
import { sessions } from '../database/models/session-model';
import bcrypt from 'bcrypt';

export async function signup(email: string, password: string, jwt: any, refreshJwt: any) {
  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existingUser) {
    throw error(StatusCodes.BAD_REQUEST, 'User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = (
    await db.insert(users).values({ email, passwordhash: hashedPassword }).returning()
  )[0];

  // Create or update session
  const session = await db
    .insert(sessions)
    .values({ userId: newUser.id, tokenversion: randomUUID() })
    .onConflictDoUpdate({
      target: sessions.userId,
      set: {
        tokenversion: randomUUID(),
      },
    })
    .returning();

  const refresh_token = await refreshJwt.sign({
    session_id: session[0].id,
    tokenVersion: session[0].tokenversion,
  });

  const access_token = await jwt.sign({ user_id: newUser.id });

  return {
    access_token,
    refresh_token,
    user: newUser,
  };
}

export async function login(email: string, password: string, jwt: any, refreshJwt: any) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) {
    throw error(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const isValid = await bcrypt.compare(password, user.passwordhash);
  if (!isValid) {
    throw error(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const session = await db
    .insert(sessions)
    .values({ userId: user.id, tokenversion: randomUUID() })
    .onConflictDoUpdate({
      target: sessions.userId,
      set: {
        tokenversion: randomUUID(),
      },
    })
    .returning();

  const refresh_token = await refreshJwt.sign({
    session_id: session[0].id,
    tokenVersion: session[0].tokenversion,
  });

  const access_token = await jwt.sign({ user_id: user.id });

  return {
    access_token,
    refresh_token,
    user,
  };
}

export async function refreshAccessToken(refresh_token: string, jwt: any, refreshJwt: any) {
  let decoded = null;
  try {
    decoded = await refreshJwt.verify(refresh_token);
  } catch (e) {
    throw error(StatusCodes.UNAUTHORIZED, 'Invalid Token');
  }
  if (!decoded) throw error(StatusCodes.UNAUTHORIZED, 'Invalid Token');

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, decoded.session_id),
  });
  if (!session || session.tokenversion !== decoded.tokenVersion)
    throw error(StatusCodes.UNAUTHORIZED, 'Invalid Token');

  const access_token = await jwt.sign({ user_id: session.userId });
  return access_token;
}

export async function logout(refresh_token: string, jwt: any, refreshJwt: any) {
  let decoded = null;
  try {
    decoded = await refreshJwt.verify(refresh_token);
  } catch (e) {
    throw error(StatusCodes.UNAUTHORIZED, 'Invalid Token');
  }
  if (!decoded) throw error(StatusCodes.UNAUTHORIZED, 'Invalid Token');

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, decoded.session_id),
  });
  if (!session || session.tokenversion !== decoded.tokenVersion)
    throw error(StatusCodes.UNAUTHORIZED, 'Invalid Token');
  
  await db.delete(sessions).where(eq(sessions.id, decoded.session_id));
}