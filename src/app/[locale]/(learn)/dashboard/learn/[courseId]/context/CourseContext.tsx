"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "@/app/lib/utils";
import { ICourse, ILesson } from "@/types";
import { useAuth } from "@/components/auth-provider";

interface CourseContextType {
  sections: {
    section: string;
    lessons: ILesson[];
  }[];
  course: ICourse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  updateSections: (
    newSections: { section: string; lessons: ILesson[] }[],
  ) => void;
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
  const [sections, setSections] = useState<
    {
      section: string;
      lessons: ILesson[];
    }[]
  >([]);
  const [course, setCourse] = useState<ICourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchCourseData = async () => {
    if (!token || !courseId) return;

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

      setCourse(courseRes.data.data as ICourse);
      setSections(sectionsRes.data.data);
    } catch (err) {
      console.error("Error fetching course data:", err);
      setError("Failed to load course data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId, token]);

  const refetch = () => {
    fetchCourseData();
  };

  const updateSections = (
    newSections: { section: string; lessons: ILesson[] }[],
  ) => {
    setSections(newSections);
  };

  const value: CourseContextType = {
    sections,
    course,
    isLoading,
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
