"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Step = "login" | "enroll" | "challenge";

export default function AuthPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("login");
  const [factorId, setFactorId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [verifyCode, setVerifyCode] = useState("");

  async function finishMfa() {
    const next = new URLSearchParams(window.location.search).get("next") || "/admin";
    window.location.assign(next);
  }

  async function startMfa(supabase: ReturnType<typeof createSupabaseBrowserClient>) {
    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) throw factorsError;

    const verified = factors?.totp?.find((factor) => factor.status === "verified");

    if (verified) {
      setFactorId(verified.id);
      setStep("challenge");
      return;
    }

    // Remove unfinished enrollment factors so the administrator can restart setup.
    for (const factor of factors?.totp?.filter((factor) => factor.status === "unverified") ?? []) {
      await supabase.auth.mfa.unenroll({ factorId: factor.id });
    }

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Jossyquina Admin",
    });

    if (enrollError || !data?.totp?.qr_code) {
      throw enrollError ?? new Error("Não foi possível iniciar a configuração MFA.");
    }

    setFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setStep("enroll");
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const form = new FormData(e.currentTarget);
      const email = String(form.get("email") ?? "");
      const password = String(form.get("password") ?? "");
      const supabase = createSupabaseBrowserClient();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !data.user) {
        throw signInError ?? new Error("Não foi possível iniciar sessão.");
      }

      await startMfa(supabase);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível iniciar sessão.");
      setBusy(false);
    }
  }

  async function verifyMfa(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();
      const challenge = await supabase.auth.mfa.challenge({ factorId });

      if (challenge.error) throw challenge.error;

      const verification = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: verifyCode.trim(),
      });

      if (verification.error) throw verification.error;

      await finishMfa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código MFA inválido.");
      setBusy(false);
    }
  }

  async function enrollMfa(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();
      const challenge = await supabase.auth.mfa.challenge({ factorId });

      if (challenge.error) throw challenge.error;

      const verification = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: verifyCode.trim(),
      });

      if (verification.error) throw verification.error;

      await finishMfa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código MFA inválido.");
      setBusy(false);
    }
  }

  if (step === "enroll" || step === "challenge") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
            Segurança administrativa
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            {step === "enroll" ? "Configurar MFA" : "Verificação MFA"}
          </h1>

          {step === "enroll" && (
            <>
              <p className="mt-4 text-sm text-slate-600">
                Abra o Google Authenticator, Microsoft Authenticator ou outra aplicação TOTP,
                leia o QR Code e depois introduza o código de 6 dígitos.
              </p>
              {qrCode && (
                <div className="mt-6 flex justify-center rounded-2xl border bg-white p-4">
                  <img
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(qrCode)}`}
                    alt="QR Code para configurar MFA"
                    className="h-56 w-56"
                  />
                </div>
              )}
            </>
          )}

          {step === "challenge" && (
            <p className="mt-4 text-sm text-slate-600">
              Introduza o código de 6 dígitos apresentado pela sua aplicação autenticadora.
            </p>
          )}

          <form onSubmit={step === "enroll" ? enrollMfa : verifyMfa}>
            <input
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              required
              className="mt-6 w-full rounded-xl border p-3 text-center text-xl tracking-[0.4em]"
              placeholder="000000"
              aria-label="Código MFA"
            />

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              disabled={busy || verifyCode.length !== 6}
              className="mt-5 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white disabled:opacity-50"
            >
              {busy ? "A verificar…" : step === "enroll" ? "Ativar MFA e entrar" : "Verificar e entrar"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
          Secretaria / Docentes
        </p>
        <h1 className="mt-3 text-3xl font-bold">Acesso seguro</h1>
        <input
          name="email"
          type="email"
          required
          className="mt-7 w-full rounded-xl border p-3"
          placeholder="E-mail institucional"
        />
        <input
          name="password"
          type="password"
          required
          className="mt-3 w-full rounded-xl border p-3"
          placeholder="Palavra-passe"
        />
        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}
        <button
          disabled={busy}
          className="mt-5 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white disabled:opacity-50"
        >
          {busy ? "A validar…" : "Entrar"}
        </button>
        <p className="mt-5 text-xs text-slate-500">
          MFA é obrigatório para contas administrativas e docentes.
        </p>
      </form>
    </main>
  );
}
