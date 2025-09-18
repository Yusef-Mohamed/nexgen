import { Skeleton } from "@/components/ui/skeleton";

const LessonFormSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Title Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Description Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Video URL */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Attachments */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
};

export default LessonFormSkeleton;
