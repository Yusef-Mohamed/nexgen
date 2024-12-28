"use client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import CreatePractice from "./CreatePractice";
import { IAnalytic } from "@/types";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const DisplayPosts = () => {
  const text = useTranslations("practice");
  const { token, user } = useAuth();
  const [show, setShow] = useState<"completed" | "onProgress" | "addNew">(
    "onProgress"
  );
  const [haveError, setHaveError] = useState(false);

  const fetchPosts = useCallback(
    async (page: number, search?: string): Promise<IAnalytic[]> => {
      try {
        if (haveError) {
          return [];
        }
        const filtersParams = new URLSearchParams(search);
        filtersParams.append("limit", "4");
        filtersParams.append("page", `${page}`);

        const filters = filtersParams.toString();
        const axiosInstance = createClientAxiosInstance();
        const res = await axiosInstance(
          `/analytics/user-analytic/${user?._id}${
            filters ? "?" + filters : ""
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = res.data.data as IAnalytic[];
        setPaginationData(res.data.paginationResult);

        return data;
      } catch (e) {
        console.log(e);
        setHaveError(true);
        return [];
      }
    },
    [token, setHaveError, haveError, user]
  );
  const { data: posts, setPaginationData } = useInfiniteScroll<IAnalytic>({
    fetchData: fetchPosts,
  });
  // const toShowCourses = useMemo(() => {
  //   return [];
  //   // if (show === "completed") {
  //   //   return courses.filter(
  //   //     (course) => course.courseProgress?.status === "Completed"
  //   //   );
  //   // } else {
  //   //   return courses.filter(
  //   //     (course) => course.courseProgress?.status !== "Completed"
  //   //   );
  //   // }
  // }, [show]);
  console.log(posts);
  return (
    <section className="space-y-4">
      <div className="flex items-center overflow-hidden border rounded-full w-fit">
        {(["completed", "onProgress", "addNew"] as const).map((item) => (
          <Button
            key={item}
            variant={show === item ? "default" : "outline"}
            className="border-none rounded-none min-w-28 sm:min-w-32"
            onClick={() => setShow(item)}
          >
            {text(item)}
          </Button>
        ))}
      </div>
      {show === "addNew" && <CreatePractice />}
    </section>
  );
};

export default DisplayPosts;
