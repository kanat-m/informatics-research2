"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/types";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
};

const field = "w-full rounded border px-3 py-2";

export function LoginForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        Email
        <input
          name="email"
          type="email"
          required
          placeholder="user@example.com"
          className={field}
        />
      </label>

      <label className="block">
        Пароль
        <input
          name="password"
          type="password"
          required
          minLength={8}
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
        {pending ? "Кіру..." : "Кіру"}
      </button>
    </form>
  );
}