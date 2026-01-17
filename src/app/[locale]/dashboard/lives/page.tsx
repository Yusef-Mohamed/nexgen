
import { getMetadataLivesPage } from "@/getMetaData";
import { Metadata } from "next";
import LivesClient from "./components/LivesClient";

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataLivesPage({ params });
}

const Lives = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;

  const {
    locale
  } = params;

  

  return <LivesClient />;
};

export default Lives;
