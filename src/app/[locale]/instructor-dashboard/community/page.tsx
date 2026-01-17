
import { Metadata } from "next";
import { getMetadataCommunityPage } from "@/getMetaData";
import { CommunityPageComponent } from "@/components/CommunityPageComponent";

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataCommunityPage({ params });
}

const CommunityPage = async (
  props: {
    params: Promise<{ locale: string }>;
  }
) => {
  const params = await props.params;

  const {
    locale
  } = params;

  
  return <CommunityPageComponent />;
};

export default CommunityPage;
