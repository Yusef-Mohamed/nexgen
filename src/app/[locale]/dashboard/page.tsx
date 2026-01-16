import { unstable_setRequestLocale } from "next-intl/server";
import DashboardHomeClient from "./components/DashboardHomeClient";
import { Metadata } from "next";
import { getMetadataDashboardPage } from "@/getMetaData";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataDashboardPage({
    params,
  });
}
const Dashboard = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  unstable_setRequestLocale(locale);

  return (
    <main className="flex flex-col relative overflow-hidden bg-background xl:flex-row">
      <DashboardHomeClient />
    </main>
  );
};

export default Dashboard;
