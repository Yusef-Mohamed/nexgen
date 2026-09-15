"use client";
import { useEffect, useRef, useState } from "react";
import { deletionMessages } from "./messages";

type Action = "request" | "cancel" | "status";
type Status = "none" | "pending" | "processing" | "failed" | "completed" | "cancelled";
type Result = { reference: string | null; status: Status; canCancel: boolean };
type Policy = { configured: boolean; processingNotice: Record<"en" | "ar", string> | null;
  retentionReason: Record<"en" | "ar", string> | null; financialRetentionDays: number | null; backupRotationDays: number | null };
class RequestError extends Error { constructor(public code: string) { super(code); } }
async function request<T>(path: string, input?: unknown): Promise<T> {
  const api = process.env.NEXT_PUBLIC_API_URL;
  if (!api) throw new RequestError("DELETION_NOT_CONFIGURED");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(api.replace(/\/+$/, "") + "/account-deletion/" + path, {
      method: input === undefined ? "GET" : "POST", credentials: "omit", cache: "no-store",
      headers: { "Content-Type": "application/json" }, signal: controller.signal,
      ...(input === undefined ? {} : { body: JSON.stringify(input) }),
    });
    const json = await response.json();
    if (!response.ok) throw new RequestError(typeof json.code === "string" ? json.code : "DELETION_UNAVAILABLE");
    return json.data as T;
  } finally { clearTimeout(timeout); }
}
export default function DeletionRequestForm({ locale }: { locale: "en" | "ar" }) {
  const copy = deletionMessages[locale];
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [action, setAction] = useState<Action>("request");
  const [challenge, setChallenge] = useState<{ challengeId: string; action: Action } | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [policyError, setPolicyError] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    let active = true;
    request<Policy>("policy").then((data) => { if (active) setPolicy(data); })
      .catch(() => { if (active) setPolicyError(true); });
    return () => { active = false; mounted.current = false; };
  }, []);
  async function run(operation: () => Promise<void>) {
    if (lock.current || !mounted.current) return;
    lock.current = true; setBusy(true); setError("");
    try { await operation(); }
    catch (failure) {
      if (!mounted.current) return;
      const id = failure instanceof RequestError ? failure.code : "";
      setError(id === "DELETION_INVALID_CODE" ? copy.invalid : id === "DELETION_RATE_LIMITED" ? copy.limited
        : id === "DELETION_ALREADY_PROCESSING" ? copy.conflict : id === "DELETION_NOT_CONFIGURED" ? copy.unavailable : copy.error);
    } finally { lock.current = false; if (mounted.current) setBusy(false); }
  }
  function send() {
    void run(async () => {
      const data = await request<{ challengeId: string }>("challenge", { email, action, locale });
      if (!data?.challengeId) throw new RequestError("DELETION_UNAVAILABLE");
      if (mounted.current) { setChallenge({ challengeId: data.challengeId, action }); setCode(""); setConfirmed(false); setResult(null); }
    });
  }
  function verify() {
    void run(async () => {
      if (!challenge || !confirmed) return;
      const data = await request<Result>("confirm", { challengeId: challenge.challengeId, code, confirmed: true });
      if (!["none", "pending", "processing", "failed", "completed", "cancelled"].includes(data?.status)) throw new RequestError("DELETION_UNAVAILABLE");
      if (mounted.current) { setResult(data); setChallenge(null); setCode(""); setConfirmed(false); }
    });
  }
  const inputClass = "w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground";
  const buttonClass = "min-h-12 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-50";
  return (
    <section className="mx-auto max-w-2xl space-y-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold">{copy.title}</h1>
      <p className="leading-7">{copy.intro}</p>
      <p className="leading-7">{copy.warning}</p>
      <div className="rounded-xl border border-border p-5 space-y-3">
        {!policy ? <p role="status">{policyError ? copy.policyError : copy.policyLoading}</p> : !policy.configured ? <p>{copy.schedulePending}</p> : <>
          <p>{policy.processingNotice?.[locale]}</p>
          <p>{copy.financial.replace("{days}", String(policy.financialRetentionDays)).replace("{reason}", policy.retentionReason?.[locale] || "")}</p>
          <p>{copy.backups.replace("{days}", String(policy.backupRotationDays))}</p>
        </>}
      </div>
      <form method="post" className="space-y-4" onSubmit={(event) => { event.preventDefault(); send(); }}>
        <label className="block space-y-2"><span>{copy.email}</span>
          <input type="email" dir="ltr" autoComplete="email" required maxLength={254} value={email} disabled={busy} className={inputClass}
            onChange={(event) => { setEmail(event.target.value); setChallenge(null); setCode(""); setResult(null); setConfirmed(false); }} />
        </label>
        <label className="block space-y-2"><span>{copy.action}</span>
          <select className={inputClass} value={action} disabled={busy} onChange={(event) => {
            setAction(event.target.value as Action); setChallenge(null); setCode(""); setConfirmed(false);
          }}>
            <option value="request">{copy.requestAction}</option><option value="cancel">{copy.cancelAction}</option><option value="status">{copy.statusAction}</option>
          </select>
        </label>
        <button type="submit" className={buttonClass} disabled={busy || !policy}>{action === "request" ? copy.send : action === "cancel" ? copy.cancel : copy.check}</button>
      </form>
      {challenge ? <form method="post" className="space-y-4" onSubmit={(event) => { event.preventDefault(); verify(); }}>
        <p role="status">{copy.sent}</p>
        <label className="block space-y-2"><span>{copy.code}</span>
          <input type="text" inputMode="numeric" dir="ltr" autoComplete="one-time-code" pattern="[0-9]{6}" required maxLength={6}
            className={inputClass} value={code} disabled={busy} onChange={(event) => setCode(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))} />
        </label>
        <label className="flex min-h-12 items-center gap-3"><input type="checkbox" required checked={confirmed} disabled={busy}
          onChange={(event) => setConfirmed(event.target.checked)} />{copy.confirmed}</label>
        <button type="submit" className={buttonClass} disabled={busy || code.length !== 6 || !confirmed}>{challenge.action === "request" ? copy.confirm : copy.verify}</button>
      </form> : null}
      {error ? <p role="alert" className="text-destructive">{error}</p> : null}
      {result ? <div role="status" className="rounded-xl border border-border p-5 space-y-3">
        <p>{copy[result.status]}</p>{result.reference ? <p>{copy.reference}: <span dir="ltr">{result.reference}</span></p> : null}
      </div> : null}
      <a className="inline-block underline" href={"/" + locale + "/privacy-policy#account-deletion"}>{locale === "ar" ? "سياسة الخصوصية والاحتفاظ بالبيانات" : "Privacy and retention policy"}</a>
    </section>
  );
}
