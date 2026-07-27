"use client";

import type { ICourse } from "@/types";
import { useTranslations } from "next-intl";
import { HiOutlineArrowTrendingUp, HiOutlineSparkles } from "react-icons/hi2";
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
    <section
      className="relative mt-6 overflow-hidden rounded-2xl border border-secondary/20 bg-secondary/10 p-3 sm:p-5"
      aria-labelledby="next-course-heading"
    >
      <div className="absolute start-6 end-6 top-0 h-1 rounded-b-full bg-secondary/70" />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-20 -top-24 size-64 rounded-full bg-primary/10 blur-[90px]"
      />

      <div className="relative mb-4 flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-clear-ground/80 text-secondary cardShadowSm">
          <HiOutlineArrowTrendingUp className="size-5" />
        </span>
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-secondary">
            <HiOutlineSparkles className="size-3.5" />
            {text("recommendedPath")}
          </div>
          <h2 id="next-course-heading" className="mt-1 font-black text-text-1">
            {text("upNextCourses")}
          </h2>
        </div>
      </div>

      <ul className="relative space-y-3">
        {courses.map((course) => (
          <li key={course._id || course.id}>
            <LearnCourseCard course={course} locked />
          </li>
        ))}
      </ul>
    </section>
  );
};
