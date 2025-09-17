"use client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useMyCoursesStore } from "@/stores/MyCoursesStore";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";
import { axiosInstance } from "@/app/lib/utils";

const BuyCourse = ({ id, price }: { id: string; price: number }) => {
  const text = useTranslations("coursePage");
  const { token, user } = useAuth();
  const { courses, getCourses } = useMyCoursesStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isCourseBought = useMemo(() => {
    return courses.some((course) => course._id === id);
  }, [courses, id]);

  useEffect(() => {
    if (token && user?._id) {
      getCourses(token, user?._id);
    }
  }, [token, user?._id, getCourses]);

  const handleFreeCourseEnrollment = async () => {
    if (!token) {
      toast.error(text("loginFirst"));
      return;
    }
    try {
      setIsLoading(true);
      await axiosInstance.put(
        `/orders/createUnPaidOrder/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await getCourses(token, user?._id || "", true);
      router.push(`/dashboard/learn/${id}`);
    } catch (error) {
      if (error) toast.error(text("enrollmentFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isCourseBought) {
    return (
      <Button asChild className="w-full mb-4 md:mb-8">
        <Link href={`/dashboard/learn/${id}`}>{text("startLearning")}</Link>
      </Button>
    );
  }

  if (price === 0) {
    return (
      <Button
        className="w-full mb-4 md:mb-8"
        onClick={handleFreeCourseEnrollment}
        isLoading={isLoading}
      >
        {text("startNow")}
      </Button>
    );
  }

  return (
    <Button asChild className="w-full mb-4 md:mb-8">
      <Link href={`/checkout/course/${id}`}>{text("startNow")}</Link>
    </Button>
  );
};

export default BuyCourse;
