"use client";
import { Button } from "@/components/ui/button";
import { ICourse } from "@/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import CreateCourseReview from "./CourseReview";

const AboutCourse = ({ course }: { course: ICourse }) => {
  const text = useTranslations("learn");
  const [show, setShow] = useState<"aboutCourse" | "reviewTheCourse">(
    "aboutCourse"
  );
  return (
    <div className="mt-6">
      <h2 className="mb-4 font-semibold">{course.title}</h2>
      <div className="flex items-center overflow-hidden border rounded-full w-fit">
        {(["aboutCourse", "reviewTheCourse"] as const).map((item) => (
          <Button
            key={item}
            variant={show === item ? "default" : "outline"}
            className="w-40 border-none rounded-none sm:w-48"
            onClick={() => setShow(item)}
          >
            {text(item)}
          </Button>
        ))}
      </div>
      {show === "aboutCourse" && (
        <p className="mt-4 text-text-3">{course.description}</p>
      )}
      {show === "reviewTheCourse" && (
        <CreateCourseReview courseId={course._id} />
      )}
    </div>
  );
};

export default AboutCourse;
