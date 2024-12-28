import { createClientAxiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { ILesson } from "@/types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

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
      const response = await createClientAxiosInstance().get(
        `/lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.data.videoData;
      setData(data);
    };
    fetchData();
  }, [token, setData, lessonId]);
  return (
    <div>
      {data?.otp ? (
        <iframe
          className="w-full aspect-video"
          src={`https://player.vdocipher.com/v2/?otp=${data?.otp}&playbackInfo=${data?.playbackInfo}`}
          allow="encrypted-media"
          allowFullScreen
        />
      ) : (
        <div className="w-full bg-input animate-pulse aspect-video" />
      )}
      <div className="my-6">
        <h2 className="font-semibold">{lesson?.title}</h2>
        <p className="mt-4 mb-4 text-lg text-text-3">{lesson?.description}</p>
        {lesson?.attachments?.map((attachment, ind) => (
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
