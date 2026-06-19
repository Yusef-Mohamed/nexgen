import CommunityClient from "@/app/[locale]/dashboard/community/components/CommunityClient";
import DashboardContainer from "@/app/[locale]/dashboard/components/DashboardContainer";
import CommunitySidebar from "@/app/[locale]/dashboard/components/CommunitySidebar";

export const CommunityPageComponent = () => {
  return (
    <main className="relative overflow-hidden !bg-transparent px-3 sm:px-6">
      <DashboardContainer className="relative z-10 grid grid-cols-1 gap-6 py-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <CommunityClient />
        <CommunitySidebar />
      </DashboardContainer>
    </main>
  );
};
