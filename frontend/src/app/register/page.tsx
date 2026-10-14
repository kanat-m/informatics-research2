import Link from "next/link";
import { RegisterForm } from "@/components/RegisterForm";
import { registerAction } from "./actions";

export default function RegisterPage() {
  return (
    <section className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold">Тіркелу</h1>
      <RegisterForm action={registerAction} />
      <p className="text-sm text-gray-600">
        Аккаунтыңыз бар ма?{" "}
        <Link href="/login" className="text-blue-700 underline">
          Кіру
        </Link>
      </p>
    </section>
  );
}