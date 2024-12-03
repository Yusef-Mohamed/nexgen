import { unstable_setRequestLocale } from "next-intl/server";

const Dashboard = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  unstable_setRequestLocale(locale);
  return <main className="flex flex-col xl:flex-row"></main>;
};

export default Dashboard;
