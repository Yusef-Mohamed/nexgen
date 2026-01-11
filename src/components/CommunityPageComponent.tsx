import CommunityClient from "@/app/[locale]/dashboard/community/components/CommunityClient";
import CommunitySidebar from "@/app/[locale]/dashboard/components/CommunitySidebar";

export const CommunityPageComponent = () => {
  return (
    <main className="flex flex-col-reverse bg-background xl:flex-row">
      <CommunityClient />
      <CommunitySidebar />
    </main>
  );
};
