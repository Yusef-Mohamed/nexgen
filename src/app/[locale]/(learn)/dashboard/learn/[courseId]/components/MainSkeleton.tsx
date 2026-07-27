"use client";

import { Skeleton } from "@/components/ui/skeleton";

const MainSkeleton: React.FC = () => {
  return (
    <main className="min-h-[calc(100vh-72px)] px-3 py-5 sm:px-5 lg:px-6 lg:py-8">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <section className="rounded-3xl border border-primary/10 bg-primary-faded p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-7 w-36 rounded-full" />
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <Skeleton className="h-5 w-full max-w-2xl rounded-full" />
            </div>
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-primary/10 bg-clear-ground p-2 cardShadowSm sm:p-3">
          <Skeleton className="aspect-video w-full rounded-2xl" />
        </section>

        <section className="rounded-3xl border border-primary/10 bg-clear-ground p-5">
          <Skeleton className="h-10 w-56 rounded-full" />
          <Skeleton className="mt-5 h-32 w-full rounded-2xl" />
        </section>
      </div>
    </main>
  );
};

export default MainSkeleton;
