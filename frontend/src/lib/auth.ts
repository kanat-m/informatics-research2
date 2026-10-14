"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "auth_token";

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}