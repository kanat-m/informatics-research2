"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import type { AssessmentInput, FormState } from "@/lib/types";

function parseForm(formData: FormData): AssessmentInput | null {
  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const student_name = text("student_name");
  const subject = text("subject");
  const grade = Number(text("grade"));

  if (student_name.length < 2 || subject.length < 2 || !Number.isInteger(grade)) {
    return null;
  }
  return {
    student_name,
    subject,
    grade,
    assessment_type: text("assessment_type"),
    date: text("date"),
    class_name: text("class_name"),
    teacher: text("teacher") || null,
    comment: text("comment") || null,
  };
}

export async function createAssessment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = await getAuthToken();
  if (!token) {
    redirect("/login");
  }

  const data = parseForm(formData);
  if (!data) {
    return { error: "Барлық міндетті өрістерді толтырыңыз." };
  }

  let id: number;
  try {
    id = (await api.create(data, token)).id;
  } catch {
    return { error: "Сақтау мүмкін болмады. Қайта көріңіз." };
  }
  revalidatePath("/assessments");
  redirect(`/assessments/${id}`);
}

export async function updateAssessment(
  id: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = await getAuthToken();
  if (!token) {
    redirect("/login");
  }

  const data = parseForm(formData);
  if (!data) {
    return { error: "Барлық міндетті өрістерді толтырыңыз." };
  }

  try {
    await api.update(id, data, token);
  } catch {
    return { error: "Өзгерту мүмкін болмады." };
  }
  revalidatePath("/assessments");
  redirect(`/assessments/${id}`);
}

export async function deleteAssessment(id: number) {
  const token = await getAuthToken();
  if (!token) {
    redirect("/login");
  }

  await api.remove(id, token);
  revalidatePath("/assessments");
  redirect("/assessments");
}