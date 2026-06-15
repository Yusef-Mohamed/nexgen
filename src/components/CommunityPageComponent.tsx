import CommunityClient from "@/app/[locale]/dashboard/community/components/CommunityClient";
import CommunitySidebar from "@/app/[locale]/dashboard/components/CommunitySidebar";

export const CommunityPageComponent = () => {
  return (
    <main className="relative overflow-hidden bg-background-2">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 end-12 size-72 rounded-full bg-primary/10 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-72 start-8 size-64 rounded-full bg-secondary/10 blur-[110px]"
      />
      <div className="relative z-10 mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-6 px-4 py-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <CommunityClient />
        <CommunitySidebar />
      </div>
    </main>
  );
};
