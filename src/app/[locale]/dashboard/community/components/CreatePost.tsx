"use client";

import { CommunityPublishingNotice } from "@/components/community-safety";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import TextWithEmojiBox from "@/components/TextWithEmojiBox";
import UserAvatar from "@/components/UserAvatar";
import { cn, getDynamicString } from "@/lib/utils";
import { IPost } from "@/types";
import { useCommunityCategories } from "@/hooks/useCommunityCategories";
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
  defaultCategory = "",
  onCreated,
}: {
  setData?: React.Dispatch<React.SetStateAction<IPost[]>>;
  defaultCategory?: string;
  onCreated?: (post: IPost) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[] | null>(null);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, token } = useAuth();
  const text = useTranslations("community");
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const { data: categories = [], isPending: loadingCategories, isError: categoryError, refetch } = useCommunityCategories();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Generate object URLs for media files only once
  const mediaPreviews = useMemo(() => {
    return media?.map((file) => URL.createObjectURL(file)) || [];
  }, [media]);

  useEffect(() => () => {
    mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [mediaPreviews]);

  const handelCreatePost = async () => {
    if (isLoading) return;
    if (!selectedCategory || !categories.some((category) => category._id === selectedCategory)) {
      toast.error(text("pleaseSelectCategory"));
      return;
    }
    // Validate content is required
    if (!content || !content.trim()) {
      toast.error(text("contentRequired"));
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);

      formData.append("sharedTo", "category");
      formData.append("category", selectedCategory);

      if (media?.length) {
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
      setData?.((prevData) => [res.data.data, ...prevData]);
      onCreated?.(res.data.data);
      setContent("");
      setMedia(null);
      setCoverImageIndex(0);
      setSelectedCategory(defaultCategory);
      setIsExpanded(false);
      toast.success(text("postCreatedSuccessfully"));
    } catch {
      toast.error(text("failedToCreatePost"));
    } finally {
      setIsLoading(false);
    }
  };

  const composerPlaceholder = text("whatIsOnYourMind", {
    name: user?.name || "",
  });

  return (
    <section className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground transition-all duration-300 hover:border-primary/20">
      <CommunityPublishingNotice />
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
            <div className="mb-4 rounded-2xl border border-primary/10 bg-background-2 p-3">
              <label htmlFor="post-category" className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-2">
                <Layers3 className="size-4 text-primary" aria-hidden />
                {text("category")}
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                disabled={isLoading || loadingCategories || categoryError || categories.length === 0}
              >
                <SelectTrigger id="post-category" className="h-12 w-full rounded-xl border-primary/10 bg-clear-ground px-4 text-sm font-semibold text-text-2 shadow-none">
                  <SelectValue placeholder={loadingCategories ? text("loading") : text("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem value={category._id} key={category._id}>
                      {getDynamicString(category.title)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categoryError && (
                <div role="alert" className="mt-3 text-sm">
                  <p className="text-destructive">{text("failedToLoadCategories")}</p>
                  <button type="button" onClick={() => void refetch()} className="mt-2 font-semibold text-primary">{text("tryAgain")}</button>
                </div>
              )}
              {!loadingCategories && !categoryError && categories.length === 0 && (
                <p className="mt-3 text-sm text-text-3">{text("noCategoriesAvailable")}</p>
              )}
            </div>

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
