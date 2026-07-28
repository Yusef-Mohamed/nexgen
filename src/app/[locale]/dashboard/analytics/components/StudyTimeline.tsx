import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Check,
  Circle,
  LockKeyhole,
  Play,
  RefreshCw,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getDynamicString } from "@/lib/utils";
import {
  AnalyticsTimelineCourse,
  AnalyticsTimelineState,
} from "@/hooks/useAnalyticsStudyTimeline";

type StudyTimelineProps = {
  courses: AnalyticsTimelineCourse[];
  hasCategory: boolean;
  isLoading: boolean;
  isError: boolean;
  selectedCourse: string;
  onRetry: () => void;
  onSelectCourse: (courseId: string) => void;
};

const stateStyles: Record<
  AnalyticsTimelineState,
  { node: string; card: string; progress: string }
> = {
  completed: {
    node: "border-emerald-500 bg-emerald-500 text-white",
    card: "border-emerald-500/20 bg-emerald-500/[0.06]",
    progress: "bg-emerald-500",
  },
  inProgress: {
    node: "border-primary bg-primary text-clear-ground",
    card: "border-primary/25 bg-primary/[0.06]",
    progress: "bg-primary",
  },
  notStarted: {
    node: "border-primary/20 bg-background-2 text-text-3",
    card: "border-primary/10 bg-background-2",
    progress: "bg-text-3/35",
  },
  locked: {
    node: "border-dashed border-text-3/25 bg-muted text-text-3",
    card: "border-dashed border-text-3/20 bg-muted/35",
    progress: "bg-text-3/20",
  },
};

const StateIcon = ({ state }: { state: AnalyticsTimelineState }) => {
  if (state === "completed") return <Check className="size-4" />;
  if (state === "inProgress") return <Play className="size-3.5 fill-current" />;
  if (state === "locked") return <LockKeyhole className="size-3.5" />;
  return <Circle className="size-3" />;
};

const StudyTimeline = ({
  courses,
  hasCategory,
  isLoading,
  isError,
  selectedCourse,
  onRetry,
  onSelectCourse,
}: StudyTimelineProps) => {
  const text = useTranslations("analytics");

  return (
    <div className="border-t border-primary/10 pt-4">
      <div className="mb-4 flex items-start gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Route className="size-4" />
        </span>
        <div>
          <h2 className="text-sm font-black text-text-1">
            {text("studyTimeline")}
          </h2>
          <p className="mt-1 text-xs leading-5 text-text-3">
            {text("studyTimelineDescription")}
          </p>
        </div>
      </div>

      {!hasCategory && (
        <TimelineMessage>{text("noOwnedCourses")}</TimelineMessage>
      )}

      {hasCategory && isLoading && <TimelineSkeleton />}

      {hasCategory && isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center">
          <p className="text-sm text-destructive">
            {text("timelineLoadError")}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 min-w-0 gap-2"
            onClick={onRetry}
          >
            <RefreshCw className="size-3.5" />
            {text("tryAgain")}
          </Button>
        </div>
      )}

      {hasCategory && !isLoading && !isError && courses.length === 0 && (
        <TimelineMessage>{text("noCoursesInCategory")}</TimelineMessage>
      )}

      {hasCategory && !isLoading && !isError && courses.length > 0 && (
        <div>
          {courses.map((course, index) => {
            const styles = stateStyles[course.state];
            const isSelected = selectedCourse === course._id;
            const title = getDynamicString(course.title);

            return (
              <div
                key={course._id}
                className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 pb-3 last:pb-0"
              >
                {index < courses.length - 1 && (
                  <span className="absolute bottom-0 start-[1.22rem] top-10 w-px bg-primary/15" />
                )}
                <span
                  className={cn(
                    "relative z-[1] inline-flex size-10 items-center justify-center rounded-full border-2 shadow-sm",
                    styles.node,
                  )}
                >
                  <StateIcon state={course.state} />
                </span>
                <button
                  type="button"
                  disabled={!course.isOwned}
                  onClick={() => onSelectCourse(course._id)}
                  className={cn(
                    "group w-full overflow-hidden rounded-xl border p-3 text-start transition duration-200",
                    styles.card,
                    course.isOwned &&
                      "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-sm",
                    isSelected &&
                      "border-primary ring-2 ring-primary/15 ring-offset-1 ring-offset-background",
                    !course.isOwned && "cursor-not-allowed",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {course.image ? (
                        <Image
                          src={course.image}
                          alt=""
                          width={96}
                          height={96}
                          unoptimized
                          className={cn(
                            "size-full object-cover",
                            !course.isOwned && "grayscale",
                          )}
                        />
                      ) : (
                        <div className="size-full bg-gradient-to-br from-primary/15 to-primary/5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-bold leading-5 text-text-1">
                        {title}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] font-bold">
                        <span
                          className={cn(
                            course.state === "completed" &&
                              "text-emerald-600 dark:text-emerald-400",
                            course.state === "inProgress" && "text-primary",
                            (course.state === "notStarted" ||
                              course.state === "locked") &&
                              "text-text-3",
                          )}
                        >
                          {text(course.state)}
                        </span>
                        {course.isOwned && (
                          <span className="text-text-3">
                            {Math.round(course.progress)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {course.isOwned ? (
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary/10">
                      <div
                        className={cn(
                          "h-full rounded-full transition-[width] duration-500",
                          styles.progress,
                        )}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  ) : (
                    <p className="mt-2 text-xs leading-5 text-text-3">
                      {text("lockedCourseDescription")}
                    </p>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TimelineMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-dashed border-primary/15 bg-background-2/60 px-4 py-8 text-center text-sm leading-6 text-text-3">
    {children}
  </div>
);

const TimelineSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="grid animate-pulse grid-cols-[2.5rem_minmax(0,1fr)] gap-3"
      >
        <div className="size-10 rounded-full bg-muted" />
        <div className="h-24 rounded-xl bg-muted" />
      </div>
    ))}
  </div>
);

export default StudyTimeline;
