import { unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { getMetadataDashboardPage } from "@/getMetaData";
import CouponManagement from "../components/CouponManagement";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataDashboardPage({
    params,
  });
}
const SalesAnalyticsPage = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  unstable_setRequestLocale(locale);
  return (
    <main
      style={{
        minHeight: "calc(100vh - 76px)",
      }}
      className="px-2 py-6 lg:px-6 sm:px-4 "
    >
      <CouponManagement />
    </main>
  );
};

export default SalesAnalyticsPage;
