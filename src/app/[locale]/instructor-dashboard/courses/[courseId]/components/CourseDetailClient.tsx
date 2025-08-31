"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ILesson, ISection } from "@/types";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { notFound } from "next/navigation";
import SectionEditDialog from "./SectionEditDialog";
import LessonEditDialog from "./LessonEditDialog";
import { useCourseDetail } from "../hooks/useCourseDetail";
import CourseEditDialog from "./CourseEditDialog/component";
import { toast } from "react-toastify";

// Import new components
import CourseHeader from "./CourseHeader";
import CourseSkeleton from "./CourseSkeleton";
import LessonListCard from "./LessonListCard";
import SectionItem from "./SectionItem";
import DeleteConfirmationDialogs from "./DeleteConfirmationDialogs";

const CourseDetailClient = () => {
  const postActionText = useTranslations("postAction");
  const params = useParams();
  const courseId = params.courseId as string;
  const { token } = useAuth();

  // Use the custom hook for all course detail logic
  const {
    course,
    sections,
    loading,
    error,
    expandedSections,
    updateSections,
    toggleSection,
    updateCourse,
    deleteSectionById,
    addLessonToSection,
    updateLessonInSections,
    deleteLessonById,
  } = useCourseDetail(courseId);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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
    setEditDialogOpen(true);
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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        <CourseHeader course={course} onEdit={handleEdit} />

        <LessonListCard onAddNewSection={handleAddNewSection} />

        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            {sections.map((section, sectionIndex) => (
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
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <CourseEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        course={course}
        onCourseUpdated={updateCourse}
      />

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
