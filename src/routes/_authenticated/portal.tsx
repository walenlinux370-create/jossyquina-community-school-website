import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { studentMyProfile, studentMyGrades, listPublishedNews } from "@/lib/school.functions";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({ meta: [{ title: "Portal do Estudante — ECJ" }, { name: "robots", content: "noindex" }] }),
  component: PortalPage,
});

function PortalPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchProfile = useServerFn(studentMyProfile);
  const fetchGrades = useServerFn(studentMyGrades);
  const fetchNews = useServerFn(listPublishedNews);

  const profileQuery = useQuery({ queryKey: ["student-profile"], queryFn: () => fetchProfile() });
  const gradesQuery = useQuery({ queryKey: ["student-grades"], queryFn: () => fetchGrades() });
  const newsQuery = useQuery({ queryKey: ["published-news"], queryFn: () => fetchNews() });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const profile = profileQuery.data;
  const grades = gradesQuery.data ?? [];

  return (
    <div className="min-h-screen bg-paper font-sans">
      <header className="bg-navy py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <span className="font-medium text-paper">Portal do Estudante</span>
          <button onClick={handleSignOut} className="text-sm text-paper/80 hover:text-gold">
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section className="rounded-xl bg-navy p-8 text-paper">
          <p className="text-sm uppercase tracking-widest text-gold">Bem-vindo</p>
          <h1 className="mt-2 text-3xl font-semibold">{profile?.nome_completo ?? "…"}</h1>
          <p className="mt-2 text-paper/70">
            {profile ? `${profile.classe}ª Classe · Nº de Registo ${profile.registo}` : ""}
          </p>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="mb-4 text-lg font-semibold text-navy">As Minhas Notas</h2>
          {grades.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-2 py-2">Disciplina</th>
                  <th className="px-2 py-2">Trimestre</th>
                  <th className="px-2 py-2">Nota</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g, i) => (
                  <tr key={i} className="border-b border-zinc-50">
                    <td className="px-2 py-2 font-medium text-navy">{(g.subjects as any)?.nome}</td>
                    <td className="px-2 py-2">{g.trimester}º</td>
                    <td className="px-2 py-2 font-semibold text-navy">{g.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-zinc-500">Ainda não há notas publicadas.</p>
          )}
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h2 className="mb-4 text-lg font-semibold text-navy">Notícias e Avisos</h2>
          <ul className="space-y-4">
            {(newsQuery.data ?? []).map((n) => (
              <li key={n.id} className="border-b border-zinc-50 pb-4">
                <h3 className="font-medium text-navy">{n.titulo}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-zinc-600">{n.conteudo}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {new Date(n.created_at).toLocaleDateString("pt-MZ")}
                </p>
              </li>
            ))}
            {(newsQuery.data ?? []).length === 0 && (
              <li className="text-sm text-zinc-500">Sem notícias de momento.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
