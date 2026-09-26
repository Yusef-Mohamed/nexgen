import type { Metadata } from "next";
import DeletionRequestForm from "./DeletionRequestForm";
export const metadata: Metadata = { title: "NexGen account deletion", robots: { index: false, follow: true } };
export default async function AccountDeletionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <main className="container py-24"><DeletionRequestForm locale={locale === "ar" ? "ar" : "en"} /></main>;
}
