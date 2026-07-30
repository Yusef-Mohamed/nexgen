"use client";

import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import TextWithEmojiBox from "@/components/TextWithEmojiBox";
import UserAvatar from "@/components/UserAvatar";
import { cn, getDynamicString } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRef, useState, DragEvent } from "react";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FaCloudArrowUp } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useCourseContextSafe } from "@/app/[locale]/(learn)/dashboard/learn/[courseId]/context/CourseContext";
import { unlockLessonsSequentially } from "@/app/[locale]/(learn)/dashboard/learn/[courseId]/components/unlockLessons";
import { useFilterPackages } from "@/hooks/useFilterPackages";

const CreatePractice = ({
  lessonId,
  courseId,
}: {
  lessonId?: string;
  courseId?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const { user, token } = useAuth();
  const text = useTranslations("practice");
  const inputs = useTranslations("Forms");
  const router = useRouter();
  const inputRef = useRef(null);
  // Get CourseContext - returns null if not within CourseProvider (e.g., when used in practice page)
  const courseContext = useCourseContextSafe();

  // Course selection states - always require course selection
  const [selectedCourse, setSelectedCourse] = useState(courseId || "");
  const { packages, isLoadingPackages } = useFilterPackages({
    enable: !courseId,
    onlyActive: true,
  });

  const handelCreatePractice = async () => {
    setIsLoading(true);

    try {
      if (!content.trim()) {
        toast.error(text("contentIsRequired"));
        setIsLoading(false);
        return;
      }
      if (media.length === 0) {
        toast.error(text("pleaseSelectImage"));
        setIsLoading(false);
        return;
      }

      // Always require user to select a course (even if courseId prop is provided)
      if (!selectedCourse) {
        toast.error(text("pleaseSelectCourse") || "Please select a course");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      media.forEach((file) => {
        formData.append("media", file);
      });
      if (lessonId) formData.append("lesson", lessonId);
      if (courseId || selectedCourse)
        formData.append("course", courseId || selectedCourse);
      formData.append("content", content);

      await axiosInstance.post("/analytics", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          course: courseId || selectedCourse,
          ...(lessonId ? { lesson: lessonId } : {}),
        },
      });

      // Unlock lessons if CourseContext is available and lesson has no quiz
      if (courseContext && lessonId) {
        const currentLesson = courseContext.sections
          .flatMap((section) => section.lessons || [])
          .find((lesson) => lesson._id === lessonId);

        if (currentLesson) {
          // Mark the lesson as passedAnalyticsTask = true
          const updatedSections = courseContext.sections.map((section) => ({
            ...section,
            lessons: section.lessons.map((lesson) =>
              lesson._id === lessonId
                ? { ...lesson, passedAnalyticsTask: true }
                : lesson,
            ),
          }));

          // Only unlock next lessons if lesson has no quiz
          const unlockedSections = unlockLessonsSequentially(
            updatedSections,
            lessonId,
            true, // checkForNoQuiz = true for practice
          );
          courseContext.updateSections(unlockedSections);
        }
      }

      router.refresh();
      setContent("");
      setMedia([]);
      setSelectedCourse("");
      toast.success(text("postCreatedSuccessfully"));
    } catch (e) {
      const typedError = e as AxiosError<{ message: string }>;
      if (typedError.response?.data.message) {
        toast.error(typedError.response.data.message);
      } else {
        toast.error(text("somethingWentWrong"));
      }
    }
    setIsLoading(false);
  };
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (!isLoading) {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(Array.from(files));
      }
    }
  };
  const handleFileSelect = (files: File[]) => {
    setMedia((prev) => [...prev, ...files]);
  };
  return (
    <div className={""}>
      {/* Course selection dropdown - always show and require selection */}
      {!courseId && (
        <div className="pb-3 flex gap-4 flex-wrap">
          <div>
            <Label htmlFor="course" className="text-sm sr-only">
              {inputs("course")}:
            </Label>
            <Select
              value={selectedCourse}
              onValueChange={setSelectedCourse}
              disabled={isLoadingPackages}
            >
              <SelectTrigger className="h-10 w-fit gap-4 rounded-xl border-primary/10 bg-background-2 text-xs font-bold text-text-2 shadow-none">
                <SelectValue
                  placeholder={
                    isLoadingPackages ? text("loading") : inputs("SelectCourse")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem value={pkg.course._id} key={pkg.course._id}>
                    {getDynamicString(pkg.course.title)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      <div className="flex gap-2 justify-between items-start">
        <UserAvatar user={user || undefined} size="md" />
        <TextWithEmojiBox
          text={content}
          setText={setContent}
          className="p-0 m-0 w-full border-none"
          isLoading={isLoading}
          inputRef={inputRef}
        />
      </div>

      <div
        className={cn(
          `relative mx-auto mt-4 aspect-video h-[220px] w-full overflow-hidden rounded-2xl border-primary/10 bg-background-2`,
          {
            "opacity-60 cursor-not-allowed": isLoading,
            "cursor-pointer": !isLoading,
            "border-2 border-dashed border-primary bg-primary/10": isDragging,
            "border-2 border-dashed": !isDragging,
          },
        )}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/5 text-center">
          <FaCloudArrowUp className="mb-2 w-12 h-12 text-primary" />
          <p className="text-sm">{text("clickOrDragImageToUpload")}</p>
          <p className="mt-1 text-xs text-text-3">
            {text("acceptedFormats")} <b>.png, .jpg, .jpeg</b>
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png, .jpg, .jpeg, .pdf"
          className="hidden"
          disabled={isLoading}
          onChange={(e) => {
            if (e.target.files) {
              handleFileSelect(Array.from(e.target.files));
            }
          }}
        />
      </div>
      <ul className="px-0 my-4 space-y-2">
        {media.map((media) => (
          <li
            key={media.name}
            className={cn(
              "mt-2 flex items-center justify-between rounded-xl border border-primary/10 bg-background-2 px-4 py-3",
              {
                "opacity-50": isLoading,
              },
            )}
          >
            <div className="flex gap-4 items-center">
              {media.type.includes("image") && <FaImage className="w-10 h-6" />}
              {media.type.includes("pdf") && (
                <svg
                  width="40"
                  height="41"
                  viewBox="0 0 40 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_2151_28361)">
                    <path
                      d="M34.2498 9.25346V36.9668C34.2498 38.7617 32.7947 40.2168 30.9998 40.2168H9C7.20507 40.2168 5.75 38.7617 5.75 36.9668V4.9668C5.75 3.17187 7.20508 1.7168 9 1.7168H26.0445L34.2498 9.25346Z"
                      stroke="#D0D5DD"
                      strokeWidth="1.5"
                    />
                    <mask id="path-2-inside-1_2151_28361" fill="white">
                      <path d="M25 1.9668H33.5V10.4668H26C25.4477 10.4668 25 10.0191 25 9.4668V1.9668Z" />
                    </mask>
                    <path
                      d="M25 1.9668H33.5H25ZM33.5 11.4668H26C24.8954 11.4668 24 10.5714 24 9.4668H26H33.5V11.4668ZM26 11.4668C24.8954 11.4668 24 10.5714 24 9.4668V1.9668H26V9.4668V11.4668ZM33.5 1.9668V10.4668V1.9668Z"
                      fill="#D0D5DD"
                      mask="url(#path-2-inside-1_2151_28361)"
                    />
                    <rect
                      x="1"
                      y="20.9668"
                      width="23"
                      height="13"
                      rx="2"
                      fill="#F04438"
                    />
                    <path
                      d="M8.9827 26.2068C8.9827 26.6135 8.88936 26.9868 8.7027 27.3268C8.51603 27.6601 8.22936 27.9301 7.8427 28.1368C7.45603 28.3435 6.97603 28.4468 6.4027 28.4468H5.3427V30.9668H3.6327V23.9468H6.4027C6.9627 23.9468 7.43603 24.0435 7.8227 24.2368C8.20936 24.4301 8.49936 24.6968 8.6927 25.0368C8.88603 25.3768 8.9827 25.7668 8.9827 26.2068ZM6.2727 27.0868C6.59936 27.0868 6.8427 27.0101 7.0027 26.8568C7.1627 26.7035 7.2427 26.4868 7.2427 26.2068C7.2427 25.9268 7.1627 25.7101 7.0027 25.5568C6.8427 25.4035 6.59936 25.3268 6.2727 25.3268H5.3427V27.0868H6.2727ZM12.5029 23.9468C13.2429 23.9468 13.8896 24.0935 14.4429 24.3868C14.9963 24.6801 15.4229 25.0935 15.7229 25.6268C16.0296 26.1535 16.1829 26.7635 16.1829 27.4568C16.1829 28.1435 16.0296 28.7535 15.7229 29.2868C15.4229 29.8201 14.9929 30.2335 14.4329 30.5268C13.8796 30.8201 13.2363 30.9668 12.5029 30.9668H9.87293V23.9468H12.5029ZM12.3929 29.4868C13.0396 29.4868 13.5429 29.3101 13.9029 28.9568C14.2629 28.6035 14.4429 28.1035 14.4429 27.4568C14.4429 26.8101 14.2629 26.3068 13.9029 25.9468C13.5429 25.5868 13.0396 25.4068 12.3929 25.4068H11.5829V29.4868H12.3929ZM21.7086 23.9468V25.3168H18.8486V26.7968H20.9886V28.1268H18.8486V30.9668H17.1386V23.9468H21.7086Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2151_28361">
                      <rect
                        width="40"
                        height="40"
                        fill="white"
                        transform="translate(0 0.966797)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              )}
              <div className="flex flex-col gap-0.5">
                <span className="text-sm">{media.name}</span>
                <span className="text-xs">
                  {(media.size / 1024).toFixed(2)} KB
                </span>
              </div>
            </div>
            <button
              disabled={isLoading}
              className="disabled:opacity-50"
              onClick={() => {
                setMedia((prev) => prev.filter((file) => file !== media));
              }}
            >
              <IoClose />
            </button>
          </li>
        ))}
      </ul>
      <Button onClick={handelCreatePractice} isLoading={isLoading} size={"lg"}>
        {text("submit")}
      </Button>
    </div>
  );
};

export default CreatePractice;
