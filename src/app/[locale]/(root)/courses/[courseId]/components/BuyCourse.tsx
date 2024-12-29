"use client";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ICourse } from "@/types";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

const BuyCourse = ({ id }: { id: string }) => {
  const text = useTranslations("coursePage");
  const [myCourses, setMyCourses] = useState<ICourse[]>([]);
  const { token } = useAuth();
  useEffect(() => {
    const getMyCourses = async () => {
      const axiosInstance = await createClientAxiosInstance();
      const res = await axiosInstance.get("/courses/MyCourses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyCourses(res.data.data);
    };
    getMyCourses();
  }, [token]);
  const isCourseBought = useMemo(() => {
    return myCourses.some((course) => course._id === id);
  }, [myCourses, id]);
  return (
    <Button asChild className="w-full mb-4 md:mb-8">
      <Link
        href={
          isCourseBought ? `/dashboard/learn/${id}` : `/checkout/course/${id}`
        }
      >
        {isCourseBought ? text("startLearning") : text("startNow")}
      </Link>
    </Button>
  );
};

export default BuyCourse;
