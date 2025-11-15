import { unstable_setRequestLocale } from "next-intl/server";
import { getMetadataLivesPage } from "@/getMetaData";
import { Metadata } from "next";
import LivesClient from "./components/LivesClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataLivesPage({ params });
}

const Lives = ({ params: { locale } }: { params: { locale: string } }) => {
  unstable_setRequestLocale(locale);

  return <LivesClient />;
};

export default Lives;
