"use client";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, FileText, MoreVertical, Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ILesson } from "@/types";

interface LessonItemProps {
  lesson: ILesson;
  index: number;
  courseId: string;
  onEdit: (lessonId: string) => void;
  onDelete: (lessonId: string) => void;
}

const LessonItem = ({ lesson, index, courseId, onEdit, onDelete }: LessonItemProps) => {
  const text = useTranslations("courses");

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-semibold">
                #{index + 1} {lesson.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">
                    {text("open_menu")}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                withPortal={false}
                align="end"
              >
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
                <DropdownMenuItem asChild>
                  <Link
                    href={`/instructor-dashboard/courses/${courseId}/lessons/${lesson._id}/exams`}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {text("exams")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setTimeout(() => {
                      onDelete(lesson._id);
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
      </CardContent>
    </Card>
  );
};

export default LessonItem;
