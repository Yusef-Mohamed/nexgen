import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { FilterTabs, type FilterOption } from "@/components/filters/FilterTabs";
import { ILesson } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import CreateCourseReview from "./CourseReview";
import { getDynamicString, isImageFile } from "@/lib/utils";
import { useCourseContext } from "../context/CourseContext";
import useCustomSearchParams from "@/hooks/useSearchParams";
import { toast } from "react-toastify";
import ImageWithZoom from "@/components/ImageWithZoom";
import { FaFileDownload } from "react-icons/fa";

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
  const { sections, updateSections } = useCourseContext();
  const { setSearchParams } = useCustomSearchParams();

  const tabOptions: FilterOption[] = [
    { value: "about", label: text("aboutLesson") },
    { value: "reviews", label: text("reviews") },
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

  // Find the next content after the current lesson
  const getNextContent = useCallback(() => {
    if (!lesson || !sections) return null;

    // If the current lesson has a quiz, go to quiz
    if (lesson.hasQuiz) {
      return {
        type: "quiz" as const,
        lessonId: lesson._id,
        title: lesson.quizTitle || getDynamicString(lesson.title),
      };
    }

    // If the current lesson has practice, go to practice
    if (lesson.isRequireAnalytic) {
      return {
        type: "practice" as const,
        lessonId: lesson._id,
        title:
          getDynamicString(lesson.assignmentTitle) ||
          getDynamicString(lesson.title),
      };
    }

    // Find the next lesson
    const allLessons = sections.flatMap((section) => section.lessons);
    const currentIndex = allLessons.findIndex((l) => l._id === lesson._id);

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

  // Mark lesson as watched in context
  const markLessonAsWatched = useCallback(() => {
    if (!sections || !lessonId) return;

    const updatedSections = sections.map((section) => ({
      ...section,
      lessons: section.lessons.map((l) =>
        l._id === lessonId ? { ...l, lessonWatched: true } : l
      ),
    }));

    updateSections(updatedSections);
  }, [sections, lessonId, updateSections]);

  // Navigate to next content
  const navigateToNext = useCallback(() => {
    const nextContent = getNextContent();

    if (nextContent) {
      const params: { lesson?: string; display: string; lessonTitle?: string } =
        {
          display: nextContent.type,
        };

      if (nextContent.lessonId) {
        params.lesson = nextContent.lessonId;
      }

      if (nextContent.title) {
        params.lessonTitle = nextContent.title;
      }

      setSearchParams(params);

      // Show toast notification based on what's next
      const messages: Record<string, string> = {
        quiz: text("movingToQuiz") || "Moving to quiz...",
        practice: text("movingToPractice") || "Moving to practice...",
        lesson: text("movingToNextLesson") || "Moving to next lesson...",
      };

      toast.success(
        `${text("lessonCompleted") || "Lesson completed!"} ${
          messages[nextContent.type]
        }`
      );
    } else {
      toast.success(
        `${text("lessonCompleted") || "Lesson completed!"} ${
          text("allLessonsCompleted") ||
          "You've completed all lessons in this section!"
        }`
      );
    }
  }, [getNextContent, setSearchParams, text]);

  const handleVideoEnd = useCallback(async () => {
    // Only call API if lesson is not already watched
    if (!lesson?.lessonWatched) {
      try {
        await axiosInstance.post(
          `/lessonViewed/${lessonId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Update local state to mark lesson as watched
        markLessonAsWatched();
      } catch (error) {
        console.error("Failed to mark lesson as viewed:", error);
      }
    }

    // Navigate to next content regardless of watch status
    navigateToNext();
  }, [
    lesson?.lessonWatched,
    lessonId,
    token,
    markLessonAsWatched,
    navigateToNext,
  ]);

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
                <div key={ind} className="mt-4">
                  {isImageFile(attachment) ? (
                    <div className="space-y-2">
                      <div className="relative w-full max-w-2xl rounded-lg overflow-hidden border">
                        <ImageWithZoom
                          src={attachment}
                          alt={`${text("attachment")} ${ind + 1}`}
                          width={800}
                          height={600}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaFileDownload className="w-5 h-5 text-primary" />
                      <a
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        {text("attachment")} {ind + 1}
                      </a>
                    </div>
                  )}
                </div>
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
