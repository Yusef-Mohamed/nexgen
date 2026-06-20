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
const Dashboard = async () => {
  return (
    <main className="relative flex flex-col overflow-hidden !bg-transparent xl:flex-row">
      <DashboardHomeClient />
    </main>
  );
};

export default Dashboard;
