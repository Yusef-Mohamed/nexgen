"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ILesson, ISection } from "@/types";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import SectionEditDialog from "./SectionEditDialog";
import LessonEditDialog from "./LessonEditDialog";
import { useCourseDetail } from "../hooks/useCourseDetail";
import { useReorder } from "../hooks/useReorder";
import { toast } from "react-toastify";

// Import new components
import CourseHeader from "./CourseHeader";
import CourseSkeleton from "./CourseSkeleton";
import LessonListCard from "./LessonListCard";
import SectionItem from "./SectionItem";
import DeleteConfirmationDialogs from "./DeleteConfirmationDialogs";
import { axiosInstance } from "@/app/lib/utils";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";

const CourseDetailClient = () => {
  const text = useTranslations("courses");
  const postActionText = useTranslations("postAction");
  const coursesText = useTranslations("courses");
  const params = useParams();
  const courseId = params.courseId as string;
  const { token } = useAuth();
  const router = useRouter();

  // Use the custom hook for all course detail logic
  const {
    course,
    sections,
    loading,
    error,
    expandedSections,
    updateSections,
    updateSectionsOrder,
    toggleSection,
    deleteSectionById,
    addLessonToSection,
    updateLessonInSections,
    deleteLessonById,
  } = useCourseDetail(courseId);

  // Track if order has changed
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Use the reorder hook for drag and drop functionality
  const {
    dropTarget,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    handleDrop,
  } = useReorder({
    sections,
    onSectionsReorder: updateSectionsOrder,
    onOrderChanged: () => setHasOrderChanged(true),
  });

  // Dialog states
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<ISection | null>(null);
  const [isEditSection, setIsEditSection] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ILesson | null>(null);
  const [isEditLesson, setIsEditLesson] = useState(false);
  const [activeSectionIdForLesson, setActiveSectionIdForLesson] =
    useState<string>("");
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(
    null
  );
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingLesson, setIsDeletingLesson] = useState(false);

  // Show loading state
  if (loading || !token) {
    return <CourseSkeleton />;
  }

  // Show error state
  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto p-6">
          <div className="max-w-md mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {text("course_load_error_title")}
            </h1>

            {/* Error Description */}
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {text("course_load_error_description")}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="px-6 py-2"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {text("try_again")}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/instructor-dashboard/courses")}
                className="px-6 py-2"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                {text("go_back")}
              </Button>
            </div>

            {/* Additional Help */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                {text("still_having_trouble")}
              </p>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-primary hover:text-primary/80"
              >
                <Link href="/contact">{text("contact_support")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleEditSection = (sectionId: string) => {
    // Find the section data from the sections array
    const sectionData = sections.find(
      (s) =>
        (s as ISection & { sectionId?: string }).sectionId === sectionId ||
        s._id === sectionId
    );
    if (sectionData) {
      setEditingSection(sectionData);
      setIsEditSection(true);
      setSectionDialogOpen(true);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    setDeletingSectionId(sectionId);
  };

  const confirmDeleteSection = async () => {
    if (!deletingSectionId) return;
    try {
      setIsDeleting(true);
      const result = await deleteSectionById(deletingSectionId);
      if (result.success) {
        toast.success(postActionText("delete_success"));
      } else {
        toast.error(result.error || postActionText("something_wrong"));
      }
    } finally {
      setIsDeleting(false);
      setDeletingSectionId(null);
    }
  };

  const handleEditLesson = (lessonId: string) => {
    // Find the lesson in sections data
    let foundLesson: ILesson | null = null;
    let foundSectionIndex = -1;

    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex];
      const lessonIndex =
        section?.lessons?.findIndex((l) => l._id === lessonId) ?? -1;
      if (lessonIndex !== -1) {
        foundLesson = section.lessons![lessonIndex];
        foundSectionIndex = sectionIndex;
        break;
      }
    }

    if (foundLesson) {
      setEditingLesson(foundLesson);
      setIsEditLesson(true);
      setActiveSectionIdForLesson(
        sections[foundSectionIndex]?.sectionId ||
          sections[foundSectionIndex]?._id ||
          ""
      );
      setLessonDialogOpen(true);
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    setDeletingLessonId(lessonId);
  };

  const confirmDeleteLesson = async () => {
    if (!deletingLessonId) return;
    try {
      setIsDeletingLesson(true);
      const result = await deleteLessonById(deletingLessonId);
      if (result.success) {
        toast.success(postActionText("delete_success"));
      } else {
        toast.error(result.error || postActionText("something_wrong"));
      }
    } finally {
      setIsDeletingLesson(false);
      setDeletingLessonId(null);
    }
  };

  const handleEdit = () => {
    router.push(
      `/instructor-dashboard/courses/course-form?courseId=${courseId}`
    );
  };

  const handleAddNewSection = () => {
    setEditingSection(null);
    setIsEditSection(false);
    setSectionDialogOpen(true);
  };

  const handleSectionUpdated = (sectionData?: ISection, isEdit?: boolean) => {
    // Update sections with the response data
    if (sectionData) {
      updateSections(sectionData, isEdit || false);
    }
  };

  const handleAddNewLesson = (sectionId: string) => {
    setEditingLesson(null);
    setIsEditLesson(false);
    setActiveSectionIdForLesson(sectionId);
    setLessonDialogOpen(true);
  };

  // Reusable function to save order
  const saveOrder = async (
    sectionsToOrder: typeof sections,
    showToast = true
  ) => {
    try {
      // Calculate cumulative lesson order across all sections
      let cumulativeLessonOrder = 0;

      // Prepare the data structure for the API
      const sectionsData = sectionsToOrder.map((section, sectionIndex) => {
        const sectionLessons = section.lessons || [];
        const lessonsData = sectionLessons.map((lesson) => {
          cumulativeLessonOrder += 1;
          return {
            lessonId: lesson._id,
            order: cumulativeLessonOrder,
          };
        });

        return {
          sectionId: section.sectionId || section._id,
          order: sectionIndex + 1,
          lessons: lessonsData,
        };
      });

      const response = await axiosInstance.put(
        `/sections/update-sections-and-lessons`,
        { sections: sectionsData }
      );

      if (response.status === 200) {
        setHasOrderChanged(false); // Reset the change flag
        if (showToast) {
          toast.success(
            postActionText("save_success") || "Order saved successfully!"
          );
        }
        return true;
      } else {
        if (showToast) {
          toast.error(
            response.data?.message || postActionText("something_wrong")
          );
        }
        return false;
      }
    } catch (error) {
      console.error("Error saving order:", error);
      if (showToast) {
        toast.error(postActionText("something_wrong"));
      }
      return false;
    }
  };

  const handleLessonUpdated = async (
    lessonData?: unknown,
    isEdit?: boolean
  ) => {
    const lesson = lessonData as ILesson | undefined;
    if (!lesson) return;
    if (isEdit) {
      updateLessonInSections(lesson);
      toast.success(postActionText("update_success"));
    } else {
      const sid = activeSectionIdForLesson || lesson?.course?._id || "";
      if (sid) {
        // Add lesson to section first
        addLessonToSection(sid, lesson);
        toast.success(postActionText("create_success"));

        // Manually construct updated sections with the new lesson
        const updatedSections = sections.map(
          (s: ISection & { sectionId?: string; id?: string }) => {
            const id = s.sectionId || s._id || s.id;
            if (id === sid) {
              const currentLessons = Array.isArray(s.lessons) ? s.lessons : [];
              return { ...s, lessons: [...currentLessons, lesson] } as ISection;
            }
            return s;
          }
        );

        // Save order with updated sections (includes the new lesson)
        // Don't show toast since we already showed "create_success"
        await saveOrder(updatedSections, false);
      }
    }
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      await saveOrder(sections, true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        <CourseHeader course={course} onEdit={handleEdit} />
        <LessonListCard />
        <div className="my-10">
          {sections.length > 0 ? (
            sections.map((section, sectionIndex) => (
              <SectionItem
                key={sectionIndex}
                section={section}
                sectionIndex={sectionIndex}
                courseId={courseId}
                isExpanded={expandedSections.has(
                  section?.sectionId || section?._id || ""
                )}
                onToggle={toggleSection}
                onEdit={handleEditSection}
                onDelete={handleDeleteSection}
                onAddLesson={handleAddNewLesson}
                onEditLesson={handleEditLesson}
                onDeleteLesson={handleDeleteLesson}
                // Drag and drop props
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                dropTarget={dropTarget}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-background-2 rounded-2xl">
              <div className="text-muted-foreground text-lg">
                {coursesText("no_sections_found")}
              </div>
            </div>
          )}

          {/* Save Button - Only show when order has changed */}
          {hasOrderChanged && (
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleSaveOrder}
                className="px-8 py-3 text-lg font-semibold"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                    {postActionText("saving")}
                  </>
                ) : (
                  postActionText("save_changes")
                )}
              </Button>
            </div>
          )}
        </div>
        <Button variant="primaryOutline" onClick={handleAddNewSection}>
          {text("add_new_section")}
        </Button>
      </div>

      <SectionEditDialog
        open={sectionDialogOpen}
        onOpenChange={setSectionDialogOpen}
        section={editingSection}
        courseId={courseId}
        onSectionUpdated={handleSectionUpdated}
        isEdit={isEditSection}
        // When editing, pass the index of the section; when creating, pass current length
        sectionIndex={
          isEditSection && editingSection
            ? sections.findIndex(
                (s) =>
                  (s as ISection & { sectionId?: string }).sectionId ===
                    (editingSection as ISection & { sectionId?: string })
                      .sectionId || s._id === editingSection._id
              )
            : undefined
        }
        sectionsLength={sections.length}
      />

      <LessonEditDialog
        open={lessonDialogOpen}
        onOpenChange={setLessonDialogOpen}
        lesson={editingLesson}
        courseId={courseId}
        sectionId={activeSectionIdForLesson}
        onLessonUpdated={handleLessonUpdated}
        isEdit={isEditLesson}
        lessonIndex={
          isEditLesson && editingLesson
            ? sections
                .find(
                  (s) =>
                    s?.sectionId === activeSectionIdForLesson ||
                    s?._id === activeSectionIdForLesson
                )
                ?.lessons?.findIndex((l) => l._id === editingLesson._id) ?? -1
            : undefined
        }
        lessonsLength={
          sections.find(
            (s) =>
              s?.sectionId === activeSectionIdForLesson ||
              s?._id === activeSectionIdForLesson
          )?.lessons?.length ?? 0
        }
      />

      <DeleteConfirmationDialogs
        deletingSectionId={deletingSectionId}
        deletingLessonId={deletingLessonId}
        isDeleting={isDeleting}
        isDeletingLesson={isDeletingLesson}
        onCancelSection={() => setDeletingSectionId(null)}
        onCancelLesson={() => setDeletingLessonId(null)}
        onConfirmSection={confirmDeleteSection}
        onConfirmLesson={confirmDeleteLesson}
      />
    </div>
  );
};

export default CourseDetailClient;
