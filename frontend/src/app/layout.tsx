import type { Metadata } from "next";
import Link from "next/link";
import { getAuthToken } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Education Quality",
  description: "Web application for managing education quality using AI",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAuthToken();

  return (
    <html lang="kk">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-4xl items-center gap-6 p-4">
            <Link href="/" className="font-semibold">
              AI Education Quality
            </Link>
            <Link href="/assessments">Бағалаулар</Link>
            {token ? (
              <>
                <Link href="/assessments/new">Қосу</Link>
                <form action="/logout" method="post" className="ml-auto">
                  <button className="text-red-700 underline">Шығу</button>
                </form>
              </>
            ) : (
              <Link href="/login" className="ml-auto text-blue-700 underline">
                Кіру
              </Link>
            )}
          </nav>
        </header>
        <main className="mx-auto max-w-4xl p-4 sm:p-8">{children}</main>
      </body>
    </html>
  );
}