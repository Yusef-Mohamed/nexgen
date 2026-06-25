"use client";

import { Skeleton } from "@/components/ui/skeleton";

const MainSkeleton: React.FC = () => {
  return (
    <main className="flex flex-col bg-background px-3 py-6 sm:px-5 lg:px-6">
      <div className="flex aspect-video items-center justify-center rounded-2xl border border-primary/10 bg-clear-ground shadow-sm">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto h-4 w-48" />
        </div>
      </div>
    </main>
  );
};

export default MainSkeleton;
