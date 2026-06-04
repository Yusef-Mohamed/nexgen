"use client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/navigation";
import { axiosInstance } from "@/app/lib/utils";
import { buildCheckoutHref } from "@/lib/coupons";
import {
  useInvalidateMyCourses,
  useMyOwnedCourseIds,
} from "@/hooks/useMyCoursesQueries";

const BuyCourse = ({
  id,
  price,
  couponCode,
}: {
  id: string;
  price: number;
  couponCode?: string;
}) => {
  const text = useTranslations("coursePage");
  const { token, user } = useAuth();
  const { data: ownedCourseIds = [] } = useMyOwnedCourseIds(token, user?._id);
  const invalidateMyCourses = useInvalidateMyCourses();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isCourseBought = useMemo(() => {
    return ownedCourseIds.includes(id);
  }, [ownedCourseIds, id]);

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
      await invalidateMyCourses();
      router.push(`/dashboard/learn/${id}`);
    } catch (error) {
      if (error) toast.error(text("enrollmentFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isCourseBought) {
    return (
      <Button asChild className="w-full rounded-full mb-4 md:mb-8">
        <Link href={`/dashboard/learn/${id}`}>{text("startLearning")}</Link>
      </Button>
    );
  }

  if (price === 0) {
    return (
      <Button
        className="w-full mb-4 md:mb-8 rounded-full"
        onClick={handleFreeCourseEnrollment}
        isLoading={isLoading}
      >
        {text("startNow")}
      </Button>
    );
  }

  return (
    <Button asChild className="w-full mb-4 md:mb-8 rounded-full">
      <Link href={buildCheckoutHref("course", id, couponCode)}>
        {text("startNow")}
      </Link>
    </Button>
  );
};

export default BuyCourse;
