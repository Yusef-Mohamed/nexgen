"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { getCookie } from "cookies-next";
import Image from "next/image";
import UserAvatar from "../UserAvatar";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { IAnalytic } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import ImageWithZoom from "../ImageWithZoom";
import { useAuth } from "../auth-provider";
const isPDF = (url: string) => url.endsWith(".pdf");

const AnalyticCard = ({
  analytic,
  setAnalytics,
}: {
  analytic: IAnalytic;
  setAnalytics: React.Dispatch<React.SetStateAction<IAnalytic[]>>;
}) => {
  const text = useTranslations("practice");
  const { user } = useAuth();
  const [marketerComment, setMarketerComment] = useState(
    analytic?.marketerComment || "",
  );
  const [isPassed, setIsPassed] = useState(analytic?.isPassed || false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocusedView, setIsFocusedView] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const isMyChild = user?._id === analytic.marketer || user?.isInstructor;
  const isAdmin = user?.role === "admin";

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const res = await axiosInstance.put(
        `/analytics/${analytic._id}`,
        { marketerComment, isPassed, isSeen: true },
        { headers: { Authorization: `Bearer ${getCookie("token")}` } },
      );

      if (setAnalytics) {
        setAnalytics((prev) =>
          prev.map((item) =>
            item._id === analytic._id ? res.data.data : item,
          ),
        );
      }
      setIsEditing(false);
      setIsOpen(false);
      toast.success(text("yourCommentIsAddedSuccessfully"));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      await axiosInstance.delete(`/analytics/${analytic._id}`, {
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      });
      if (setAnalytics) {
        setAnalytics((prev) =>
          prev.filter((item) => item._id !== analytic._id),
        );
      }
      setIsDeleting(false);
      toast.success(text("deletedSuccessfully"));
    } catch (err) {
      console.error(err);
    }
  };

  const renderMediaGrid = () => {
    const images = analytic.media?.filter((m) => !isPDF(m));
    if (!images || images.length === 0) return null;

    return (
      <div
        onClick={() => setIsFocusedView(true)}
        className={cn(`grid gap-0.5 cursor-pointer`, {
          "grid-cols-1": images.length === 1,
          "grid-cols-2": images.length > 1,
        })}
      >
        {images.length === 1 && (
          <Image
            width={600}
            height={600}
            src={images[0]}
            alt=""
            className="object-cover w-full aspect-video"
          />
        )}
        {images.length > 1 && (
          <>
            <Image
              width={600}
              height={600}
              src={images[0]}
              alt=""
              className="object-cover w-full aspect-video"
            />
            <div className="relative w-full">
              <Image
                width={100}
                height={100}
                src={images[1]}
                alt=""
                className="object-cover w-full aspect-video"
              />
              <div className="flex items-center justify-center bg-background opacity-25 z-1 w-full h-full absolute top-0 right-0" />
              <div className="flex items-center justify-center z-2 w-full h-full absolute top-0 right-0">
                <span className="text-4xl font-bold">+{images.length - 1}</span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full rounded-md cardShadow bg-background-2">
      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size={"sm"}
              variant="outline"
              className="absolute top-4 left-4"
            >
              <BsThreeDots />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel asChild>
              <button
                onClick={() => setIsDeleting(true)}
                className="flex gap-2 w-full"
              >
                <AiFillDelete size={18} />
                {text("delete")}
              </button>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <div className="p-3">
        <div className="flex items-center gap-2">
          <UserAvatar user={analytic.user} />
          <div className="flex flex-col">
            <h4 className="text-sm">{analytic.user?.name}</h4>
            <span className="text-xs text-muted-foreground">
              {new Date(analytic.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <p className="mt-1 px-2 text-sm">
          {analytic.content.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              {index !== analytic.content.split("\n").length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>

      {renderMediaGrid()}

      <div className="p-3">
        {!isEditing && analytic.marketerComment && (
          <div className="p-4 mt-4 rounded-md border bg-muted/30">
            <div className="flex gap-4 items-center">
              <p className="flex-1">{analytic.marketerComment}</p>
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 border rounded-full",
                  {
                    "text-destructive border-destructive": !analytic.isPassed,
                    "text-primary border-primary": analytic.isPassed,
                  },
                )}
              >
                {analytic.isPassed ? <FaCheck /> : <IoMdClose />}
              </div>
            </div>
            {isMyChild && (
              <Button
                onClick={() => {
                  setIsEditing(true);
                  setMarketerComment(analytic.marketerComment || "");
                  setIsPassed(analytic.isPassed);
                }}
                variant="outline"
                className="mt-2"
              >
                {text("edit")}
              </Button>
            )}
          </div>
        )}

        {isMyChild && (isEditing || !analytic.marketerComment) && (
          <div className="mt-4">
            <Textarea
              value={marketerComment}
              onChange={(e) => setMarketerComment(e.target.value)}
              placeholder={text("commentPlaceholder")}
              className="mb-4"
            />
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setIsPassed(false);
                  setIsOpen(true);
                }}
                className="text-destructive"
              >
                <IoMdClose className="mr-2" />
                {text("reject")}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsPassed(true);
                  setIsOpen(true);
                }}
                className="text-primary"
              >
                <FaCheck className="mr-2" />
                {text("approve")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Focused Image View Dialog */}
      <Dialog open={isFocusedView} onOpenChange={setIsFocusedView}>
        <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-hidden bg-background p-0 gap-0">
          <DialogHeader className="sticky top-0 z-10 p-4 text-center border-b bg-background">
            <DialogTitle>{text("preview")}</DialogTitle>
            <DialogDescription className="sr-only">
              {analytic.content}
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            {analytic.media &&
              analytic.media.filter((m) => !isPDF(m)).length > 1 && (
                <div className="flex absolute right-0 top-1/2 justify-between px-4 w-full -translate-y-1/2">
                  <button
                    onClick={() => {
                      const images = analytic.media!.filter((m) => !isPDF(m));
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1,
                      );
                    }}
                    className="flex justify-center items-center w-8 h-8 rounded-full bg-background/80"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => {
                      const images = analytic.media!.filter((m) => !isPDF(m));
                      setSelectedImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1,
                      );
                    }}
                    className="flex justify-center items-center w-8 h-8 rounded-full bg-background/80"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            <div className="flex justify-center items-center bg-muted">
              <ImageWithZoom
                width={600}
                height={600}
                src={
                  analytic.media?.filter((m) => !isPDF(m))[
                    selectedImageIndex
                  ] || ""
                }
                alt=""
                className="w-full max-h-[80vh] aspect-square object-contain"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text("areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {text("youWillNotBeAbleToRevert")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              {text("cancel")}
            </Button>
            <Button disabled={isLoading} onClick={handleSubmit}>
              {text("iamSure")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text("areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {text("youWillNotBeAbleToRevert")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleting(false)}
              disabled={isLoading}
            >
              {text("cancel")}
            </Button>
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={handleDelete}
            >
              {text("iamSure")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const AnalyticCardSkeleton = () => {
  return (
    <div className="w-full rounded-md animate-pulse bg-background-2">
      <div className="flex gap-2 items-center px-4 pt-4 my-2 sm:my-4">
        <div className="w-12 h-12 rounded-full animate-pulse bg-muted-foreground"></div>
        <div className="flex flex-col gap-2">
          <div className="w-12 h-2 rounded-xl animate-pulse bg-muted-foreground" />
          <div className="w-16 h-1 rounded-xl animate-pulse bg-muted-foreground" />
        </div>
      </div>
      <div className="px-5 my-2 sm:my-4">
        <div className="mb-2 w-full h-2 rounded-xl animate-pulse bg-muted-foreground" />
        <div className="w-1/2 h-2 rounded-xl animate-pulse bg-muted-foreground" />
      </div>
      <div className="w-full animate-pulse aspect-video bg-muted-foreground" />
      <div className="flex gap-4 justify-center items-center p-2 m-2 border-t">
        <button className="py-1 w-full h-8 rounded-md animate-pulse bg-muted-foreground"></button>
        <button className="py-1 w-full h-8 rounded-md animate-pulse bg-muted-foreground"></button>
      </div>
    </div>
  );
};

export default AnalyticCard;
