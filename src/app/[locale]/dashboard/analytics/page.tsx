import { unstable_setRequestLocale } from "next-intl/server";
import Charts from "./components/Charts";
import { Metadata } from "next";
import { getMetadataAnalyticsPage } from "@/getMetaData";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataAnalyticsPage({ params });
}
const Dashboard = ({ params: { locale } }: { params: { locale: string } }) => {
  unstable_setRequestLocale(locale);
  return <Charts />;
};

export default Dashboard;
