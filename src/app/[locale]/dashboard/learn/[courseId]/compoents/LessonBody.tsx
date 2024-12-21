import { createClientAxiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { useEffect, useState } from "react";

const LessonBody = ({ lessonId }: { lessonId: string }) => {
  const [data, setData] = useState<{
    otp: string;
    playbackInfo: string;
  } | null>(null);
  const { token } = useAuth();
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
    </div>
  );
};

export default LessonBody;
