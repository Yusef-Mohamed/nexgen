"use client";
import { IBlog } from "@/types";
import { useLocale } from "next-intl";
import Image from "next/image";
import React, { useState } from "react";
import { GiSandsOfTime } from "react-icons/gi";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { Link } from "@/i18n/routing";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { ShareButtons } from "@/components/cards/BlogsShareButtons";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface BlogCardProps extends IBlog {
  showActions?: boolean;
  onDelete?: (blogId: string) => void;
  editLink?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  _id,
  title,
  imageCover,
  createdAt,
  readTime,
  author,
  showActions = false,
  onDelete,
  editLink,
}) => {
  const locale = useLocale();
  const text = useTranslations("instructorBlogs");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!author) return null;

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(_id);
    }
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  return (
    <div className="flex flex-col h-full border rounded-lg p-4">
      <Link href={`/blogs/${_id}`} className="w-full">
        <Image
          src={imageCover}
          alt={title}
          width={430}
          height={240}
          className="object-cover w-full rounded-lg aspect-[1.79]"
        />
      </Link>
      <div className="flex flex-col justify-between flex-grow px-0 mt-4">
        <Link href={`/blogs/${_id}`} className="w-full">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        </Link>
        <div className="flex flex-row items-center justify-start w-full gap-4 text-sm text-text-2">
          <div className="flex items-center gap-2">
            <GiSandsOfTime />
            <div>
              {readTime} {locale === "ar" ? "د" : "min"}
            </div>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <CiCalendarDate />
            <div>
              {new Date(createdAt).toLocaleDateString(
                locale === "ar" ? "ar-EG" : "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <FaRegUser /> <div>{author?.name?.slice(0, 10)}</div>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 mt-4">
            {editLink && (
              <Link href={editLink} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  {text("edit")}
                </Button>
              </Link>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                onClick={handleDeleteClick}
                className="flex-1 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {text("delete")}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{text("confirmDelete")}</DialogTitle>
            <DialogDescription>
              {text("deleteConfirmationMessage")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              {text("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              {text("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface BlogCard2Props extends IBlog {
  isRow?: boolean;
  isMain?: boolean;
}

export const BlogCard2: React.FC<BlogCard2Props> = ({
  _id,
  title,
  imageCover,
  createdAt,
  description,
  isRow,
  author,
  readTime,
  isMain,
}) => {
  return (
    <article
      className={cn("flex flex-col w-full h-full", {
        "md:flex-row md:items-center md:gap-12": isRow,
      })}
    >
      <Link
        href={`/blogs/${_id}`}
        className={cn("w-full", {
          "md:basis-1/2": isRow,
        })}
      >
        <Image
          src={imageCover}
          alt={title}
          width={430}
          height={240}
          className="object-cover w-full rounded-2xl aspect-[1.79]"
        />
      </Link>
      <div
        className={cn(
          "flex flex-col justify-between flex-grow px-3 mt-5 sm:px-4 sm:mt-6",
          {
            "md:basis-1/2": isRow,
          }
        )}
      >
        <Link href={`/blogs/${_id}`} className="w-full">
          <h3 className="h5">{title}</h3>
        </Link>
        <p className="mt-1 text-text-2 sm:mt-2">{description}</p>
        <BlogUserComponent
          author={author}
          readTime={readTime}
          createdAt={createdAt}
        />
        {isMain && (
          <ShareButtons
            id={_id}
            className="flex items-center gap-4 mt-4 sm:mt-6"
          />
        )}
      </div>
    </article>
  );
};
export const BlogUserComponent = ({
  author,
  readTime,
  createdAt,
  className,
}: {
  author?: {
    name: string;
    profileImg: string;
  };
  readTime: number;
  createdAt: string;
  className?: string;
}) => {
  const locale = useLocale();
  return (
    <div className={cn("flex items-center gap-2 mt-2 sm:mt-4", className)}>
      <UserAvatar
        className="w-12 h-12"
        user={{
          name: author?.name || "",
          profileImg: author?.profileImg || "",
        }}
      />
      <div>
        <div className="text-sm text-text-1 sm:text-base">{author?.name}</div>
        <div className="text-xs sm:text-sm text-text-3">
          <span>
            {readTime} {locale === "ar" ? "د" : "min"}
          </span>{" "}
          .{" "}
          <span>
            {new Date(createdAt).toLocaleDateString(
              locale === "ar" ? "ar-EG" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
