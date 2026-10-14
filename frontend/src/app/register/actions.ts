"use server";

import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/auth";
import type { FormState } from "@/lib/types";

export async function registerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const full_name = String(formData.get("full_name") ?? "").trim() || null;

  if (!email || password.length < 8) {
    return { error: "Email және кемінде 8 таңбадан тұратын пароль қажет." };
  }

  try {
    await api.register({ email, password, full_name });
  } catch {
    return { error: "Бұл email тіркелген болуы мүмкін." };
  }

  let token: string;
  try {
    const result = await api.login({ email, password });
    token = result.access_token;
  } catch {
    return { error: "Тіркелу сәтті, бірақ кіру сәтсіз. Қайта кіріңіз." };
  }

  await setAuthToken(token);
  redirect("/assessments");
}