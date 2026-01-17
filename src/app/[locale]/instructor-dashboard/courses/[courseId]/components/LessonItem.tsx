"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { axiosInstance } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  MoreVertical,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  HelpCircle,
  Settings,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ILesson } from "@/types";
import { DropTargetIndicator } from "./DropTargetIndicator";
import AssessmentDialog from "./AssessmentDialog/component";
import { getDynamicString } from "@/lib/utils";

interface LessonItemProps {
  lesson: ILesson;
  index: number;
  courseId: string;
  onEdit: (lessonId: string) => void;
  onDelete: (lessonId: string) => void;
  onDragStart: (
    e: React.DragEvent,
    id: string,
    type: "section" | "lesson"
  ) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string, type: "section" | "lesson") => void;
  dropTarget: {
    id: string;
    type: "section" | "lesson";
    position: "above" | "below" | "inside";
  } | null;
}

const LessonItem = ({
  lesson,
  index,
  courseId,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDragEnd,
  onDrop,
  dropTarget,
}: LessonItemProps) => {
  const text = useTranslations("courses");
  const [isExpanded, setIsExpanded] = useState(false);
  const [assessment, setAssessment] = useState({
    id: `assessment-${lesson._id}`,
    title: text("lesson_assessment"),
    isActive: lesson.isRequireAnalytic || false,
  });
  const [quiz, setQuiz] = useState({
    id: `quiz-${lesson._id}`,
    title: text("lesson_quiz"),
    isActive: lesson.hasQuiz || false,
  });
  const [isUpdatingAssessment, setIsUpdatingAssessment] = useState(false);
  const [isUpdatingQuiz, setIsUpdatingQuiz] = useState(false);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);

  const toggleAssessment = async () => {
    const newValue = !assessment.isActive;
    setIsUpdatingAssessment(true);

    try {
      const response = await axiosInstance.put(`/lessons/${lesson._id}`, {
        isRequireAnalytic: newValue,
      });

      if (response.status === 200) {
        setAssessment((prev) => ({
          ...prev,
          isActive: newValue,
        }));
        toast.success(text("assessment_updated_successfully"));
      } else {
        toast.error(text("something_wrong"));
      }
    } catch (error) {
      console.error("Error updating assessment:", error);
      toast.error(text("something_wrong"));
    } finally {
      setIsUpdatingAssessment(false);
    }
  };

  const toggleQuiz = async () => {
    const newValue = !quiz.isActive;
    setIsUpdatingQuiz(true);

    try {
      const response = await axiosInstance.put(`/lessons/${lesson._id}`, {
        hasQuiz: newValue,
      });

      if (response.status === 200) {
        setQuiz((prev) => ({
          ...prev,
          isActive: newValue,
        }));
        toast.success(text("quiz_updated_successfully"));
      } else {
        toast.error(text("something_wrong"));
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast.error(text("something_wrong"));
    } finally {
      setIsUpdatingQuiz(false);
    }
  };

  const handleAssessmentClick = () => {
    setAssessmentDialogOpen(true);
  };

  const handleAssessmentUpdated = () => {
    toast.success(text("assessment_updated_successfully"));
  };

  return (
    <div className="relative">
      {/* Drop target indicator for lessons */}
      {dropTarget?.id === lesson._id && dropTarget.type === "lesson" && (
        <DropTargetIndicator position={dropTarget.position} />
      )}

      <div
        className="mb-3 border p-4 rounded-xl"
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver(e);
        }}
        onDragLeave={(e) => onDragLeave(e)}
        onDrop={(e) => {
          e.preventDefault();
          onDrop(e, lesson._id, "lesson");
        }}
        data-lesson-id={lesson._id}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              draggable
              onDragStart={(e) => onDragStart(e, lesson._id, "lesson")}
              onDragEnd={onDragEnd}
              className="cursor-move"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>{" "}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full gap-2 p-0 h-auto hover:bg-transparent"
            >
              <h3 className="text-xl font-semibold">
                {text("lesson")} {index + 1}: {getDynamicString(lesson.title)}
              </h3>
            </Button>
          </div>{" "}
          <div className="flex items-center gap-2">
            {" "}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full gap-2 p-0 h-auto hover:bg-transparent"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">{text("open_menu")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent withPortal={false} align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setTimeout(() => {
                      onEdit(lesson._id);
                    }, 100);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {text("edit")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setTimeout(() => {
                      onDelete(lesson._id);
                    }, 100);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {text("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">{assessment.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAssessmentClick}
                  className="h-8 w-8 p-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Switch
                  checked={assessment.isActive}
                  onCheckedChange={toggleAssessment}
                  disabled={isUpdatingAssessment}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">{quiz.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0"
                >
                  <Link
                    href={`/instructor-dashboard/courses/${courseId}/lessons/${lesson._id}/exams`}
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
                <Switch
                  checked={quiz.isActive}
                  onCheckedChange={toggleQuiz}
                  disabled={isUpdatingQuiz}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assessment Dialog */}
      <AssessmentDialog
        open={assessmentDialogOpen}
        onOpenChange={setAssessmentDialogOpen}
        lesson={lesson}
        courseId={courseId}
        onAssessmentUpdated={handleAssessmentUpdated}
      />
    </div>
  );
};

export default LessonItem;
