import { unstable_setRequestLocale } from "next-intl/server";
import DisplayPosts from "./components/DisplayPosts";

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
      <DisplayPosts />
    </main>
  );
};

export default Dashboard;
