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
        "py-4 pt-0 flex flex-col bg-clear-ground h-screen overflow-auto max-h-screen top-0 sticky transition-all duration-300",
        collapsed ? "w-16 px-2 pt-4" : "w-[28rem] px-3 sm:px-6",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header with Logo skeleton */}
        <div className="flex justify-between h-[76px] items-center flex-wrap mb-4 gap-4">
          <Skeleton className="h-8 w-32" />
        </div>

        {!collapsed && (
          <>
            {/* Back to Learning Button skeleton */}
            <div className="flex items-center gap-3 px-4 py-3 mb-4">
              <Skeleton className="size-11 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>

            {/* Course Sections skeleton */}
            <nav>
              <ul className="space-y-2">
                {Array.from({ length: 3 }).map((_, sectionIndex) => (
                  <li key={sectionIndex} className="space-y-1">
                    {/* Section Header skeleton */}
                    <div className="w-full flex items-center justify-between p-4 rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Skeleton className="w-5 h-5 rounded" />
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-4 w-40 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="w-5 h-5 rounded" />
                    </div>

                    {/* Lessons skeleton */}
                    <ul className="space-y-1 mt-1">
                      {Array.from({ length: 2 }).map((_, lessonIndex) => (
                        <li key={lessonIndex} className="space-y-1">
                          {/* Video Lesson skeleton */}
                          <div className="w-full flex items-center justify-between gap-2 p-3 rounded-lg">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Skeleton className="w-5 h-5 rounded-full" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                          </div>

                          {/* Quiz skeleton */}
                          <div className="w-full flex items-center justify-between gap-2 p-3 rounded-lg">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Skeleton className="w-5 h-5 rounded" />
                              <Skeleton className="h-4 w-28" />
                            </div>
                          </div>

                          {/* Practice skeleton */}
                          <div className="w-full flex items-center justify-between gap-2 p-3 rounded-lg">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Skeleton className="w-5 h-5 rounded" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
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
