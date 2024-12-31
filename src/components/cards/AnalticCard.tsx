import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { createClientAxiosInstance } from "@/app/lib/utils";
import ImageWithZoom from "../ImageWithZoom";
const isPDF = (url: string) => url.endsWith(".pdf");

const AnalyticCard = ({
  analytic,
  setAnalytics,
}: {
  analytic: IAnalytic;
  setAnalytics: React.Dispatch<React.SetStateAction<IAnalytic[]>>;
}) => {
  console.log(analytic);
  const text = useTranslations("practice");
  const myAccount = JSON.parse(getCookie("user") || "{}");
  const [marketerComment, setMarketerComment] = useState(
    analytic?.marketerComment || ""
  );
  const [isPassed, setIsPassed] = useState(analytic?.isPassed || false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocusedView, setIsFocusedView] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const isMyChild = myAccount._id === analytic.marketer;
  const isAdmin = myAccount.role === "admin";

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const axiosInstance = createClientAxiosInstance();
      const res = await axiosInstance.put(
        `/analytics/${analytic._id}`,
        { marketerComment, isPassed },
        { headers: { Authorization: `Bearer ${getCookie("token")}` } }
      );

      if (setAnalytics) {
        setAnalytics((prev) =>
          prev.map((item) => (item._id === analytic._id ? res.data.data : item))
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
      const axiosInstance = createClientAxiosInstance();
      await axiosInstance.delete(`/analytics/${analytic._id}`, {
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      });
      if (setAnalytics) {
        setAnalytics((prev) =>
          prev.filter((item) => item._id !== analytic._id)
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
          "grid-cols-2": images.length >= 2,
        })}
      >
        <Image
          width={600}
          height={600}
          src={images[0]}
          alt=""
          className="object-cover w-full rounded-md aspect-video"
        />
        {images.length >= 2 && (
          <div className="relative">
            <Image
              width={600}
              height={600}
              src={images[1]}
              alt=""
              className="object-cover w-full rounded-md aspect-video"
            />
            {images.length > 2 && (
              <>
                <div className="absolute inset-0 flex items-center justify-center opacity-25 bg-background" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">
                    +{images.length - 2}
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full p-3 rounded-md sm:p-6 bg-background">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <UserAvatar user={analytic.user} />
            <div className="flex flex-col">
              <h4>{analytic.user?.name}</h4>
              <span className="text-sm max-sm:text-xs text-muted-foreground">
                {new Date(analytic.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <BsThreeDots />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <button
                    onClick={() => setIsDeleting(true)}
                    className="flex items-center gap-2 text-destructive"
                  >
                    <AiFillDelete size={18} />
                    {text("delete")}
                  </button>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className="my-2 sm:my-4 max-sm:text-sm">{analytic.content}</p>

        {renderMediaGrid()}

        {!isEditing && analytic.marketerComment && (
          <div className="p-4 mt-4 border rounded-md bg-muted/30">
            <div className="flex items-center gap-4">
              <p className="flex-1">{analytic.marketerComment}</p>
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 border rounded-full",
                  {
                    "text-destructive border-destructive": !analytic.isPassed,
                    "text-primary border-primary": analytic.isPassed,
                  }
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
            <div className="flex justify-center gap-4">
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
      </CardContent>

      {/* Focused Image View Dialog */}
      <Dialog open={isFocusedView} onOpenChange={setIsFocusedView}>
        <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-hidden bg-background p-0 gap-0">
          <DialogHeader className="sticky top-0 z-10 p-4 text-center border-b bg-background">
            <DialogTitle>{text("preview")}</DialogTitle>
          </DialogHeader>
          <div className="relative">
            {analytic.media &&
              analytic.media.filter((m) => !isPDF(m)).length > 1 && (
                <div className="absolute right-0 flex justify-between w-full px-4 -translate-y-1/2 top-1/2">
                  <button
                    onClick={() => {
                      const images = analytic.media!.filter((m) => !isPDF(m));
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      );
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => {
                      const images = analytic.media!.filter((m) => !isPDF(m));
                      setSelectedImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            <div className="flex items-center justify-center bg-muted">
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
    </Card>
  );
};

export const AnalyticCardSkeleton = () => {
  return (
    <Card className="w-full p-3 rounded-md sm:p-6 bg-background">
      <CardContent className="p-0">
        {/* Header with avatar and name */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Avatar skeleton */}
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            <div className="flex flex-col gap-2">
              {/* Name skeleton */}
              <div className="w-32 h-4 rounded-md bg-muted animate-pulse" />
              {/* Date skeleton */}
              <div className="w-24 h-3 rounded-md bg-muted animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="my-2 space-y-2 sm:my-4">
          <div className="w-full h-4 rounded-md bg-muted animate-pulse" />
          <div className="w-3/4 h-4 rounded-md bg-muted animate-pulse" />
          <div className="w-1/2 h-4 rounded-md bg-muted animate-pulse" />
        </div>

        {/* Media skeleton */}
        <div className="grid grid-cols-2 gap-0.5 mt-4">
          <div className="w-full rounded-md bg-muted animate-pulse aspect-video" />
          <div className="w-full rounded-md bg-muted animate-pulse aspect-video" />
        </div>

        {/* Comment box skeleton */}
        <div className="p-4 mt-4 border rounded-md bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <div className="w-full h-4 rounded-md bg-muted animate-pulse" />
              <div className="w-3/4 h-4 rounded-md bg-muted animate-pulse" />
            </div>
            {/* Status circle skeleton */}
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex justify-center gap-4 mt-4">
          <div className="rounded-md w-28 h-9 bg-muted animate-pulse" />
          <div className="rounded-md w-28 h-9 bg-muted animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticCard;
