import CommunityClient from "@/app/[locale]/dashboard/community/components/CommunityClient";
import CommunitySidebar from "@/app/[locale]/dashboard/components/CommunitySidebar";

export const CommunityPageComponent = () => {
  return (
    <main className="relative bg-background">
      <div className="absolute top-0 left-0 size-48 bg-primary/20 blur-3xl rounded-full z-10"></div>
      <div className="absolute bottom-0 right-0 size-48 bg-secondary/20 blur-3xl rounded-full z-10"></div>
      <div className="flex z-10 relative flex-col-reverse xl:flex-row">
        <CommunityClient />
        <CommunitySidebar />
      </div>
    </main>
  );
};
