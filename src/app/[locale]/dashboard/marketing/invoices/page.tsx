import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getMetadataDashboardPage } from "@/getMetaData";
import InvoicesManagement from "../components/InvoicesManagement";
import MarketingPageShell from "../components/MarketingPageShell";
import { ReceiptText } from "lucide-react";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  return getMetadataDashboardPage({
    params,
  });
}

const InvoicesPage = async () => {
  const dashboardText = await getTranslations("dashboard");

  return (
    <MarketingPageShell
      description={dashboardText("invoicesDescription")}
      icon={<ReceiptText className="size-5" />}
      title={dashboardText("invoices")}
    >
      <InvoicesManagement />
    </MarketingPageShell>
  );
};

export default InvoicesPage;
