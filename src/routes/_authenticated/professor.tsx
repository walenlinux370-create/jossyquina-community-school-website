import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { teacherMyAllocations, teacherStudents, teacherSaveGrade } from "@/lib/school.functions";

export const Route = createFileRoute("/_authenticated/professor")({
  head: () => ({ meta: [{ title: "Painel do Professor — ECJ" }, { name: "robots", content: "noindex" }] }),
  component: ProfessorPage,
});

type Allocation = {
  id: string;
  subject_id: string;
  turma_id: string;
  ano_lectivo: number;
  subjects: { nome: string } | null;
  turmas: { classe: number; nome: string } | null;
};

function ProfessorPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchAllocations = useServerFn(teacherMyAllocations);
  const fetchStudents = useServerFn(teacherStudents);
  const saveGrade = useServerFn(teacherSaveGrade);

  const [selected, setSelected] = useState<Allocation | null>(null);
  const [trimester, setTrimester] = useState(1);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");

  const allocationsQuery = useQuery({ queryKey: ["teacher-allocations"], queryFn: () => fetchAllocations() });
  const studentsQuery = useQuery({
    queryKey: ["teacher-students", selected?.id],
    queryFn: () => fetchStudents({ data: { turmaId: selected!.id } }),
    enabled: !!selected,
  });

  async function handleSave(studentId: string, publish: boolean) {
    if (!selected) return;
    const raw = scores[studentId];
    const score = Number(raw);
    if (raw === undefined || Number.isNaN(score) || score < 0 || score > 20) {
      setFeedback("A nota deve ser um valor entre 0 e 20.");
      return;
    }
    await saveGrade({
      data: {
        studentId,
        subjectId: selected.id ? selectedSubjectId(selected) : "",
        turmaId: selectedTurmaId(selected),
        trimester,
        score,
        publish,
      },
    });
    setFeedback(publish ? "Nota publicada." : "Rascunho guardado.");
  }

  // As alocações incluem os ids necessários via select expandido
  function selectedSubjectId(a: Allocation) {
    return (a as any).subject_id ?? a.id;
  }
  function selectedTurmaId(a: Allocation) {
    return (a as any).turma_id ?? a.id;
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const allocations = (allocationsQuery.data ?? []) as unknown as Allocation[];

  return (
    <div className="min-h-screen bg-paper font-sans">
      <header className="bg-navy py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <span className="font-medium text-paper">Painel do Professor</span>
          <button onClick={handleSignOut} className="text-sm text-paper/80 hover:text-gold">
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-navy">As Minhas Turmas e Disciplinas</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-3">
            {allocations.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className={`w-full rounded-xl p-4 text-left shadow-sm ring-1 ring-black/5 transition-colors ${
                  selected?.id === a.id ? "bg-navy text-paper" : "bg-white text-navy hover:bg-zinc-50"
                }`}
              >
                <p className="font-medium">{a.subjects?.nome}</p>
                <p className={`text-sm ${selected?.id === a.id ? "text-paper/70" : "text-zinc-500"}`}>
                  {a.turmas?.classe}ª Classe — Turma {a.turmas?.nome} · {a.ano_lectivo}
                </p>
              </button>
            ))}
            {allocations.length === 0 && !allocationsQuery.isLoading && (
              <p className="rounded-xl bg-white p-6 text-sm text-zinc-500 shadow-sm ring-1 ring-black/5">
                Ainda não tem turmas atribuídas. Contacte a secretaria.
              </p>
            )}
          </div>

          <div className="lg:col-span-2">
            {selected ? (
              <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-navy">
                    {selected.subjects?.nome} — {selected.turmas?.classe}ª {selected.turmas?.nome}
                  </h2>
                  <select
                    value={trimester}
                    onChange={(e) => setTrimester(Number(e.target.value))}
                    className="rounded-md border border-zinc-200 px-2 py-1 text-sm"
                  >
                    <option value={1}>1º Trimestre</option>
                    <option value={2}>2º Trimestre</option>
                    <option value={3}>3º Trimestre</option>
                  </select>
                </div>

                {feedback && <p className="mb-3 text-sm text-navy">{feedback}</p>}

                <table className="w-full text-left text-sm">
                  <thead className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-500">
                    <tr>
                      <th className="px-2 py-2">Registo</th>
                      <th className="px-2 py-2">Nome</th>
                      <th className="px-2 py-2">Nota (0–20)</th>
                      <th className="px-2 py-2">Acções</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(studentsQuery.data ?? []).map((s) => (
                      <tr key={s.id} className="border-b border-zinc-50">
                        <td className="px-2 py-2 font-mono text-xs">{s.registo}</td>
                        <td className="px-2 py-2 font-medium text-navy">{s.nome_completo}</td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            step={0.5}
                            value={scores[s.id] ?? ""}
                            onChange={(e) => setScores((m) => ({ ...m, [s.id]: e.target.value }))}
                            className="w-20 rounded-md border border-zinc-200 px-2 py-1 text-sm outline-none focus:border-gold"
                          />
                        </td>
                        <td className="space-x-2 px-2 py-2">
                          <button
                            onClick={() => handleSave(s.id, false)}
                            className="rounded-md bg-zinc-100 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-200"
                          >
                            Rascunho
                          </button>
                          <button
                            onClick={() => handleSave(s.id, true)}
                            className="rounded-md bg-navy px-3 py-1 text-xs text-paper hover:bg-navy/90"
                          >
                            Publicar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(studentsQuery.data ?? []).length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-2 py-6 text-center text-zinc-500">
                          Sem alunos activos nesta turma.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid h-full place-items-center rounded-xl bg-white p-12 text-sm text-zinc-500 shadow-sm ring-1 ring-black/5">
                Seleccione uma turma para lançar notas.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
