"use client";

import { useActionState } from "react";
import type { Assessment, FormState } from "@/lib/types";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: Assessment;
};

const field = "w-full rounded border px-3 py-2";

export function AssessmentForm({ action, initial }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        Оқушы аты *
        <input
          name="student_name"
          required
          minLength={2}
          defaultValue={initial?.student_name}
          className={field}
        />
      </label>

      <label className="block">
        Пән *
        <input
          name="subject"
          required
          minLength={2}
          defaultValue={initial?.subject}
          className={field}
        />
      </label>

      <label className="block">
        Баға *
        <input
          name="grade"
          type="number"
          required
          min={2}
          max={5}
          defaultValue={initial?.grade ?? 5}
          className={field}
        />
      </label>

      <label className="block">
        Бағалау түрі *
        <select
          name="assessment_type"
          required
          defaultValue={initial?.assessment_type ?? "ТЖБ"}
          className={field}
        >
          <option value="ТЖБ">ТЖБ</option>
          <option value="БЖБ">БЖБ</option>
          <option value="Тоқсандық">Тоқсандық</option>
          <option value="Жылдық">Жылдық</option>
          <option value="Ағымдық">Ағымдық</option>
        </select>
      </label>

      <label className="block">
        Күні *
        <input
          name="date"
          type="date"
          required
          defaultValue={initial?.date ?? new Date().toISOString().slice(0, 10)}
          className={field}
        />
      </label>

      <label className="block">
        Сынып *
        <input
          name="class_name"
          required
          defaultValue={initial?.class_name}
          placeholder="9А"
          className={field}
        />
      </label>

      <label className="block">
        Мұғалім
        <input
          name="teacher"
          defaultValue={initial?.teacher ?? ""}
          className={field}
        />
      </label>

      <label className="block">
        Ескертпе
        <textarea
          name="comment"
          rows={3}
          defaultValue={initial?.comment ?? ""}
          className={field}
        />
      </label>

      {state.error && (
        <p className="rounded bg-red-50 p-3 text-red-700">{state.error}</p>
      )}

      <button
        disabled={pending}
        className="rounded bg-blue-700 px-6 py-3 text-white disabled:opacity-50"
      >
        {pending ? "Сақталуда..." : "Сақтау"}
      </button>
    </form>
  );
}