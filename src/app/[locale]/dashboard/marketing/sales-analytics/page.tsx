import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getMetadataDashboardPage } from "@/getMetaData";
import SalesManagement from "../components/SalesManagement";
import MarketingPageShell from "../components/MarketingPageShell";
import { ChartNoAxesCombined } from "lucide-react";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  return getMetadataDashboardPage({
    params,
  });
}

const SalesAnalyticsPage = async () => {
  const dashboardText = await getTranslations("dashboard");

  return (
    <MarketingPageShell
      description={dashboardText("salesAnalyticsDescription")}
      icon={<ChartNoAxesCombined className="size-5" />}
      title={dashboardText("salesAnalytics")}
    >
      <SalesManagement />
    </MarketingPageShell>
  );
};

export default SalesAnalyticsPage;
