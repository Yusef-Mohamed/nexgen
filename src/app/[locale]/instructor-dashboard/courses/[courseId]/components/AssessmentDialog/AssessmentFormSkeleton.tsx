import { Skeleton } from "@/components/ui/skeleton";

const AssessmentFormSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Assignment Title Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Assignment Description Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>

      {/* Assignment File */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
};

export default AssessmentFormSkeleton;
