import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getMetadataDashboardPage } from "@/getMetaData";
import CouponManagement from "../components/CouponManagement";
import MarketingPageShell from "../components/MarketingPageShell";
import { TicketPercent } from "lucide-react";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  return getMetadataDashboardPage({
    params,
  });
}

const CouponsPage = async () => {
  const dashboardText = await getTranslations("dashboard");

  return (
    <MarketingPageShell
      description={dashboardText("couponsDescription")}
      icon={<TicketPercent className="size-5" />}
      title={dashboardText("coupons")}
    >
      <CouponManagement />
    </MarketingPageShell>
  );
};

export default CouponsPage;
