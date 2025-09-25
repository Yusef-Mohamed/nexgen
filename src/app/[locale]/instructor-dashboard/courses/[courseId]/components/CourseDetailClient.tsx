"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ILesson, ISection } from "@/types";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { notFound } from "next/navigation";
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
    notFound();
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

  const handleLessonUpdated = (lessonData?: unknown, isEdit?: boolean) => {
    const lesson = lessonData as ILesson | undefined;
    if (!lesson) return;
    if (isEdit) {
      updateLessonInSections(lesson);
      toast.success(postActionText("update_success"));
    } else {
      const sid = activeSectionIdForLesson || lesson?.course?._id || "";
      if (sid) addLessonToSection(sid, lesson);
      toast.success(postActionText("create_success"));
    }
  };

  const handleSaveOrder = async () => {
    try {
      setIsSaving(true);

      // Prepare the data structure for the API
      const sectionsData = sections.map((section, sectionIndex) => ({
        sectionId: section.sectionId || section._id,
        order: sectionIndex + 1,
        lessons: (section.lessons || []).map((lesson, lessonIndex) => ({
          lessonId: lesson._id,
          order: lessonIndex + 1,
        })),
      }));

      const response = await axiosInstance.put(
        `/sections/update-sections-and-lessons`,
        { sections: sectionsData }
      );

      if (response.status === 200) {
        toast.success(
          postActionText("save_success") || "Order saved successfully!"
        );
        setHasOrderChanged(false); // Reset the change flag
      } else {
        toast.error(
          response.data?.message || postActionText("something_wrong")
        );
      }
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error(postActionText("something_wrong"));
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
            <div className="text-center py-12 bg-card rounded-2xl">
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
