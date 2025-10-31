"use client";

import { Skeleton } from "@/components/ui/skeleton";

const MainSkeleton: React.FC = () => {
  return (
    <main className="flex flex-col px-2 py-6 lg:px-6 sm:px-4 bg-dash-ground">
      <div className="flex justify-center items-center rounded-md bg-muted aspect-video">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    </main>
  );
};

export default MainSkeleton;
