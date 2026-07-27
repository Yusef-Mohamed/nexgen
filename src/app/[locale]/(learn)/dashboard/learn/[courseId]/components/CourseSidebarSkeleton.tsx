"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CourseSidebarSkeletonProps {
  className?: string;
  collapsed?: boolean;
}

const CourseSidebarSkeleton: React.FC<CourseSidebarSkeletonProps> = ({
  className,
  collapsed = false,
}) => {
  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen max-h-screen shrink-0 flex-col border-e border-primary/10 bg-clear-ground px-3 transition-[width] duration-300",
        collapsed ? "w-[4.5rem] px-2" : "w-[22rem] max-w-[92vw]",
        className,
      )}
    >
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-primary/10">
        <Skeleton
          className={cn("h-9 rounded-xl", collapsed ? "w-9" : "w-28")}
        />
        {!collapsed && <Skeleton className="size-9 rounded-xl" />}
      </div>

      {!collapsed && (
        <>
          <div className="space-y-3 py-4">
            <Skeleton className="h-4 w-32 rounded-full" />
            <div className="rounded-2xl border border-primary/10 bg-primary-faded p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <Skeleton className="h-4 w-4/5 rounded-full" />
                </div>
              </div>
              <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
              <Skeleton className="mt-3 h-3 w-32 rounded-full" />
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between px-1">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-full" />
            </div>
            <Skeleton className="size-9 rounded-xl" />
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-primary/10 bg-background-2 p-3"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-full" />
                    <Skeleton className="h-3 w-1/2 rounded-full" />
                    <Skeleton className="h-1 w-full rounded-full" />
                  </div>
                  <Skeleton className="size-4 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

export default CourseSidebarSkeleton;
