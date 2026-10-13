import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Education Quality",
  description: "Web application for managing education quality using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-4xl gap-6 p-4">
            <Link href="/" className="font-semibold">
              AI Education Quality
            </Link>
            <Link href="/assessments">Бағалаулар</Link>
            <Link href="/assessments/new">Қосу</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-4xl p-4 sm:p-8">{children}</main>
      </body>
    </html>
  );
}