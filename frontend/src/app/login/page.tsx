import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { loginAction } from "./actions";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Кіру</h1>
      <LoginForm action={loginAction} />
      <p className="text-sm text-gray-600">
        Аккаунтыңыз жоқ па?{" "}
        <Link href="/register" className="text-blue-700 underline">
          Тіркелу
        </Link>
      </p>
    </section>
  );
}