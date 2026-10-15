import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/logo-jossyquina.jpeg.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Aceder — Escola Comunitária Jossyquina" },
      { name: "description", content: "Acesso ao portal do estudante e aos painéis de professores e administração." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"student" | "staff">("student");
  const [registo, setRegisto] = useState("");
  const [codigo, setCodigo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function redirectByRole(userId: string) {
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const list = (roles ?? []).map((r) => r.role);
    if (list.includes("admin")) return navigate({ to: "/admin" });
    if (list.includes("teacher")) return navigate({ to: "/professor" });
    return navigate({ to: "/portal" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loginEmail =
        mode === "student" ? `${registo.trim().toLowerCase()}@alunos.ecj.local` : email.trim();
      const secret = mode === "student" ? codigo.trim() : password;
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: secret,
      });
      if (authError || !data.user) {
        // Mensagem genérica idêntica para conta inexistente, código errado ou bloqueada.
        setError("Credenciais inválidas. Verifique os dados e tente novamente.");
        return;
      }
      await redirectByRole(data.user.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 font-sans">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/">
            <img
              src={logoAsset.url}
              alt="Logótipo da Escola Comunitária Jossyquina"
              className="mx-auto mb-4 size-16 rounded-full object-cover"
            />
          </Link>
          <h1 className="text-2xl font-semibold text-navy">Aceder à Plataforma</h1>
          <p className="mt-1 text-sm text-zinc-600">Escola Comunitária Jossyquina</p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-lg bg-zinc-100 p-1">
          <button
            type="button"
            onClick={() => setMode("student")}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${
              mode === "student" ? "bg-navy text-paper" : "text-zinc-600"
            }`}
          >
            Estudante
          </button>
          <button
            type="button"
            onClick={() => setMode("staff")}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${
              mode === "staff" ? "bg-navy text-paper" : "text-zinc-600"
            }`}
          >
            Professor / Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-8 shadow-sm ring-1 ring-black/5">
          {mode === "student" ? (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy">Nº de Registo</label>
                <input
                  value={registo}
                  onChange={(e) => setRegisto(e.target.value)}
                  placeholder="ECJ-2026-0000"
                  required
                  maxLength={30}
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy">Código de Acesso</label>
                <input
                  type="password"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                  maxLength={20}
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
              <p className="text-xs text-zinc-500">
                O código é entregue pela secretaria após a aprovação da inscrição.
              </p>
            </>
          ) : (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy">Palavra-passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  maxLength={100}
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-navy py-2.5 text-sm font-medium text-paper transition-colors hover:bg-navy/90 disabled:opacity-50"
          >
            {loading ? "A entrar…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Ainda não inscreveu o seu filho?{" "}
          <Link to="/registo" className="font-medium text-navy underline hover:text-gold">
            Inscrever novo aluno
          </Link>
        </p>
      </div>
    </div>
  );
}
