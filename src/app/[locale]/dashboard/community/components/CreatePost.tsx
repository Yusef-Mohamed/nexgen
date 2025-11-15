"use client";

import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import TextWithEmojiBox from "@/components/TextWithEmojiBox";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { IPost, ICourse, IPackage } from "@/types";
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
import { Label } from "@/components/ui/label";
import { getDynamicString } from "@/lib/utils";

const CreatePost = ({
  setData,
}: {
  setData: React.Dispatch<React.SetStateAction<IPost[]>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[] | null>(null);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const { user, token } = useAuth();
  const text = useTranslations("community");
  const inputs = useTranslations("Forms");
  const inputRef = useRef(null);

  // Instructor-specific states
  const isInstructor = user?.isInstructor || user?.role === "instructor";
  const [postType, setPostType] = useState<"profile" | "course" | "service">(
    "profile"
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
              : text("pleaseSelectService")
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
      toast.success(text("postCreatedSuccessfully"));
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  return (
    <div className="px-3 py-3 space-x-3 rounded-md bg-card cardShadow">
      {" "}
      {isInstructor && (
        <div className="pb-3 flex gap-4 flex-wrap">
          <div className="space-y-2">
            <Label htmlFor="postType" className="text-sm">
              {text("sharedTo")}:
            </Label>
            <Select
              value={postType}
              onValueChange={(value: "profile" | "course" | "service") => {
                setPostType(value);
                setSelectedCourse("");
                setSelectedPackage("");
              }}
            >
              <SelectTrigger className="gap-4 bg-muted w-fit rounded text-muted-foreground border-none text-xs !h-10">
                <SelectValue placeholder={text("sharedTo")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profile">{text("onMyProfile")}</SelectItem>
                <SelectItem value="course">
                  {text("relatedToCourse")}
                </SelectItem>
                <SelectItem value="service">
                  {text("relatedToService")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {postType === "course" && (
            <div className="space-y-2">
              <Label htmlFor="course" className="text-sm">
                {inputs("course")}:
              </Label>
              <Select
                value={selectedCourse}
                onValueChange={setSelectedCourse}
                disabled={loadingCourses}
              >
                <SelectTrigger className="gap-4 bg-muted w-fit rounded text-muted-foreground border-none text-xs !h-10">
                  <SelectValue
                    placeholder={
                      loadingCourses ? text("loading") : inputs("SelectCourse")
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
            <div className="space-y-2">
              <Label htmlFor="service" className="text-sm">
                {inputs("service")}:
              </Label>
              <Select
                value={selectedPackage}
                onValueChange={setSelectedPackage}
                disabled={loadingPackages}
              >
                <SelectTrigger className="w-full">
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
      <div className="flex items-start justify-between gap-2">
        <UserAvatar user={user || undefined} size="md" />
        <TextWithEmojiBox
          text={content}
          setText={setContent}
          media={media}
          setMedia={setMedia}
          multiMedia
          placeholder={text("whatIsOnYourMind", {
            name: user?.name || "",
          })}
          className="w-full p-0 m-0 border-none"
          handleSend={handelCreatePost}
          isLoading={isLoading}
          inputRef={inputRef}
        />
      </div>
      <div className="pt-3">
        {media && media.length > 0 && (
          <div className="flex justify-center gap-2">
            {media.map((file, index) => (
              <div key={index} className="relative">
                <Image
                  width={120}
                  height={120}
                  src={mediaPreviews[index]} // Use memoized URLs
                  alt={`media-${index}`}
                  className={`w-32 h-32 object-contain rounded-md ${
                    coverImageIndex === index
                      ? "border-2 border-primary"
                      : "border"
                  }`}
                />
                <button
                  className="absolute p-1 bg-white rounded-full shadow-md top-2 right-2"
                  title="Set as cover image"
                  onClick={() => setCoverImageIndex(index)}
                >
                  <FaStar
                    className={cn("text-text-3", {
                      "text-primary": coverImageIndex === index,
                    })}
                    size={20}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
