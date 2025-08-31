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
} from "lucide-react";
import { ISection, ILesson } from "@/types";
import LessonItem from "./LessonItem";

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
    <div className="mb-8 last:mb-0">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
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
        <div className="ml-6 space-y-4">
          {section?.lessons?.map((lesson, index) => (
            <LessonItem
              key={lesson._id}
              lesson={lesson}
              index={index}
              courseId={courseId}
              onEdit={onEditLesson}
              onDelete={onDeleteLesson}
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
