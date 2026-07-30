import Charts from "./components/AnalyticsDashboard";
import { Metadata } from "next";
import { getMetadataAnalyticsPage } from "@/getMetaData";
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  return getMetadataAnalyticsPage({ params });
}
const Dashboard = () => <Charts />;

export default Dashboard;
