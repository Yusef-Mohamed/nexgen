"use client";
import { Skeleton } from "@/components/ui/skeleton";

const CourseSkeleton = () => (
  <div className="min-h-screen">
    <div className="container mx-auto p-6">
      {/* Course Header Skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex items-center gap-3 justify-between w-full flex-1">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      {/* Lesson List Card Skeleton */}
      <div className="p-6 mb-6">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-full max-w-2xl mt-2" />
        <Skeleton className="h-10 w-40 mt-4" />
      </div>

      {/* Sections Skeleton */}
      <div className="my-10 space-y-8">
        {[1, 2].map((sectionIndex) => (
          <div
            key={sectionIndex}
            className="mb-8 last:mb-0 relative bg-background px-6 py-8 rounded-xl"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-4 h-4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-48" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>

            {/* Expanded Section Content */}
            <div className="space-y-4 mt-8">
              {[1, 2].map((lessonIndex) => (
                <div key={lessonIndex} className="relative">
                  <div className="mb-3 border p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-4 h-4" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-40" />
                          <Skeleton className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </div>

                    {/* Expanded Lesson Content */}
                    <div className="mt-4 pt-4 border-t space-y-2">
                      {/* Assessment Row */}
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-5 h-5" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-6 w-11 rounded-full" />
                        </div>
                      </div>

                      {/* Quiz Row */}
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-5 h-5" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <Skeleton className="h-6 w-11 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Section Button */}
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Add New Section Button */}
      <Skeleton className="h-10 w-40 rounded-md" />
    </div>
  </div>
);

export default CourseSkeleton;
