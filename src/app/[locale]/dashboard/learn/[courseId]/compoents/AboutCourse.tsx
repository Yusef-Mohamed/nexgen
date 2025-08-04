"use client";
import { ICourse } from "@/types";
import CreateCourseReview from "./CourseReview";

const AboutCourse = ({ course }: { course: ICourse }) => {
  if (!course) {
    return null;
  }
  return (
    <div className="mt-6">
      <h2 className="mb-4 font-semibold">{course.title}</h2>

      <p className="mt-4 text-text-3">{course.description}</p>
      <CreateCourseReview courseId={course._id} />
    </div>
  );
};

export default AboutCourse;
