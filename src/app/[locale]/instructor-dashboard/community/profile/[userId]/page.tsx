import { unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { getMetadataCommunityPage } from "@/getMetaData";
import UserProfileComponent from "@/components/UserProfileComponent";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataCommunityPage({ params });
}
const CommunityPage = async ({
  params: { locale, userId },
}: {
  params: { locale: string; userId: string };
}) => {
  unstable_setRequestLocale(locale);
  return (
    <UserProfileComponent
      userId={userId}
      locale={locale}
      isInstructorDashboard={false}
    />
  );
};

export default CommunityPage;
