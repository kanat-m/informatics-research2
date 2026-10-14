"use server";

import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { clearAuthToken, setAuthToken } from "@/lib/auth";
import type { FormState } from "@/lib/types";

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email мен парольді толтырыңыз." };
  }

  let token: string;
  try {
    const result = await api.login({ email, password });
    token = result.access_token;
  } catch {
    return { error: "Email немесе пароль дұрыс емес." };
  }

  await setAuthToken(token);
  redirect("/assessments");
}

export async function logoutAction() {
  await clearAuthToken();
  redirect("/assessments");
}