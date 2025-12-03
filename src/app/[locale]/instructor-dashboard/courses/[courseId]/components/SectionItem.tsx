"use client";
import { useTranslations } from "next-intl";
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
import { getDynamicString } from "@/lib/utils";

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

  const getSectionTitle = (s: ISection | undefined) => {
    return getDynamicString(s?.title || "");
  };

  const sectionId = section?.sectionId || section?._id || "";

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e);
      }}
      onDragLeave={(e) => onDragLeave(e)}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e, sectionId, "section");
      }}
      data-section-id={sectionId}
      data-section-header="true"
      className="mb-8 last:mb-0 relative bg-card px-6 py-8 rounded-xl"
    >
      {/* Drop target indicator for sections */}
      {dropTarget?.id === sectionId && dropTarget.type === "section" && (
        <DropTargetIndicator position={dropTarget.position} />
      )}

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            draggable
            onDragStart={(e) => onDragStart(e, sectionId, "section")}
            onDragEnd={onDragEnd}
            className="cursor-move"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {text("section_number", { number: sectionIndex + 1 })}:{" "}
            <FileText className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">
              {getSectionTitle(section)}
            </span>
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
                className="text-destructive"
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
          className="space-y-4 mt-8"
          onDragOver={(e) => {
            e.preventDefault();
            onDragOver(e);
          }}
          onDragLeave={(e) => onDragLeave(e)}
          onDrop={(e) => {
            e.preventDefault();
            onDrop(e, sectionId, "section");
          }}
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
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragLeave={(e) => onDragLeave(e)}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
              dropTarget={dropTarget}
            />
          ))}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => onAddLesson(sectionId)}
          >
            <Plus className="w-4 h-4 mr-2" />
            {text("add_new_lesson")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SectionItem;
