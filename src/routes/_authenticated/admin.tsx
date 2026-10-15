import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import {
  adminListStudents,
  adminIssueCode,
  adminUpdateStudentStatus,
  adminListNews,
  adminSaveNews,
} from "@/lib/school.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Administração — ECJ" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchStudents = useServerFn(adminListStudents);
  const issueCode = useServerFn(adminIssueCode);
  const updateStatus = useServerFn(adminUpdateStudentStatus);
  const fetchNews = useServerFn(adminListNews);
  const saveNews = useServerFn(adminSaveNews);

  const [tab, setTab] = useState<"alunos" | "noticias">("alunos");
  const [issuedCode, setIssuedCode] = useState<{ code: string; registo: string } | null>(null);
  const [newsForm, setNewsForm] = useState({ titulo: "", conteudo: "", publicado: false });
  const [feedback, setFeedback] = useState("");

  const studentsQuery = useQuery({ queryKey: ["admin-students"], queryFn: () => fetchStudents() });
  const newsQuery = useQuery({ queryKey: ["admin-news"], queryFn: () => fetchNews() });

  async function handleIssueCode(studentId: string) {
    const result = await issueCode({ data: { studentId } });
    setIssuedCode(result);
    queryClient.invalidateQueries({ queryKey: ["admin-students"] });
  }

  async function handleToggleStatus(studentId: string, current: string) {
    await updateStatus({ data: { studentId, status: current === "inactive" ? "active" : "inactive" } });
    queryClient.invalidateQueries({ queryKey: ["admin-students"] });
  }

  async function handleSaveNews(e: React.FormEvent) {
    e.preventDefault();
    await saveNews({ data: newsForm });
    setNewsForm({ titulo: "", conteudo: "", publicado: false });
    setFeedback("Notícia guardada.");
    queryClient.invalidateQueries({ queryKey: ["admin-news"] });
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const students = studentsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-paper font-sans">
      <header className="bg-navy py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <span className="font-medium text-paper">Painel de Administração</span>
          <button onClick={handleSignOut} className="text-sm text-paper/80 hover:text-gold">
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setTab("alunos")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${tab === "alunos" ? "bg-navy text-paper" : "bg-zinc-100 text-zinc-600"}`}
          >
            Estudantes
          </button>
          <button
            onClick={() => setTab("noticias")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${tab === "noticias" ? "bg-navy text-paper" : "bg-zinc-100 text-zinc-600"}`}
          >
            Notícias
          </button>
        </div>

        {issuedCode && (
          <div className="mb-6 rounded-xl border-2 border-gold bg-gold/10 p-6">
            <h2 className="font-semibold text-navy">Código emitido para {issuedCode.registo}</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Este código é mostrado <strong>apenas uma vez</strong>. Copie-o e entregue-o ao
              encarregado por um canal seguro.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <code className="rounded-md bg-navy px-4 py-2 font-mono text-lg text-gold">{issuedCode.code}</code>
              <button
                onClick={() => navigator.clipboard.writeText(issuedCode.code)}
                className="rounded-md bg-navy px-3 py-2 text-sm text-paper hover:bg-navy/90"
              >
                Copiar
              </button>
              <button onClick={() => setIssuedCode(null)} className="text-sm text-zinc-500 underline">
                Fechar
              </button>
            </div>
          </div>
        )}

        {tab === "alunos" && (
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-black/5">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Registo</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Classe</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Acções</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-50">
                    <td className="px-4 py-3 font-mono text-xs">{s.registo}</td>
                    <td className="px-4 py-3 font-medium text-navy">{s.nome_completo}</td>
                    <td className="px-4 py-3">{s.classe}ª</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          s.status === "active"
                            ? "bg-green-100 text-green-700"
                            : s.status === "pending"
                              ? "bg-gold/20 text-navy"
                              : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {s.status === "active" ? "Activo" : s.status === "pending" ? "Pendente" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {s.code_issued_at
                        ? `Emitido em ${new Date(s.code_issued_at).toLocaleDateString("pt-MZ")}`
                        : "Não emitido"}
                    </td>
                    <td className="space-x-2 px-4 py-3">
                      <button
                        onClick={() => handleIssueCode(s.id)}
                        className="rounded-md bg-navy px-3 py-1 text-xs text-paper hover:bg-navy/90"
                      >
                        {s.code_issued_at ? "Gerar novo código" : "Aprovar e emitir código"}
                      </button>
                      <button
                        onClick={() => handleToggleStatus(s.id, s.status)}
                        className="rounded-md bg-zinc-100 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-200"
                      >
                        {s.status === "inactive" ? "Reactivar" : "Desactivar"}
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                      Sem inscrições de momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "noticias" && (
          <div className="grid gap-8 lg:grid-cols-2">
            <form onSubmit={handleSaveNews} className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h2 className="font-semibold text-navy">Nova Notícia</h2>
              <input
                value={newsForm.titulo}
                onChange={(e) => setNewsForm((f) => ({ ...f, titulo: e.target.value }))}
                placeholder="Título"
                required
                maxLength={200}
                className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <textarea
                value={newsForm.conteudo}
                onChange={(e) => setNewsForm((f) => ({ ...f, conteudo: e.target.value }))}
                placeholder="Conteúdo da notícia ou aviso"
                required
                maxLength={20000}
                rows={6}
                className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={newsForm.publicado}
                  onChange={(e) => setNewsForm((f) => ({ ...f, publicado: e.target.checked }))}
                />
                Publicar imediatamente no site
              </label>
              {feedback && <p className="text-sm text-green-600">{feedback}</p>}
              <button className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-paper hover:bg-navy/90">
                Guardar
              </button>
            </form>

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h2 className="mb-4 font-semibold text-navy">Notícias Publicadas</h2>
              <ul className="space-y-3">
                {(newsQuery.data ?? []).map((n) => (
                  <li key={n.id} className="flex items-center justify-between border-b border-zinc-50 pb-2 text-sm">
                    <span className="text-navy">{n.titulo}</span>
                    <span className={`text-xs ${n.publicado ? "text-green-600" : "text-zinc-400"}`}>
                      {n.publicado ? "Publicada" : "Rascunho"}
                    </span>
                  </li>
                ))}
                {(newsQuery.data ?? []).length === 0 && (
                  <li className="text-sm text-zinc-500">Ainda não há notícias.</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
