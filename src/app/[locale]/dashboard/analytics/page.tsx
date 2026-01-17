
import Charts from "./components/Charts";
import { Metadata } from "next";
import { getMetadataAnalyticsPage } from "@/getMetaData";
export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataAnalyticsPage({ params });
}
const Dashboard = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;

  const {
    locale
  } = params;

  
  return <Charts />;
};

export default Dashboard;
