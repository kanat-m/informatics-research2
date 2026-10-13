import { notFound } from "next/navigation";
import Link from "next/link";
import { AssessmentForm } from "@/components/AssessmentForm";
import { api } from "@/lib/api";
import { deleteAssessment, updateAssessment } from "../actions";

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assessment = await api.get(Number(id));
  if (!assessment) notFound();

  return (
    <article className="space-y-6">
      <div>
        <Link href="/assessments" className="text-blue-700 underline">
          ← Бағалауларға қайту
        </Link>
      </div>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{assessment.student_name}</h1>
        <p className="text-gray-600">
          {assessment.subject} · {assessment.grade} · {assessment.class_name}
        </p>
        <p className="text-sm text-gray-500">
          {assessment.assessment_type} · {assessment.date}
          {assessment.teacher && ` · ${assessment.teacher}`}
        </p>
      </header>

      {assessment.comment && (
        <div className="rounded border bg-white p-4">
          <h2 className="font-semibold mb-2">Ескертпе</h2>
          <p className="whitespace-pre-line">{assessment.comment}</p>
        </div>
      )}

      <details className="rounded border bg-white p-4">
        <summary className="cursor-pointer font-semibold">
          Редакциялау
        </summary>
        <div className="mt-4">
          <AssessmentForm
            action={updateAssessment.bind(null, assessment.id)}
            initial={assessment}
          />
        </div>
      </details>

      <form action={deleteAssessment.bind(null, assessment.id)}>
        <button className="rounded border border-red-700 px-4 py-2 text-red-700">
          Өшіру
        </button>
      </form>
    </article>
  );
}