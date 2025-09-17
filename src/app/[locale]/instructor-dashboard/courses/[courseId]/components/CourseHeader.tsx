"use client";
import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  FileText,
  GraduationCap,
  MoreVertical,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { ICourse } from "@/types";

interface CourseHeaderProps {
  course: ICourse;
  onEdit: () => void;
}

const CourseHeader = ({ course, onEdit }: CourseHeaderProps) => {
  const text = useTranslations("courses");
  const locale = useLocale();

  return (
    <div className="flex items-center gap-4 mb-4">
      <button className="h-10 w-10 flex items-center justify-center">
        <Link href="/instructor-dashboard/courses">
          {locale === "ar" ? (
            <ArrowRight className="w-4 h-4 " />
          ) : (
            <ArrowLeft className="w-4 h-4 " />
          )}
        </Link>
      </button>
      <div className="flex items-center gap-3 justify-between w-full flex-1">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">{text("open_menu")}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent withPortal={false} align="end">
            <DropdownMenuItem
              onClick={() => {
                setTimeout(() => {
                  onEdit();
                }, 100);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              {text("edit")}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/instructor-dashboard/courses/${course._id}/placement-exam`}
              >
                <FileText className="mr-2 h-4 w-4" />
                {text("placement_exam")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/instructor-dashboard/courses/${course._id}/final-exam`}
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                {text("final_exam")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CourseHeader;
