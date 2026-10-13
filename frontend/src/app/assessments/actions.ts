"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import type { AssessmentInput, FormState } from "@/lib/types";

function parseForm(formData: FormData): AssessmentInput | null {
  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const title = text("student_name");
  const authors = text("subject");
  const year = Number(text("grade"));
  if (title.length < 2 || authors.length < 2 || !Number.isInteger(year)) {
    return null;
  }
  return {
    student_name: title,
    subject: authors,
    grade: year,
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
  const data = parseForm(formData);
  if (!data) {
    return { error: "Проверьте поля: название, авторы и год обязательны." };
  }

  let id: number;
  try {
    id = (await api.create(data)).id;
  } catch {
    return { error: "Не удалось сохранить. Возможно, дубликат." };
  }
  revalidatePath("/assessments");
  redirect(`/assessments/${id}`);
}

export async function updateAssessment(
  id: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const data = parseForm(formData);
  if (!data) {
    return { error: "Проверьте поля." };
  }

  try {
    await api.update(id, data);
  } catch {
    return { error: "Не удалось сохранить изменения." };
  }
  revalidatePath("/assessments");
  redirect(`/assessments/${id}`);
}

export async function deleteAssessment(id: number) {
  await api.remove(id);
  revalidatePath("/assessments");
  redirect("/assessments");
}