"use client";

import { ICourse } from "@/types";
import { useTranslations } from "next-intl";
import { LearnCourseCard } from "./LearnCourseCard";

interface NextCourseSuggestionsProps {
  courses: ICourse[];
}

export const NextCourseSuggestions = ({
  courses,
}: NextCourseSuggestionsProps) => {
  const text = useTranslations("learn");

  if (courses.length === 0) return null;

  return (
    <section className="space-y-4 pt-2" aria-label={text("upNextCourses")}>
      <p className="text-sm font-medium text-text-2">{text("upNextCourses")}</p>
      <ul className="space-y-4">
        {courses.map((course) => (
          <li key={course._id || course.id}>
            <LearnCourseCard course={course} locked />
          </li>
        ))}
      </ul>
    </section>
  );
};
