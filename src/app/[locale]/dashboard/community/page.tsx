import { unstable_setRequestLocale } from "next-intl/server";
import CommunityClient from "./components/CommunityClient";
import { Metadata } from "next";
import { getMetadataCommunityPage } from "@/getMetaData";
import CommunitySidebar from "../components/CommunitySidebar";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataCommunityPage({ params });
}

const CommunityPage = ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  unstable_setRequestLocale(locale);
  return (
    <main className="flex flex-col bg-background xl:flex-row">
      <CommunityClient />
      <CommunitySidebar />
    </main>
  );
};

export default CommunityPage;
