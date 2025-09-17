import { unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { getMetadataInstructorDashboardPage } from "@/getMetaData";
import MyCourses from "../components/MyCourses";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataInstructorDashboardPage({
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
    <main className="flex flex-col xl:flex-row">
      <MyCourses />
    </main>
  );
};

export default Dashboard;
