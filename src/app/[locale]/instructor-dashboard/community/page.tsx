import { unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { getMetadataCommunityPage } from "@/getMetaData";
import { CommunityPageComponent } from "@/components/CommunityPageComponent";

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
  return <CommunityPageComponent />;
};

export default CommunityPage;
