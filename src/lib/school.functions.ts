import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function requireAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateCode(length = 12): string {
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

// ---------- Inscrição pública ----------

const registrationSchema = z.object({
  nome_completo: z.string().trim().min(3, "Nome obrigatório").max(120),
  email: z.string().trim().email("E-mail inválido").max(255).optional().or(z.literal("")),
  telefone: z.string().trim().max(30).optional().or(z.literal("")),
  classe: z.number().int().min(1).max(12),
  encarregado_nome: z.string().trim().min(3, "Nome do encarregado obrigatório").max(120),
  encarregado_contacto: z.string().trim().min(5, "Contacto obrigatório").max(30),
  consentimento: z.literal(true, { errorMap: () => ({ message: "Consentimento obrigatório" }) }),
});

export const registerStudent = createServerFn({ method: "POST" })
  .inputValidator((data) => registrationSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const registo = `ECJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { error } = await supabaseAdmin.from("students").insert({
      registo,
      nome_completo: data.nome_completo,
      email: data.email || null,
      telefone: data.telefone || null,
      classe: data.classe,
      encarregado_nome: data.encarregado_nome,
      encarregado_contacto: data.encarregado_contacto,
      consentimento: data.consentimento,
      status: "pending",
    });
    if (error) throw new Error("Não foi possível registar. Tente novamente.");
    return { registo };
  });

// ---------- Painel Admin ----------

export const adminListStudents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("students")
      .select("id, registo, nome_completo, classe, status, code_issued_at, encarregado_contacto, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const adminIssueCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { studentId: string }) => z.object({ studentId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: student } = await supabaseAdmin
      .from("students")
      .select("id, registo, status, user_id")
      .eq("id", data.studentId)
      .single();
    if (!student) throw new Error("Aluno não encontrado");

    const code = generateCode();
    const email = `${student.registo.toLowerCase()}@alunos.ecj.local`;

    let userId = student.user_id as string | null;
    if (userId) {
      await supabaseAdmin.auth.admin.updateUserById(userId, { password: code });
    } else {
      const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: code,
        email_confirm: true,
      });
      if (createError) throw new Error("Falha ao criar acesso do aluno");
      userId = created.user.id;
      await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "student" });
      await supabaseAdmin.from("profiles").insert({ id: userId, full_name: student.registo });
    }

    await supabaseAdmin
      .from("students")
      .update({ user_id: userId, status: "active", code_issued_at: new Date().toISOString() })
      .eq("id", student.id);
    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      acao: "issue_auth_code",
      detalhes: { student_id: student.id, registo: student.registo },
    });

    // O código em claro é devolvido UMA única vez, no momento da emissão.
    return { code, registo: student.registo };
  });

export const adminUpdateStudentStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { studentId: string; status: string }) =>
    z.object({ studentId: z.string().uuid(), status: z.enum(["active", "inactive"]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("students")
      .update({ status: data.status })
      .eq("id", data.studentId);
    if (error) throw error;
    return { ok: true };
  });

export const adminListNews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("news")
      .select("id, titulo, slug, publicado, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const adminSaveNews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { titulo: string; conteudo: string; publicado: boolean }) =>
    z
      .object({
        titulo: z.string().trim().min(3).max(200),
        conteudo: z.string().trim().min(3).max(20000),
        publicado: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const slug = data.titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80);
    const { error } = await context.supabase.from("news").insert({
      titulo: data.titulo,
      slug: `${slug}-${Date.now().toString(36)}`,
      conteudo: data.conteudo,
      publicado: data.publicado,
    });
    if (error) throw error;
    return { ok: true };
  });

// ---------- Painel do Professor ----------

export const teacherMyAllocations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("teacher_allocations")
      .select("id, ano_lectivo, subjects(nome), turmas(classe, nome)")
      .eq("teacher_id", context.userId);
    if (error) throw error;
    return data;
  });

export const teacherStudents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { turmaId: string }) => z.object({ turmaId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("students")
      .select("id, registo, nome_completo")
      .eq("turma_id", data.turmaId)
      .eq("status", "active");
    if (error) throw error;
    return rows;
  });

export const teacherSaveGrade = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { studentId: string; subjectId: string; turmaId: string; trimester: number; score: number; publish: boolean }) =>
    z
      .object({
        studentId: z.string().uuid(),
        subjectId: z.string().uuid(),
        turmaId: z.string().uuid(),
        trimester: z.number().int().min(1).max(3),
        score: z.number().min(0).max(20),
        publish: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("grades").upsert(
      {
        student_id: data.studentId,
        subject_id: data.subjectId,
        turma_id: data.turmaId,
        teacher_id: context.userId,
        trimester: data.trimester,
        score: data.score,
        status: data.publish ? "published" : "draft",
      },
      { onConflict: "student_id,subject_id,trimester,ano_lectivo" },
    );
    if (error) throw new Error("Não foi possível guardar a nota");
    return { ok: true };
  });

// ---------- Portal do Estudante ----------

export const studentMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("students")
      .select("registo, nome_completo, classe, status, turmas(nome, classe)")
      .eq("user_id", context.userId)
      .single();
    if (error) throw error;
    return data;
  });

export const studentMyGrades = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("grades")
      .select("trimester, score, ano_lectivo, subjects(nome)")
      .eq("status", "published");
    if (error) throw error;
    return data;
  });

export const listPublishedNews = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const supabasePublic = createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data, error } = await supabasePublic
    .from("news")
    .select("id, titulo, slug, conteudo, created_at")
    .eq("publicado", true)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return data;
});
