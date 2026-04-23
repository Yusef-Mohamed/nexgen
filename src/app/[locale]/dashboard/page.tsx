import DashboardHomeClient from "./components/DashboardHomeClient";
import { Metadata } from "next";
import { getMetadataDashboardPage } from "@/getMetaData";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  return getMetadataDashboardPage({
    params,
  });
}
const Dashboard = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;

  const { locale } = params;

  return (
    <main className="flex flex-col relative overflow-hidden bg-background xl:flex-row">
      <DashboardHomeClient />
    </main>
  );
};

export default Dashboard;
