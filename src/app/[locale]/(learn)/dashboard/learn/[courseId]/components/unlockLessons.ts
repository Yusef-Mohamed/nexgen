import type { ILesson } from "@/types";

const PLACEHOLDER_VIDEO_URL = "unlocked";

interface Section {
  section: string;
  lessons: ILesson[];
}

export function hasUnfinishedRequirements(lesson: ILesson): boolean {
  return Boolean(
    ((lesson.examAvailable ?? lesson.hasQuiz) && !lesson.passedExam) ||
    (lesson.isRequireAnalytic && !lesson.passedAnalyticsTask),
  );
}

/** Apply the gate on every course load and state update, across all sections. */
export function applyLessonProgression<T extends Section>(
  sections: T[],
  allowUnlock = false,
): T[] {
  const updatedSections = sections.map((section) => ({
    ...section,
    lessons: section.lessons.map((lesson) => ({ ...lesson })),
  }));
  const lessons = updatedSections
    .flatMap((section) => section.lessons)
    .sort((left, right) => left.order - right.order);
  let unlocked = true;
  for (const lesson of lessons) {
    // On initial load, retain any additional access restriction from the server.
    if (!allowUnlock && lesson.isUnlocked === false) unlocked = false;
    lesson.isUnlocked = unlocked;
    if (!unlocked) lesson.videoUrl = undefined;
    else if (allowUnlock) lesson.videoUrl ||= PLACEHOLDER_VIDEO_URL;
    if (hasUnfinishedRequirements(lesson)) unlocked = false;
  }
  return updatedSections;
}

/** Called only after a successful quiz or assignment submission. */
export function unlockLessonsSequentially<T extends Section>(
  sections: T[],
  currentLessonId: string,
): T[] {
  if (
    !sections.some((section) =>
      section.lessons.some((lesson) => lesson._id === currentLessonId),
    )
  )
    return sections;
  return applyLessonProgression(sections, true);
}

export function isLearningSelectionLocked(
  lessons: ILesson[],
  lessonId: string | null,
  display: string | null,
  canTakeFinalExam: boolean,
): boolean {
  if (display === "final_exam") return !canTakeFinalExam;
  if (display !== "lesson" && display !== "quiz" && display !== "practice")
    return false;
  const lesson = lessons.find((item) => item._id === lessonId);
  if (!lesson || lesson.isUnlocked === false || !lesson.videoUrl) return true;
  if (display === "quiz") return !(lesson.examAvailable ?? lesson.hasQuiz);
  if (display === "practice") return !lesson.isRequireAnalytic;
  return false;
}

export { PLACEHOLDER_VIDEO_URL };
