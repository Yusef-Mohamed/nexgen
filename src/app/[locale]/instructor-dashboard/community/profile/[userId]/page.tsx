
import { Metadata } from "next";
import { getMetadataCommunityPage } from "@/getMetaData";
import UserProfileComponent from "@/components/UserProfileComponent";
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
    params: Promise<{ locale: string; userId: string }>;
  }
) => {
  const params = await props.params;

  const {
    locale,
    userId
  } = params;

  
  return (
    <UserProfileComponent
      userId={userId}
      locale={locale}
      isInstructorDashboard={false}
    />
  );
};

export default CommunityPage;
