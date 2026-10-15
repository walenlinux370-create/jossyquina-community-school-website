import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { registerStudent } from "@/lib/school.functions";
import logoAsset from "@/assets/logo-jossyquina.jpeg.asset.json";

export const Route = createFileRoute("/registo")({
  head: () => ({
    meta: [
      { title: "Inscrever Novo Aluno — Escola Comunitária Jossyquina" },
      {
        name: "description",
        content: "Formulário de inscrição para a Escola Comunitária Jossyquina, Mumemo 1, Marracuene. Resposta em menos de 24h.",
      },
      { property: "og:title", content: "Inscrever Novo Aluno — Escola Comunitária Jossyquina" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RegistoPage,
});

function RegistoPage() {
  const submit = useServerFn(registerStudent);
  const [form, setForm] = useState({
    nome_completo: "",
    email: "",
    telefone: "",
    classe: 1,
    encarregado_nome: "",
    encarregado_contacto: "",
    consentimento: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registo, setRegisto] = useState("");

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await submit({ data: form });
      setRegisto(result.registo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível registar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (registo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4 font-sans">
        <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-gold/20 text-2xl">✓</div>
          <h1 className="text-2xl font-semibold text-navy">Inscrição Recebida!</h1>
          <p className="mt-3 text-sm text-zinc-600">
            O número de registo do educando é:
          </p>
          <p className="my-4 rounded-md bg-zinc-50 py-3 font-mono text-xl font-semibold text-navy">{registo}</p>
          <p className="text-sm text-zinc-600">
            A secretaria irá analisar a inscrição e entregar o <strong>código de acesso</strong> pessoalmente
            ao encarregado de educação, num canal seguro. Respondemos em menos de 24 horas úteis.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-md bg-navy px-6 py-2.5 text-sm font-medium text-paper hover:bg-navy/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper py-12 font-sans">
      <div className="mx-auto max-w-lg px-4">
        <div className="mb-8 text-center">
          <Link to="/">
            <img
              src={logoAsset.url}
              alt="Logótipo da Escola Comunitária Jossyquina"
              className="mx-auto mb-4 size-16 rounded-full object-cover"
            />
          </Link>
          <h1 className="text-2xl font-semibold text-navy">Inscrever Novo Aluno</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Ano Lectivo 2026 — Escola Comunitária Jossyquina, Mumemo 1
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-8 shadow-sm ring-1 ring-black/5">
          <div>
            <label className="mb-1 block text-sm font-medium text-navy">Nome Completo do Aluno *</label>
            <input
              value={form.nome_completo}
              onChange={(e) => set("nome_completo", e.target.value)}
              required
              maxLength={120}
              className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                maxLength={255}
                className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">Telefone</label>
              <input
                value={form.telefone}
                onChange={(e) => set("telefone", e.target.value)}
                maxLength={30}
                className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-navy">Classe *</label>
            <select
              value={form.classe}
              onChange={(e) => set("classe", Number(e.target.value))}
              className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
                <option key={c} value={c}>
                  {c}ª Classe
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-zinc-100 pt-4">
            <h2 className="mb-3 text-sm font-semibold text-navy">Encarregado de Educação</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-navy">Nome Completo *</label>
                <input
                  value={form.encarregado_nome}
                  onChange={(e) => set("encarregado_nome", e.target.value)}
                  required
                  maxLength={120}
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy">Contacto (telefone) *</label>
                <input
                  value={form.encarregado_contacto}
                  onChange={(e) => set("encarregado_contacto", e.target.value)}
                  required
                  maxLength={30}
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={form.consentimento}
              onChange={(e) => set("consentimento", e.target.checked)}
              required
              className="mt-1"
            />
            Autorizo o tratamento dos dados pessoais do educando para fins de gestão escolar, nos
            termos da política de privacidade da escola. *
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-navy py-2.5 text-sm font-medium text-paper transition-colors hover:bg-navy/90 disabled:opacity-50"
          >
            {loading ? "A enviar…" : "Submeter Inscrição"}
          </button>
          <p className="text-center text-xs text-zinc-500">
            Prometemos responder em menos de 24 horas úteis.
          </p>
        </form>
      </div>
    </div>
  );
}
