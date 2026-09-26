"use client";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
export function IdentityUnavailable() {
  const ar = useLocale() === "ar";
  return (
    <section className="space-y-4" dir={ar ? "rtl" : "ltr"}>
      <h1 className="text-xl font-semibold">{ar ? "التحقق من الهوية" : "Identity verification"}</h1>
      <p>{ar
        ? "جمع وثائق الهوية والتحقق منها غير متاحين في هذا الإصدار. لا ترسل وثائق الهوية أو صورك الشخصية إلى الدعم."
        : "Identity document collection and verification are unavailable in this release. Do not send identity documents or selfies to support."}</p>
      <Link href="/contact" className="underline">{ar ? "مساعدة الحساب" : "Account help"}</Link>
    </section>
  );
}

export { default } from "./ManualIdentityVerification";
