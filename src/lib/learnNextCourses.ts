import { ICourse } from "@/types";

export type NextCoursesShowOn =
  | "completed_only"
  | "not_completed_only"
  | "both";

export const DEFAULT_NEXT_COURSE_PROGRESS_THRESHOLD = 50;

export function getCourseProgressPercent(course: ICourse): number {
  const raw = course.userScore?.totalProgress ?? course.totalProgress ?? 0;
  const value = typeof raw === "string" ? parseInt(raw, 10) : Number(raw);
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

export function isCourseCompleted(course: ICourse): boolean {
  return course.courseProgress?.status === "Completed";
}

export function shouldShowNextCoursesOnTab(
  tab: "completed" | "notCompleted",
  showOn: NextCoursesShowOn,
): boolean {
  if (showOn === "both") return true;
  if (showOn === "completed_only") return tab === "completed";
  return tab === "notCompleted";
}

export function getUnlockableNextCourses(
  course: ICourse,
  ownedCourseIds: Set<string>,
  progressThreshold = DEFAULT_NEXT_COURSE_PROGRESS_THRESHOLD,
): ICourse[] {
  if (!course.nextCourses?.length) return [];
  if (getCourseProgressPercent(course) < progressThreshold) return [];

  return course.nextCourses.filter((next) => {
    const id = next._id || next.id;
    return id && !ownedCourseIds.has(id);
  });
}

/** Collect unique unlockable next courses from all parent courses. */
export function collectUnlockableNextCourses(
  parentCourses: ICourse[],
  ownedCourseIds: Set<string>,
  progressThreshold = DEFAULT_NEXT_COURSE_PROGRESS_THRESHOLD,
): ICourse[] {
  const seen = new Set<string>();
  const result: ICourse[] = [];

  for (const parent of parentCourses) {
    for (const next of getUnlockableNextCourses(
      parent,
      ownedCourseIds,
      progressThreshold,
    )) {
      const id = next._id || next.id;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      result.push(next);
    }
  }

  return result;
}
