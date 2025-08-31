"use client";
import { useState, useEffect } from "react";
import { ICourse, ISection, ILesson } from "@/types";
import { useAuth } from "@/components/auth-provider";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { AxiosError } from "axios";

export const useCourseDetail = (courseId: string) => {
  const { token } = useAuth();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [sections, setSections] = useState<ISection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  // Fetch course and sections data
  const fetchData = async () => {
    try {
      setLoading(true);

      const axiosInstance = createClientAxiosInstance();
      // Fetch course data
      const courseResponse = await axiosInstance.get(`/courses/${courseId}`);
      setCourse(courseResponse.data.data);

      // Fetch sections and lessons with authentication - handle errors gracefully
      try {
        const sectionsResponse = await axiosInstance.get(
          `/lessons/sectionLessons/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSections(sectionsResponse.data.data);

        // Expand first section by default
        if (sectionsResponse.data.data.length > 0) {
          const first = sectionsResponse.data.data[0] as ISection & {
            sectionId?: string;
            id?: string;
          };
          const firstId = first.sectionId || first._id || first.id;
          if (firstId) {
            setExpandedSections(new Set([firstId]));
          }
        }
      } catch (sectionsError) {
        console.error("Error fetching sections and lessons:", sectionsError);
        setSections([]);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Update sections with new data from response
  const updateSections = (sectionData: ISection, isEdit: boolean) => {
    console.log(`Section ${isEdit ? "updated" : "created"}:`, sectionData);
    const getId = (s: ISection & { sectionId?: string; id?: string }) =>
      s.sectionId || s._id || s.id;
    if (isEdit) {
      setSections(
        sections.map((section) =>
          getId(section) ===
          getId(sectionData as ISection & { sectionId?: string; id?: string })
            ? sectionData
            : section
        )
      );
    } else {
      setSections([...sections, sectionData]);
    }
    // For now, just log the data without updating the state
    // You can implement state update logic here later if needed
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Update course
  const updateCourse = (updatedCourse?: ICourse) => {
    if (updatedCourse) {
      setCourse(updatedCourse);
    } else {
      window.location.reload();
    }
  };

  // Add lesson to a section by id
  const addLessonToSection = (sectionId: string, lesson: ILesson) => {
    setSections((prev) =>
      prev.map((s: ISection & { sectionId?: string; id?: string }) => {
        const id = s.sectionId || s._id || s.id;
        if (id === sectionId) {
          const currentLessons = Array.isArray(s.lessons) ? s.lessons : [];
          return { ...s, lessons: [...currentLessons, lesson] } as ISection;
        }
        return s;
      })
    );
  };

  // Update lesson in whichever section contains it
  const updateLessonInSections = (lesson: ILesson) => {
    setSections((prev) =>
      prev.map((s) => {
        const currentLessons = Array.isArray(s.lessons) ? s.lessons : [];
        const idx = currentLessons.findIndex((l) => l._id === lesson._id);
        if (idx >= 0) {
          const nextLessons = [...currentLessons];
          nextLessons[idx] = lesson;
          return { ...s, lessons: nextLessons } as ISection;
        }
        return s;
      })
    );
  };

  // Delete lesson by id (API + local state update)
  const deleteLessonById = async (
    lessonId: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: "No authentication token" };
    try {
      const axiosInstance = createClientAxiosInstance();
      await axiosInstance.delete(`/lessons/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          lessons: (s.lessons || []).filter((l) => l._id !== lessonId),
        }))
      );
      return { success: true };
    } catch (error) {
      console.error("Error deleting lesson:", error);
      const typedError = error as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message ||
        typedError?.message ||
        "Failed to delete lesson";
      console.error("Server error:", errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete a section by id and update local state
  const deleteSectionById = async (
    sectionId: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: "No authentication token" };
    try {
      const axiosInstance = createClientAxiosInstance();
      await axiosInstance.delete(`/sections/${sectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from sections list
      setSections((prev) =>
        prev.filter(
          (s: ISection & { sectionId?: string; id?: string }) =>
            (s.sectionId || s._id || s.id) !== sectionId
        )
      );
      // Collapse if it was expanded
      setExpandedSections((prev) => {
        const next = new Set(prev);
        next.delete(sectionId);
        return next;
      });
      return { success: true };
    } catch (error) {
      console.error("Error deleting section:", error);
      const typedError = error as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message ||
        typedError?.message ||
        "Failed to delete section";
      console.error("Server error:", errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Initialize data when component mounts
  useEffect(() => {
    if (courseId && token) {
      fetchData();
    }
  }, [courseId, token]);

  return {
    // State
    course,
    sections,
    loading,
    error,
    expandedSections,

    // Actions
    updateSections,
    toggleSection,
    updateCourse,
    deleteSectionById,
    addLessonToSection,
    updateLessonInSections,
    deleteLessonById,
  };
};
