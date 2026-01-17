
import { Metadata } from "next";
import { getMetadataInstructorDashboardPage } from "@/getMetaData";
import MyCourses from "../components/MyCourses";

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataInstructorDashboardPage({
    params,
  });
}

const Dashboard = async (
  props: {
    params: Promise<{ locale: string }>;
  }
) => {
  const params = await props.params;

  const {
    locale
  } = params;

  

  return (
    <main className="flex flex-col bg-background xl:flex-row">
      <MyCourses />
    </main>
  );
};

export default Dashboard;
