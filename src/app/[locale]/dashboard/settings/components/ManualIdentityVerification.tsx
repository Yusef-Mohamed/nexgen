"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { IdentityUnavailable } from "./IdentityVerification";
import { identityCopy } from "./identity-copy";

type Status = { idVerification: "pending" | "verified" | "rejected" | null; note: string; required: boolean };
export default function ManualIdentityVerification() {
  const { user } = useAuth();
  return <IdentityForm key={user?._id || "anonymous"} />;
}
function IdentityForm() {
  const { token, setStatus, logout } = useAuth();
  const locale = useLocale(), text = useTranslations("settings");
  const ar = locale === "ar", copy = identityCopy[ar ? "ar" : "en"];
  const currentToken = useRef(token);
  useLayoutEffect(() => { currentToken.current = token; return () => { currentToken.current = ""; }; }, [token]);
  const [status, setIdentityStatus] = useState<Status | null>(null);
  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [feedback, setFeedback] = useState("");
  const load = useCallback(async () => {
    if (!token) return;
    setBusy(true); setFeedback("");
    try {
      const result = await axiosInstance.get<{ data: Status }>("/users/idDocument/status", { headers: { Authorization: `Bearer ${token}` } });
      if (currentToken.current !== token) return;
      setIdentityStatus(result.data.data);
      setStatus(result.data.data.required ? 406 : 200);
      setUnavailable(false);
    } catch (error) {
      if (currentToken.current !== token) return;
      if ((error as { response?: { status?: number } }).response?.status === 410) setUnavailable(true);
      else setFeedback(copy.refreshError);
    } finally { if (currentToken.current === token) setBusy(false); }
  }, [token, setStatus, copy.refreshError]);
  useEffect(() => { let cancelled = false; queueMicrotask(() => { if (!cancelled) void load(); }); return () => { cancelled = true; }; }, [load]);
  const submit = async () => {
    if (!consent || files.some((file) => !file) || busy) return;
    setBusy(true); setFeedback("");
    try {
      const data = new FormData();
      files.forEach((file) => { if (file) data.append("idDocuments", file); });
      const result = await axiosInstance.post<{ data: Status }>("/users/idDocument/upload", data, {
        headers: { Authorization: `Bearer ${token}`, "X-Identity-Consent": "manual-identity-v1" },
      });
      if (currentToken.current !== token) return;
      setIdentityStatus(result.data.data); setFiles([null, null, null]); setConsent(false);
    } catch { if (currentToken.current === token) setFeedback(copy.refreshError); }
    finally { if (currentToken.current === token) setBusy(false); }
  };
  const withdraw = async () => {
    setBusy(true); setFeedback("");
    try {
      await axiosInstance.delete("/users/idDocument/submission", { headers: { Authorization: `Bearer ${token}` } });
      await load();
      if (currentToken.current === token) setFeedback(copy.withdrawn);
    } catch { if (currentToken.current === token) setFeedback(copy.refreshError); }
    finally { if (currentToken.current === token) setBusy(false); }
  };
  if (unavailable) return <IdentityUnavailable />;
  return <section className="space-y-5" dir={ar ? "rtl" : "ltr"}>
    <h1 className="text-xl font-semibold">{ar ? "التحقق من الهوية" : "Identity verification"}</h1>
    <p>{status?.required ? copy.required : copy.optional}</p>
    {status?.idVerification === "verified" ? <p role="status">{text("verificationDone")}</p> : null}
    {status?.idVerification === "pending" ? <p role="status">{text("verificationSubmittedP")}</p> : null}
    {status?.idVerification === "rejected" && status.note ? <p role="status">{status.note}</p> : null}
    {feedback ? <p role="alert">{feedback}</p> : null}
    {status && !["pending", "verified"].includes(status.idVerification || "") ? <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
      <p className="text-sm leading-7">{copy.disclosure}</p>
      <Link href="/privacy-policy" className="underline">{ar ? "سياسة الخصوصية" : "Privacy policy"}</Link>
      <label className="flex items-center gap-3"><input type="checkbox" checked={consent} disabled={busy} onChange={(event) => setConsent(event.target.checked)} />{copy.consent}</label>
      <p className="text-sm">{copy.fileLimit}</p>
      {[ar ? "وجه الهوية" : "ID front", ar ? "ظهر الهوية" : "ID back", ar ? "صورة شخصية" : "Selfie"].map((label, index) => <label key={label} className="block space-y-2 rounded-xl border p-4">
        <span className="block">{label}</span>
        <input type="file" accept="image/jpeg,image/png" disabled={!consent || busy} onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          if (!file.size || file.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png"].includes(file.type)) {
            event.target.value = ""; setFeedback(copy.fileLimit);
            setFiles((current) => current.map((item, i) => i === index ? null : item)); return;
          }
          setFiles((current) => current.map((item, i) => i === index ? file : item)); setFeedback("");
        }} />
      </label>)}
      <Button type="submit" disabled={!consent || files.some((file) => !file) || busy}>{ar ? "إرسال للمراجعة" : "Submit for review"}</Button>
    </form> : null}
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" disabled={busy} onClick={() => void load()}>{copy.refresh}</Button>
      {status?.idVerification === "pending" ? <Button variant="outline" disabled={busy} onClick={() => void withdraw()}>{copy.withdraw}</Button> : null}
      {status?.required ? <Button variant="outline" onClick={logout}>{copy.signOut}</Button> : null}
    </div>
  </section>;
}
