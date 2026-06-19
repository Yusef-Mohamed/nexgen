"use client";

import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import TextWithEmojiBox from "@/components/TextWithEmojiBox";
import UserAvatar from "@/components/UserAvatar";
import { cn, getDynamicString } from "@/lib/utils";
import { IPost, ICourse, IPackage } from "@/types";
import { ChevronDown, ImagePlus, Layers3 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState, useMemo, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreatePost = ({
  setData,
}: {
  setData: React.Dispatch<React.SetStateAction<IPost[]>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[] | null>(null);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, token } = useAuth();
  const text = useTranslations("community");
  const inputs = useTranslations("Forms");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Instructor-specific states
  const isInstructor = user?.isInstructor || user?.role === "instructor";
  const [postType, setPostType] = useState<"profile" | "course" | "service">(
    "profile",
  );
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);

  // Generate object URLs for media files only once
  const mediaPreviews = useMemo(() => {
    return media?.map((file) => URL.createObjectURL(file)) || [];
  }, [media]);

  // Fetch courses when postType is "course" and user is instructor
  useEffect(() => {
    if (isInstructor && postType === "course" && token) {
      setLoadingCourses(true);
      axiosInstance
        .get("/courses/getAll?limit=1000", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setCourses(res.data.data || []);
        })
        .catch((err) => {
          console.error("Error fetching courses:", err);
          toast.error(text("failedToLoadCourses"));
        })
        .finally(() => {
          setLoadingCourses(false);
        });
    } else {
      setCourses([]);
      setSelectedCourse("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInstructor, postType, token]);

  // Fetch packages when postType is "service" and user is instructor
  useEffect(() => {
    if (isInstructor && postType === "service" && token) {
      setLoadingPackages(true);
      axiosInstance
        .get("/packages/getAll?limit=1000", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setPackages(res.data.data || []);
        })
        .catch((err) => {
          console.error("Error fetching packages:", err);
          toast.error(text("failedToLoadServices"));
        })
        .finally(() => {
          setLoadingPackages(false);
        });
    } else {
      setPackages([]);
      setSelectedPackage("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInstructor, postType, token]);

  const handelCreatePost = async () => {
    // Validate content is required
    if (!content || !content.trim()) {
      toast.error(text("contentRequired"));
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);

      // Determine sharedTo based on user type and selections
      let sharedTo = "profile";
      if (isInstructor) {
        if (postType === "course" && selectedCourse) {
          sharedTo = "course";
          formData.append("course", selectedCourse);
        } else if (postType === "service" && selectedPackage) {
          sharedTo = "package";
          formData.append("package", selectedPackage);
        } else if (postType === "profile") {
          sharedTo = "profile";
        } else {
          toast.error(
            postType === "course"
              ? text("pleaseSelectCourse")
              : text("pleaseSelectService"),
          );
          setIsLoading(false);
          return;
        }
      }

      formData.append("sharedTo", sharedTo);

      if (media) {
        formData.append("imageCover", media[coverImageIndex]);
        media
          .filter((file, index) => index !== coverImageIndex)
          .forEach((file) => {
            formData.append("images", file);
          });
      } else {
        toast.error(text("pleaseSelectImage"));
        setIsLoading(false);
        return;
      }

      const res = await axiosInstance.post("/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prevData) => [res.data.data, ...prevData]);
      setContent("");
      setMedia(null);
      setCoverImageIndex(0);
      setPostType("profile");
      setSelectedCourse("");
      setSelectedPackage("");
      setIsExpanded(false);
      toast.success(text("postCreatedSuccessfully"));
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const composerPlaceholder = text("whatIsOnYourMind", {
    name: user?.name || "",
  });

  const audienceOptions: Array<{
    value: "profile" | "course" | "service";
    label: string;
  }> = [
    { value: "profile", label: text("onMyProfile") },
    { value: "course", label: text("relatedToCourse") },
    { value: "service", label: text("postOptionRelatedToService") },
  ];

  const handleAudienceChange = (value: "profile" | "course" | "service") => {
    setPostType(value);
    setSelectedCourse("");
    setSelectedPackage("");
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground transition-all duration-300 hover:border-primary/20">
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        className="group flex w-full cursor-pointer items-center gap-3 p-4 text-start transition-colors hover:bg-primary/5 sm:p-5"
        aria-expanded={isExpanded}
      >
        <UserAvatar user={user || undefined} size="md" />
        <span className="min-w-0 flex-1 truncate rounded-full border border-primary/10 bg-background-2 px-4 py-3 text-sm font-medium text-text-3 transition-colors group-hover:border-primary/20">
          {content.trim() || composerPlaceholder}
        </span>
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/10 bg-background-2 text-text-3 transition-colors hover:border-primary/30 hover:text-primary">
          <ChevronDown
            className={cn("size-4 transition-transform duration-300", {
              "rotate-180": isExpanded,
            })}
          />
        </span>
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-primary/10 p-4 pt-5 sm:p-5">
            {isInstructor && (
              <div className="mb-4 rounded-2xl border border-primary/10 bg-background-2 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-clear-ground px-3 py-2 text-xs font-bold text-text-2">
                    <Layers3 className="size-4 text-primary" />
                    {text("createPostAudience")}
                  </span>

                  {audienceOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleAudienceChange(option.value)}
                      className={cn(
                        "inline-flex h-10 cursor-pointer items-center rounded-full border px-4 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5",
                        postType === option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-primary/10 bg-clear-ground text-text-3 hover:border-primary/30 hover:text-primary",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {postType === "course" && (
                  <div className="mt-3 rounded-xl border border-primary/10 bg-clear-ground p-3">
                    <Select
                      value={selectedCourse}
                      onValueChange={setSelectedCourse}
                      disabled={loadingCourses}
                    >
                      <SelectTrigger className="h-12 w-full rounded-xl border-primary/10 bg-background-2 px-4 text-sm font-semibold text-text-2 shadow-none">
                        <SelectValue
                          placeholder={
                            loadingCourses
                              ? text("loading")
                              : inputs("SelectCourse")
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem value={course._id} key={course._id}>
                            {getDynamicString(course.title)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {postType === "service" && (
                  <div className="mt-3 rounded-xl border border-primary/10 bg-clear-ground p-3">
                    <Select
                      value={selectedPackage}
                      onValueChange={setSelectedPackage}
                      disabled={loadingPackages}
                    >
                      <SelectTrigger className="h-12 w-full rounded-xl border-primary/10 bg-background-2 px-4 text-sm font-semibold text-text-2 shadow-none">
                        <SelectValue
                          placeholder={
                            loadingPackages
                              ? text("loading")
                              : inputs("selectService")
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem value={pkg._id} key={pkg._id}>
                            {getDynamicString(pkg.title)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-start gap-3">
              <UserAvatar user={user || undefined} size="md" />
              <TextWithEmojiBox
                text={content}
                setText={setContent}
                media={media}
                setMedia={setMedia}
                multiMedia
                placeholder={composerPlaceholder}
                className="m-0 w-full border-none p-0"
                textClassName="min-h-36 rounded-2xl border-primary/10 bg-background-2 px-4 pb-16 pt-4 text-sm leading-6 shadow-none focus-visible:ring-1 focus-visible:ring-primary/20"
                toolsPosition="end"
                mediaIcon={<ImagePlus className="size-4" />}
                handleSend={handelCreatePost}
                isLoading={isLoading}
                inputRef={inputRef}
              />
            </div>

            {media && media.length > 0 && (
              <div className="mt-4 rounded-2xl border border-primary/10 bg-background-2 p-3">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {media.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className={cn(
                        "group relative overflow-hidden rounded-xl border bg-clear-ground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30",
                        coverImageIndex === index
                          ? "border-primary"
                          : "border-primary/10",
                      )}
                    >
                      <Image
                        width={240}
                        height={180}
                        src={mediaPreviews[index]}
                        alt={`media-${index}`}
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute end-2 top-2 inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-primary/10 bg-clear-ground/95 text-text-3 backdrop-blur-sm transition hover:scale-105 hover:text-primary"
                        title="Set as cover image"
                        onClick={() => setCoverImageIndex(index)}
                      >
                        <FaStar
                          className={cn({
                            "text-primary": coverImageIndex === index,
                          })}
                          size={16}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatePost;
