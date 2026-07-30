import { axiosInstance } from "@/app/lib/utils";
import ImageWithZoom from "@/components/ImageWithZoom";
import { useAuth } from "@/components/auth-provider";
import { FilterTabs, type FilterOption } from "@/components/filters/FilterTabs";
import { Button } from "@/components/ui/button";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { getDynamicString, isImageFile } from "@/lib/utils";
import type { ILesson } from "@/types";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import {
  HiOutlineArrowPath,
  HiOutlineClock,
  HiOutlineDocumentArrowDown,
  HiOutlineExclamationTriangle,
  HiOutlinePlayCircle,
  HiOutlineShieldExclamation,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { toast } from "react-toastify";
import { useCourseContext } from "../context/CourseContext";
import CreateCourseReview from "./CourseReview";
import VideoPlayer from "./VideoPlayer";

interface VideoCredentials {
  otp: string;
  playbackInfo: string;
}

const LessonBody = ({
  lessonId,
  lesson,
}: {
  lessonId: string;
  lesson?: ILesson;
}) => {
  const [data, setData] = useState<VideoCredentials | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const { token } = useAuth();
  const text = useTranslations("learn");
  const [activeTab, setActiveTab] = useState<string>("about");
  const { sections, updateSections } = useCourseContext();
  const { setSearchParams } = useCustomSearchParams();

  const tabOptions: FilterOption[] = [
    { value: "about", label: text("aboutLesson") },
    { value: "reviews", label: text("reviews") },
  ];

  const fetchVideoData = useCallback(async () => {
    if (!token || !lessonId) return;

    setData(null);

    setIsVideoLoading(true);

    try {
      const response = await axiosInstance.get("/lessons/" + lessonId, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const videoData = response.data?.data?.videoData;

      if (!videoData?.otp || !videoData?.playbackInfo) {
        throw new Error("Lesson video credentials are unavailable");
      }

      setData(videoData);
    } catch (fetchError) {
      console.error("Failed to fetch lesson video:", fetchError);
    } finally {
      setIsVideoLoading(false);
    }
  }, [lessonId, token]);

  useEffect(() => {
    fetchVideoData();
  }, [fetchVideoData]);

  const getNextContent = useCallback(() => {
    if (!lesson || sections.length === 0) return null;

    if (lesson.hasQuiz) {
      return {
        type: "quiz" as const,
        lessonId: lesson._id,
        title:
          getDynamicString(lesson.examTitle) ||
          getDynamicString(lesson.quizTitle) ||
          getDynamicString(lesson.title),
      };
    }

    if (lesson.isRequireAnalytic) {
      return {
        type: "practice" as const,
        lessonId: lesson._id,
        title:
          getDynamicString(lesson.assignmentTitle) ||
          getDynamicString(lesson.title),
      };
    }

    const allLessons = sections.flatMap((section) => section.lessons);
    const currentIndex = allLessons.findIndex(
      (item) => item._id === lesson._id,
    );

    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      if (nextLesson?.videoUrl) {
        return {
          type: "lesson" as const,
          lessonId: nextLesson._id,
          title: getDynamicString(nextLesson.title),
        };
      }
    }

    return null;
  }, [lesson, sections]);

  const markLessonAsWatched = useCallback(() => {
    if (!lessonId) return;

    updateSections(
      sections.map((section) => ({
        ...section,
        lessons: section.lessons.map((item) =>
          item._id === lessonId ? { ...item, lessonWatched: true } : item,
        ),
      })),
    );
  }, [lessonId, sections, updateSections]);

  const navigateToNext = useCallback(() => {
    const nextContent = getNextContent();

    if (!nextContent) {
      toast.success(
        text("lessonCompleted") + " " + text("allLessonsCompleted"),
      );
      return;
    }

    setSearchParams({
      lesson: nextContent.lessonId,
      display: nextContent.type,
      lessonTitle: nextContent.title,
    });

    const messages: Record<string, string> = {
      quiz: text("movingToQuiz"),
      practice: text("movingToPractice"),
      lesson: text("movingToNextLesson"),
    };

    toast.success(text("lessonCompleted") + " " + messages[nextContent.type]);
  }, [getNextContent, setSearchParams, text]);

  const handleVideoEnd = useCallback(async () => {
    if (!lesson?.lessonWatched) {
      try {
        await axiosInstance.post(
          "/lessonViewed/" + lessonId,
          {},
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        );
        markLessonAsWatched();
      } catch (updateError) {
        console.error("Failed to mark lesson as viewed:", updateError);
      }
    }

    navigateToNext();
  }, [
    lesson?.lessonWatched,
    lessonId,
    markLessonAsWatched,
    navigateToNext,
    token,
  ]);

  const lessonTitle = getDynamicString(lesson?.title) || text("lesson");
  const lessonDescription =
    getDynamicString(lesson?.description) || text("noLessonDescription");
  const attachments = Array.isArray(lesson?.attachments)
    ? lesson.attachments.filter(Boolean)
    : [];

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-primary-faded p-5 sm:p-6 lg:p-8">
        <div className="absolute start-6 end-6 top-0 h-1 rounded-b-full bg-primary/70" />
        <div
          aria-hidden
          className="pointer-events-none absolute -end-20 -top-24 size-64 rounded-full bg-secondary/20 blur-[90px]"
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-clear-ground/70 px-3 py-1.5 text-xs font-bold text-primary backdrop-blur-sm">
              <HiOutlinePlayCircle className="size-4" />
              {text("videoLesson")}
            </div>
            <h1 className="mt-4 font-black text-text-1">{lessonTitle}</h1>
            <p className="mt-2 max-w-3xl leading-7 text-text-2">
              {lessonDescription}
            </p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary/10 bg-clear-ground/75 px-3 py-2 text-sm font-bold text-text-2">
            <HiOutlineClock className="size-4 text-primary" />
            {Number(lesson?.lessonDuration) || 0} {text("minuteAbbr")}
          </div>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-2xl border border-destructive/15 bg-destructive/10 px-4 py-3 text-sm font-medium leading-6 text-destructive">
        <HiOutlineShieldExclamation className="mt-0.5 size-5 shrink-0" />
        <span>{text("videoLeakWarning")}</span>
      </div>

      <section className="overflow-hidden rounded-3xl border border-primary/10 bg-clear-ground p-2 cardShadowSm sm:p-3">
        {data ? (
          <VideoPlayer
            otp={data.otp}
            playbackInfo={data.playbackInfo}
            onVideoEnd={handleVideoEnd}
            title={text("videoLesson")}
          />
        ) : isVideoLoading ? (
          <div className="aspect-video w-full animate-pulse rounded-2xl bg-muted" />
        ) : (
          <div className="flex aspect-video min-h-[16rem] w-full items-center justify-center rounded-2xl bg-background-2 p-6 text-center">
            <div className="max-w-md">
              <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <HiOutlineExclamationTriangle className="size-7" />
              </span>
              <h2 className="mt-4 font-black text-text-1">
                {text("videoUnavailable")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-3">
                {text("videoUnavailableDescription")}
              </p>
              <Button
                type="button"
                variant="primaryOutline"
                onClick={fetchVideoData}
                className="mt-5 rounded-full bg-clear-ground"
              >
                <HiOutlineArrowPath className="me-2 size-4" />
                {text("retryVideo")}
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-primary/10 bg-clear-ground p-4 cardShadowSm sm:p-6">
        <FilterTabs
          options={tabOptions}
          activeValue={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "about" && (
          <div className="mt-5 space-y-5">
            <div className="rounded-2xl border border-primary/10 bg-background-2 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <HiOutlineSparkles className="size-5" />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-primary">
                    {text("lessonOverview")}
                  </p>
                  <h2 className="mt-1 font-black text-text-1">
                    {text("aboutLesson")}
                  </h2>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap leading-7 text-text-2">
                {lessonDescription}
              </p>
            </div>

            {attachments.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <HiOutlineDocumentArrowDown className="size-5 text-secondary" />
                  <h3 className="font-black text-text-1">
                    {text("lessonResources")}
                  </h3>
                  <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-bold text-secondary">
                    {attachments.length}
                  </span>
                </div>
                <div className="grid gap-3">
                  {attachments.map((attachment, index) =>
                    isImageFile(attachment) ? (
                      <div
                        key={attachment}
                        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-primary/10 bg-background-2"
                      >
                        <ImageWithZoom
                          src={attachment}
                          alt={text("attachment") + " " + (index + 1)}
                          width={960}
                          height={640}
                          className="h-auto w-full object-contain"
                        />
                      </div>
                    ) : (
                      <a
                        key={attachment}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-primary/10 bg-background-2 p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                      >
                        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Download className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1 text-sm font-bold text-text-1 group-hover:text-primary">
                          {text("attachment")} {index + 1}
                        </span>
                        <HiOutlineDocumentArrowDown className="size-5 text-text-3 transition-colors group-hover:text-primary" />
                      </a>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mt-5">
            <CreateCourseReview courseId={lesson?.course?._id || ""} />
          </div>
        )}
      </section>
    </div>
  );
};

export default LessonBody;
