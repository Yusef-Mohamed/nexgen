"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CourseSkeleton = () => (
  <div className="w-full container mx-auto sm:py-8 py-6 space-y-6">
    {/* Header skeleton */}
    <div className="flex items-center gap-4 mb-4">
      <Skeleton className="h-10 w-10 rounded-md" />
      <div className="flex items-center gap-3 justify-between w-full flex-1">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>

    {/* Lesson list card skeleton */}
    <Card className="bg-white shadow-lg mb-6">
      <CardContent className="p-6">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-96 mt-2" />
        <Skeleton className="h-10 w-40 mt-4" />
      </CardContent>
    </Card>

    {/* Sections skeleton */}
    <Card className="bg-white shadow-lg">
      <CardContent className="p-6">
        {[1, 2, 3].map((index) => (
          <div key={index} className="mb-8 last:mb-0">
            {/* Section header skeleton */}
            <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>

            {/* Lessons skeleton */}
            <div className="ml-6 space-y-4">
              {[1, 2].map((lessonIndex) => (
                <Card key={lessonIndex} className="mb-3">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default CourseSkeleton;
