import { createClientAxiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { ILesson } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await createClientAxiosInstance().get(
          `/lessons/${lessonId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
    console.log("Video ended");
  };

  const locale = useLocale();
  return (
    <div>
      <p className="mb-4 text-center text-destructive">
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
      <div className="my-6">
        <h2 className="font-semibold">{lesson?.title}</h2>
        <p className="mt-4 mb-4 text-lg text-text-3">{lesson?.description}</p>
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
    </div>
  );
};

export default LessonBody;
