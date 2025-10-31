"use client";
import { ICourse } from "@/types";
import CreateCourseReview from "./CourseReview";

const AboutCourse = ({ course }: { course: ICourse }) => {
  if (!course) {
    return null;
  }
  return (
    <div className="mt-6">
      <CreateCourseReview courseId={course._id} />
    </div>
  );
};

export default AboutCourse;
