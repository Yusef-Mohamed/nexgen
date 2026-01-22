import CommunityClient from "@/app/[locale]/dashboard/community/components/CommunityClient";
import CommunitySidebar from "@/app/[locale]/dashboard/components/CommunitySidebar";

export const CommunityPageComponent = () => {
  return (
    <main className="relative bg-background">
      <div className="flex z-10 justify-center relative flex-col-reverse xl:flex-row">
        <CommunityClient />
        <CommunitySidebar />
      </div>
    </main>
  );
};
