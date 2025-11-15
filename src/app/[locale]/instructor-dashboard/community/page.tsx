import { unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { getMetadataCommunityPage } from "@/getMetaData";
import CommunityClient from "../../dashboard/community/components/CommunityClient";
import CommunitySidebar from "../../dashboard/components/CommunitySidebar";

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
