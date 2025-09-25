"use client";

import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import TextWithEmojiBox from "@/components/TextWithEmojiBox";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { IPost } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState, useMemo } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

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
  const inputRef = useRef(null);

  // Generate object URLs for media files only once
  const mediaPreviews = useMemo(() => {
    return media?.map((file) => URL.createObjectURL(file)) || [];
  }, [media]);

  const handelCreatePost = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("sharedTo", "profile");
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
      toast.success(text("postCreatedSuccessfully"));
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  return (
    <div className="px-3 py-3 space-x-3 rounded-md bg-card cardShadow">
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
