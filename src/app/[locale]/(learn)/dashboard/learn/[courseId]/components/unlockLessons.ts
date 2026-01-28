import { ILesson } from "@/types";

const PLACEHOLDER_VIDEO_URL = "unlocked";

interface Section {
  section: string;
  lessons: ILesson[];
}

/**
 * Unlocks lessons sequentially starting from the current lesson
 * until hitting a blocking lesson (has isRequireAnalytic or hasQuiz true).
 * The blocking lesson is also unlocked, then stops.
 *
 * @param sections - Array of sections with lessons
 * @param currentLessonId - ID of the current lesson
 * @param checkForNoQuiz - If true, only proceed if lesson.hasQuiz === false (for practice)
 * @param skipUnlockNextIfCurrentHasAssignment - If true and the current lesson has an assignment, only unlock the current lesson and do not unlock the next one (e.g. when quiz is done but assignment must be completed first)
 * @returns Updated sections array with unlocked lessons
 */
export function unlockLessonsSequentially(
  sections: Section[],
  currentLessonId: string,
  checkForNoQuiz: boolean = false,
  skipUnlockNextIfCurrentHasAssignment: boolean = false
): Section[] {
  if (!sections || sections.length === 0) {
    return sections;
  }

  // Flatten all lessons and find current lesson
  const allLessons: Array<{
    lesson: ILesson;
    sectionIndex: number;
    lessonIndex: number;
  }> = [];
  sections.forEach((section, sectionIndex) => {
    if (Array.isArray(section.lessons)) {
      section.lessons.forEach((lesson, lessonIndex) => {
        allLessons.push({ lesson, sectionIndex, lessonIndex });
      });
    }
  });

  // Sort by order to maintain sequence
  const sortedLessons = [...allLessons].sort(
    (a, b) => a.lesson.order - b.lesson.order
  );

  // Find current lesson index
  const currentLessonIndex = sortedLessons.findIndex(
    (item) => item.lesson._id === currentLessonId
  );

  if (currentLessonIndex === -1) {
    return sections;
  }

  const currentLessonItem = sortedLessons[currentLessonIndex];
  const currentLesson = currentLessonItem.lesson;

  // Create a deep copy of sections to avoid mutating original
  const updatedSections = sections.map((section) => ({
    ...section,
    lessons: section.lessons.map((lesson) => ({ ...lesson })),
  }));

  // Always unlock current lesson
  const currentSection = updatedSections[currentLessonItem.sectionIndex];
  if (currentSection && currentSection.lessons[currentLessonItem.lessonIndex]) {
    currentSection.lessons[currentLessonItem.lessonIndex].videoUrl =
      PLACEHOLDER_VIDEO_URL;
  }

  // For practice (checkForNoQuiz): do not unlock *next* lessons if current has a quiz
  if (checkForNoQuiz && currentLesson.hasQuiz && !currentLesson.passedExam) {
    return updatedSections;
  }

  // If current lesson has an unfinished assignment/practice, do not unlock the next lesson
  // - isRequireAnalytic + !passedAnalyticsTask = unfinished practice (analytic task)
  // - assignmentTitle/assignmentFile + !assignmentDone = unfinished assignment
  if (skipUnlockNextIfCurrentHasAssignment) {
    const hasUnfinishedPractice =
      currentLesson.isRequireAnalytic && !currentLesson.passedAnalyticsTask;
    const hasUnfinishedAssignment =
      (currentLesson.assignmentTitle || currentLesson.assignmentFile) &&
      currentLesson.assignmentDone !== true;
    if (hasUnfinishedPractice || hasUnfinishedAssignment) {
      return updatedSections;
    }
  }

  // Iterate through next lessons
  for (let i = currentLessonIndex + 1; i < sortedLessons.length; i++) {
    const nextItem = sortedLessons[i];
    const nextLesson = nextItem.lesson;

    // Unlock this lesson
    const targetSection = updatedSections[nextItem.sectionIndex];
    if (targetSection && targetSection.lessons[nextItem.lessonIndex]) {
      targetSection.lessons[nextItem.lessonIndex].videoUrl =
        PLACEHOLDER_VIDEO_URL;
    }

    // Check if this is a blocking lesson (unlock it, then stop)
    if (nextLesson.isRequireAnalytic || nextLesson.hasQuiz) {
      break;
    }
  }

  return updatedSections;
}

export { PLACEHOLDER_VIDEO_URL };
