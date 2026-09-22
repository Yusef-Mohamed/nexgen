"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { axiosInstance } from "@/app/lib/utils";
import { ICourse, IExamMetadata, ILesson } from "@/types";
import { useAuth } from "@/components/auth-provider";
import { useMyLearningSummary } from "@/hooks/useMyCoursesQueries";
import {
  applyLessonProgression,
  hasUnfinishedRequirements,
} from "../components/unlockLessons";

export interface CourseSection {
  section: string;
  sectionId?: string;
  lessons: ILesson[];
}

export interface LearningSummary {
  sectionsCount: number;
  lessonsCount: number;
  totalDuration: number;
  quizCount: number;
  assignmentCount: number;
}

export interface ProgressRules {
  countVideos: boolean;
}

interface CourseContextType {
  sections: CourseSection[];
  course: ICourse | null;
  courseExam: IExamMetadata;
  learningSummary: LearningSummary;
  totalProgress: number | null;
  progressRules: ProgressRules;
  canTakeFinalExam: boolean;
  passedFinalExam: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  updateSections: (newSections: CourseSection[]) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: React.ReactNode;
  courseId: string;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({
  children,
  courseId,
}) => {
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [course, setCourse] = useState<ICourse | null>(null);
  const [courseExam, setCourseExam] = useState<IExamMetadata>({
    available: false,
    questionsCount: 0,
  });
  const [learningSummary, setLearningSummary] = useState<LearningSummary>({
    sectionsCount: 0,
    lessonsCount: 0,
    totalDuration: 0,
    quizCount: 0,
    assignmentCount: 0,
  });
  const [progressRules, setProgressRules] = useState<ProgressRules>({
    countVideos: false,
  });
  const [canTakeFinalExam, setCanTakeFinalExam] = useState(false);
  const [passedFinalExam, setPassedFinalExam] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();
  const { data: myCourses = [], isLoading: isMyCoursesLoading } =
    useMyLearningSummary(token, user?._id);
  const myCourse = myCourses.find((item) => item._id === courseId);
  const storedProgress = Number(myCourse?.userScore?.totalProgress);
  const totalProgress = Number.isFinite(storedProgress)
    ? Math.min(100, Math.max(0, storedProgress))
    : null;

  const fetchCourseData = useCallback(async () => {
    if (!courseId) return;
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch course details and sections in parallel
      const [courseRes, sectionsRes] = await Promise.all([
        axiosInstance.get(`/courses/${courseId}`),
        axiosInstance.get(`/lessons/sectionLessons/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const courseData = courseRes.data?.data as ICourse;
      const rawSections = sectionsRes.data?.data;
      const normalizedSections: CourseSection[] = Array.isArray(rawSections)
        ? rawSections.map((section) => ({
            section:
              typeof section?.section === "string" ? section.section : "",
            sectionId:
              typeof section?.sectionId === "string"
                ? section.sectionId
                : undefined,
            lessons: Array.isArray(section?.lessons) ? section.lessons : [],
          }))
        : [];
      const gatedSections = applyLessonProgression(normalizedSections);
      const allLessons = gatedSections.flatMap((section) => section.lessons);
      const responseExam = sectionsRes.data?.courseExam;
      const normalizedCourseExam: IExamMetadata = {
        available:
          typeof responseExam?.available === "boolean"
            ? responseExam.available
            : Boolean(
                courseData?.hasQuiz ||
                courseData?.examTitle ||
                courseData?.examQuestionsNumber,
              ),
        title: responseExam?.title || courseData?.examTitle,
        questionsCount: Number.isFinite(Number(responseExam?.questionsCount))
          ? Number(responseExam.questionsCount)
          : Number(courseData?.examQuestionsNumber) || 0,
        passingScore: Number(responseExam?.passingScore) || undefined,
      };
      const responseSummary = sectionsRes.data?.learningSummary;
      const responseProgressRules = sectionsRes.data?.progressRules;

      setCourse({
        ...courseData,
        examTitle: normalizedCourseExam.title || courseData?.examTitle,
        examQuestionsNumber: normalizedCourseExam.questionsCount,
        examAvailable: normalizedCourseExam.available,
        examPassingScore: normalizedCourseExam.passingScore,
      });
      setSections(gatedSections);
      setCourseExam(normalizedCourseExam);
      setCanTakeFinalExam(
        normalizedCourseExam.available &&
          sectionsRes.data?.canTakeFinalExam !== false &&
          allLessons.length > 0 &&
          allLessons.every(
            (lesson) =>
              lesson.isUnlocked !== false && !hasUnfinishedRequirements(lesson),
          ),
      );
      setPassedFinalExam(
        typeof sectionsRes.data?.passedFinalExam === "boolean"
          ? sectionsRes.data.passedFinalExam
          : courseData?.courseProgress?.status === "Completed",
      );
      setProgressRules({
        countVideos: responseProgressRules?.countVideos === true,
      });
      setLearningSummary({
        sectionsCount:
          Number(responseSummary?.sectionsCount) || normalizedSections.length,
        lessonsCount:
          Number(responseSummary?.lessonsCount) || allLessons.length,
        totalDuration:
          Number(responseSummary?.totalDuration) ||
          allLessons.reduce(
            (total, lesson) => total + (Number(lesson.lessonDuration) || 0),
            0,
          ),
        quizCount:
          Number(responseSummary?.quizCount) ||
          allLessons.filter((lesson) => lesson.hasQuiz === true && lesson.examAvailable === true).length,
        assignmentCount:
          Number(responseSummary?.assignmentCount) ||
          allLessons.filter((lesson) => lesson.isRequireAnalytic).length,
      });
    } catch (err) {
      console.error("Error fetching course data:", err);
      setError("Failed to load course data");
    } finally {
      setIsLoading(false);
    }
  }, [courseId, token]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const refetch = fetchCourseData;

  const updateSections = (newSections: CourseSection[]) => {
    const gatedSections = applyLessonProgression(newSections);
    setSections(gatedSections);
    const lessons = gatedSections.flatMap((section) => section.lessons);
    setCanTakeFinalExam(
      courseExam.available &&
        lessons.length > 0 &&
        lessons.every(
          (lesson) =>
            lesson.isUnlocked !== false && !hasUnfinishedRequirements(lesson),
        ),
    );
  };

  const value: CourseContextType = {
    sections,
    course,
    courseExam,
    learningSummary,
    totalProgress,
    progressRules,
    canTakeFinalExam,
    passedFinalExam,
    isLoading: isLoading || isMyCoursesLoading,
    error,
    refetch,
    updateSections,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

export const useCourseContext = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
};

// Safe version that returns null when not in provider
export const useCourseContextSafe = (): CourseContextType | null => {
  const context = useContext(CourseContext);
  return context ?? null;
};
