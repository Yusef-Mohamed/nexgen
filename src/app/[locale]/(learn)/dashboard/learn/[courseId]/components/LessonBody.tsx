import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { FilterTabs, type FilterOption } from "@/components/filters/FilterTabs";
import { ILesson } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import CreateCourseReview from "./CourseReview";
import { getDynamicString } from "@/lib/utils";

const LessonBody = ({
  lessonId,
  lesson,
}: {
  lessonId: string;
  lesson?: ILesson;
}) => {
  const [data, setData] = useState<{
    otp: string;
    playbackInfo: string;
  } | null>(null);
  const { token } = useAuth();
  const text = useTranslations("learn");
  const [activeTab, setActiveTab] = useState<string>("about");

  const tabOptions: FilterOption[] = [
    { value: "about", label: "About Lesson" },
    { value: "reviews", label: "Reviews" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/lessons/${lessonId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const videoData = response.data?.data?.videoData;
        if (videoData) {
          setData(videoData);
        }
      } catch (error) {
        console.error("Failed to fetch lesson data:", error);
      }
    };
    if (token && lessonId) {
      fetchData();
    }
  }, [token, setData, lessonId]);

  const handleVideoEnd = () => {
    // Handle video end event here
  };

  const locale = useLocale();
  return (
    <div>
      <p className="mb-6 text-center text-destructive">
        {locale === "ar"
          ? "تسريب اي فيديو يعرضك للمسائلة القانونية"
          : "Any video leak will expose you to legal accountability"}
      </p>
      {data?.otp ? (
        <VideoPlayer
          otp={data.otp}
          playbackInfo={data.playbackInfo}
          onVideoEnd={handleVideoEnd}
        />
      ) : (
        <div className="w-full animate-pulse bg-input aspect-video" />
      )}
      <div className="mt-6">
        <FilterTabs
          options={tabOptions}
          activeValue={activeTab}
          onChange={setActiveTab}
        />
        {activeTab === "about" && (
          <div className="my-6">
            <h2 className="font-semibold">{getDynamicString(lesson?.title)}</h2>
            <p className="mt-4 mb-4 text-lg text-text-3">
              {getDynamicString(lesson?.description)}
            </p>
            {Array.isArray(lesson?.attachments) &&
              lesson?.attachments?.map((attachment, ind) => (
                <Button
                  key={ind}
                  className="block px-0 w-fit"
                  asChild
                  variant={"link"}
                >
                  <a href={attachment} target="_blank" rel="noreferrer">
                    {text("attachment")} {ind + 1}
                  </a>
                </Button>
              ))}
          </div>
        )}
        {activeTab === "reviews" && (
          <CreateCourseReview courseId={lesson?.course?._id || ""} />
        )}
      </div>
    </div>
  );
};

export default LessonBody;
