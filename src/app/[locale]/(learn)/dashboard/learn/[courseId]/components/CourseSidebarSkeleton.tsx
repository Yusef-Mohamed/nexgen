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
        "py-4 pt-0 flex flex-col bg-background-2 h-screen overflow-auto max-h-screen top-0 sticky transition-all duration-300",
        collapsed ? "w-16 px-2 pt-4" : "w-md px-3 sm:px-6",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header with Logo skeleton */}
        <div className="flex justify-between h-[76px] items-center flex-wrap mb-4 gap-4">
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {!collapsed && (
          <>
            {/* Back to Learning Button skeleton */}
            <div className="flex items-center gap-3 px-4 py-3 mb-6">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-5 w-40 rounded-lg" />
            </div>

            {/* Course Sections skeleton */}
            <nav className="flex-1 overflow-y-auto pr-1">
              <ul className="space-y-6">
                {Array.from({ length: 3 }).map((_, sectionIndex) => (
                  <li
                    key={sectionIndex}
                    className="space-y-4 p-4 border bg-primary/5 border-primary/30 rounded-2xl"
                  >
                    {/* Section Header skeleton */}
                    <div className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Skeleton className="size-12 rounded-xl shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-5 w-48 mb-2 rounded-lg" />
                          <Skeleton className="h-4 w-32 rounded-lg" />
                        </div>
                      </div>
                      <Skeleton className="size-8 rounded-full" />
                    </div>

                    {/* Lessons skeleton - shown for the first one by default in skeleton */}
                    {sectionIndex === 0 && (
                      <ul className="space-y-4 px-1">
                        {Array.from({ length: 2 }).map((_, lessonIndex) => (
                          <li
                            key={lessonIndex}
                            className="space-y-5 bg-background p-3 rounded-2xl shadow-sm"
                          >
                            {/* Lesson Card skeleton */}
                            <div className="w-full flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <Skeleton className="size-10 rounded-xl shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <Skeleton className="h-5 w-3/4 mb-1 rounded-lg" />
                                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                                </div>
                              </div>
                              <Skeleton className="size-8 rounded-full" />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </div>
    </aside>
  );
};

export default CourseSidebarSkeleton;
