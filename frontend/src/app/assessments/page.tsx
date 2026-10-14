import Link from "next/link";
import { api } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

const PAGE_SIZE = 20;

export default async function AssessmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; mode?: string }>;
}) {
  const { q, page, mode } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const isSemantic = mode === "semantic";
  const token = await getAuthToken();

  const items = q && isSemantic
    ? await api.semanticSearch(q, 20)
    : await api.list(q, current, PAGE_SIZE);

  const link = (p: number) =>
    `/assessments?${new URLSearchParams({
      ...(q ? { q } : {}),
      ...(isSemantic ? { mode: "semantic" } : {}),
      page: String(p),
    })}`;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Бағалаулар</h1>
        {token && (
          <Link
            href="/assessments/new"
            className="rounded bg-blue-700 px-4 py-2 text-white"
          >
            + Қосу
          </Link>
        )}
      </div>

      <form className="space-y-3">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Оқушы немесе мұғалім аты..."
            className="flex-1 rounded border px-3 py-2"
          />
          <button className="rounded border bg-white px-4 py-2">Табу</button>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="simple"
              defaultChecked={!isSemantic}
            />
            Қарапайым іздеу
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="semantic"
              defaultChecked={isSemantic}
            />
            Мағына бойынша іздеу
          </label>
        </div>
      </form>

      {items.length === 0 ? (
        <p className="text-gray-600">Әзірге жазба жоқ.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id} className="rounded border bg-white p-4">
              <Link
                href={`/assessments/${a.id}`}
                className="text-lg font-semibold hover:underline"
              >
                {a.student_name}
              </Link>
              <p className="text-sm text-gray-600">
                {a.subject} · {a.grade} · {a.class_name} · {a.date}
                {a.teacher && ` · ${a.teacher}`}
              </p>
            </li>
          ))}
        </ul>
      )}

      {!isSemantic && (
        <div className="flex justify-between">
          {current > 1 ? (
            <Link href={link(current - 1)} className="text-blue-700 underline">
              ← Алдыңғы
            </Link>
          ) : (
            <span />
          )}
          {items.length === PAGE_SIZE && (
            <Link href={link(current + 1)} className="text-blue-700 underline">
              Келесі →
            </Link>
          )}
        </div>
      )}
    </section>
  );
}