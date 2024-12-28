import { unstable_setRequestLocale } from "next-intl/server";
import TeamManagement from "../components/TeamManagement";

const SalesAnalyticsPage = async ({
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
      className="px-2 py-6 lg:px-6 sm:px-4 "
    >
      <TeamManagement />
    </main>
  );
};

export default SalesAnalyticsPage;
