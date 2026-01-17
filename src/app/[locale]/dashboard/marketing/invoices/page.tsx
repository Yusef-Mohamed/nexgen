
import { Metadata } from "next";
import { getMetadataDashboardPage } from "@/getMetaData";
import InvoicesManagement from "../components/InvoicesManagement";
export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataDashboardPage({
    params,
  });
}
const SalesAnalyticsPage = async (
  props: {
    params: Promise<{ locale: string }>;
  }
) => {
  const params = await props.params;

  const {
    locale
  } = params;

  
  return (
    <main
      style={{
        minHeight: "calc(100vh - 76px)",
      }}
      className="w-full max-w-full px-2 py-6 overflow-hidden lg:px-6 sm:px-4 bg-dash-ground"
    >
      <InvoicesManagement />
    </main>
  );
};

export default SalesAnalyticsPage;
