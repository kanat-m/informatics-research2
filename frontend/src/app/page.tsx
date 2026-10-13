import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">AI Education Quality</h1>

      <p className="text-gray-700">
        Жалпы білім беретін мектептерде білім сапасын басқаруда жасанды
        интеллект технологияларын қолдануға арналған веб-қосымша.
      </p>

      <div className="rounded border bg-white p-6 space-y-3">
        <h2 className="text-xl font-semibold">Мүмкіндіктер</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Бағалау нәтижелерін тіркеу және қарау</li>
          <li>Оқушы немесе мұғалім бойынша іздеу</li>
          <li>Пән және сынып бойынша сүзгілеу</li>
          <li>Статистика және талдау (жоспарда)</li>
        </ul>
      </div>

      <Link
        href="/assessments"
        className="inline-block rounded bg-blue-700 px-6 py-3 text-white hover:bg-blue-800"
      >
        Бағалауларды көру →
      </Link>
    </section>
  );
}