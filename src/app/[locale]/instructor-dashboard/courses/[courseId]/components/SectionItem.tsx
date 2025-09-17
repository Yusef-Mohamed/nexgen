"use client";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  FileText,
  MoreVertical,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";
import { ISection } from "@/types";
import LessonItem from "./LessonItem";
import { DropTargetIndicator } from "./DropTargetIndicator";

interface SectionItemProps {
  section: ISection;
  sectionIndex: number;
  courseId: string;
  isExpanded: boolean;
  onToggle: (sectionId: string) => void;
  onEdit: (sectionId: string) => void;
  onDelete: (sectionId: string) => void;
  onAddLesson: (sectionId: string) => void;
  onEditLesson: (lessonId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
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

const SectionItem = ({
  section,
  sectionIndex,
  courseId,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDragEnd,
  onDrop,
  dropTarget,
}: SectionItemProps) => {
  const text = useTranslations("courses");
  const locale = useLocale();

  const getSectionTitle = (
    s:
      | ISection
      | (ISection & { translationTitle?: { ar?: string; en?: string } })
      | undefined
  ) => {
    const anyS = s as unknown as {
      translationTitle?: Record<string, string>;
      title?: string;
      section?: string;
    };
    return (
      anyS?.translationTitle?.[String(locale)] ||
      anyS?.title ||
      anyS?.translationTitle?.en ||
      anyS?.translationTitle?.ar ||
      anyS?.section ||
      ""
    );
  };

  const sectionId = section?.sectionId || section?._id || "";

  return (
    <div className="mb-8 last:mb-0 relative">
      {/* Drop target indicator for sections */}
      {dropTarget?.id === sectionId && dropTarget.type === "section" && (
        <DropTargetIndicator position={dropTarget.position} />
      )}

      {/* Section Header */}
      <div
        className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, sectionId, "section")}
        data-section-id={sectionId}
        data-section-header="true"
      >
        <div className="flex items-center gap-3">
          <div
            draggable
            onDragStart={(e) => onDragStart(e, sectionId, "section")}
            onDragEnd={onDragEnd}
            className="cursor-move"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <FileText className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-bold">
            {text("section_number", { number: sectionIndex + 1 })}:{" "}
            {getSectionTitle(section)}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onToggle(sectionId)}>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
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
                    onEdit(sectionId);
                  }, 100);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                {text("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setTimeout(() => {
                    onDelete(sectionId);
                  }, 100);
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {text("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div
          className="ml-6 space-y-4"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, sectionId, "section")}
          data-section-id={sectionId}
        >
          {section?.lessons?.map((lesson, index) => (
            <LessonItem
              key={lesson._id}
              lesson={lesson}
              index={index}
              courseId={courseId}
              onEdit={onEditLesson}
              onDelete={onDeleteLesson}
              // Drag and drop props
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
              dropTarget={dropTarget}
            />
          ))}

          {/* Add New Part Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onAddLesson(sectionId)}
          >
            <Plus className="w-4 h-4 mr-2" />
            {text("add_new_section")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SectionItem;
