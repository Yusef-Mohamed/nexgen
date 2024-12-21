import { unstable_setRequestLocale } from "next-intl/server";
import DisplayCourses from "./components/DisplayCourses";

const Dashboard = async ({
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
      className="flex flex-col px-2 py-6 lg:px-6 sm:px-4"
    >
      <DisplayCourses />
    </main>
  );
};

export default Dashboard;
