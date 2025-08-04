import { IReview } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import UserAvatar from "../UserAvatar";
import { useLocale, useTranslations } from "next-intl";
import { FaReply, FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useAuth } from "../auth-provider";
import { useRouter } from "@/i18n/routing";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";

import { Button } from "../ui/button";
import { AiFillDelete } from "react-icons/ai";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
type ReviewType = "system" | "course";
interface TestimonialsProps {
  reviewType: ReviewType;
  review: IReview;
}
const TestimonialCard: React.FC<TestimonialsProps> = ({
  review,
  reviewType,
}) => {
  const locale = useLocale();
  const { ratings, title, user } = review;
  return (
    <div className="flex relative flex-col gap-4 items-center px-4 py-6 text-center rounded-3xl sm:gap-5 sm:px-6 sm:py-8 bg-muted">
      <ReviewActions reviewType={reviewType} review={review} />
      <UserAvatar
        user={user}
        size="lg"
        className="w-20 h-20"
        innerClassName="bg-background"
      />
      <h4>{user?.name}</h4>
      <div className="flex gap-2 items-center">
        {Array.from({ length: 5 }).map((_, index) => {
          const starFillPercentage = Math.max(
            0,
            Math.min(100, (ratings - index) * 100)
          );
          return (
            <div key={index} className="relative w-5 h-5 sm:w-6 sm:h-6">
              <FaStar className="sm:w-6 w-5 sm:h-6 h-5 text-gray-300 p-0.5" />
              <div
                className={cn("absolute top-0 overflow-hidden", {
                  "right-0": locale === "ar",
                  "left-0": locale,
                })}
                style={{ width: `${starFillPercentage}%` }}
              >
                <FaStar className="sm:w-6 w-5 sm:h-6 h-5 text-gold p-0.5" />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-sm sm:text-base text-text-2 line-clamp-3">{title}</p>
    </div>
  );
};
export const TestimonialCard2: React.FC<TestimonialsProps> = ({
  review,
  reviewType,
}) => {
  const { ratings, title, user } = review;
  return (
    <div className="flex relative flex-col gap-2 px-4 py-2 rounded-xl border sm:gap-3 sm:px-6 sm:p-4">
      <ReviewActions reviewType={reviewType} review={review} />
      <div className="flex gap-2 items-center">
        <UserAvatar className="w-12 h-12" user={user} />
        <div className="flex flex-col">
          <h4
            className="h6"
            style={{
              fontWeight: 400,
            }}
          >
            {user?.name}
          </h4>
          <DisplayReviewsStarts
            className="w-4 h-4 sm:w-5 sm:h-5"
            ratings={ratings}
            parentClassName="gap-0.5"
          />
        </div>
      </div>
      <p className="text-sm sm:text-base text-text-2">{title}</p>
    </div>
  );
};
const DisplayReviewsStarts = ({
  ratings,
  className = "w-5 h-5 sm:w-6 sm:h-6",
  parentClassName = "gap-2",
}: {
  ratings: number;
  className?: string;
  parentClassName?: string;
}) => {
  const locale = useLocale();
  return (
    <div className={cn("flex items-center", parentClassName)}>
      {Array.from({ length: 5 }).map((_, index) => {
        const starFillPercentage = Math.max(
          0,
          Math.min(100, (ratings - index) * 100)
        );
        return (
          <div key={index} className={cn("relative", className)}>
            <FaStar className={cn("text-gray-300 p-0.5", className)} />
            <div
              className={cn("absolute top-0 overflow-hidden", {
                "right-0": locale === "ar",
                "left-0": locale,
              })}
              style={{ width: `${starFillPercentage}%` }}
            >
              <FaStar className={cn("text-gold p-0.5", className)} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default TestimonialCard;

interface ReviewActionsProps {
  review: IReview;
  reviewType: ReviewType;
}
const ReviewActions: React.FC<ReviewActionsProps> = ({
  review,
  reviewType,
}) => {
  const [isInClient, setIsInClient] = useState(false);
  useEffect(() => {
    setIsInClient(true);
  }, []);

  const router = useRouter();
  const text = useTranslations("reviews");
  const { user: thisUser, token } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const replySubmitButtonRef = useRef<HTMLButtonElement>(null);
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const axiosInstance = await createClientAxiosInstance();
      await axiosInstance.delete(
        `/${reviewType === "system" ? "systemReviews" : "reviews"}/${
          review._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsDeleting(false);
      toast.success(text("delete_success"));
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(text("something_wrong"));
    } finally {
      setIsLoading(false);
    }
  };
  const handleReply = async () => {
    setIsLoading(true);
    try {
      const axiosInstance = await createClientAxiosInstance();
      await axiosInstance.put(
        `/${reviewType === "system" ? "systemReviews" : "reviews"}/${
          review._id
        }/reply`,
        {
          reply: reply,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsReplying(false);
      toast.success(text("reply_success"));
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(text("something_wrong"));
    } finally {
      setIsLoading(false);
    }
  };
  if (thisUser?.role !== "admin" || !isInClient) return null;
  return (
    <>
      <div className="flex absolute top-2 gap-2 end-2">
        <Button
          onClick={() => {
            setIsReplying(true);
          }}
          size={"icon"}
          variant={"outline"}
          className="flex justify-center items-center"
        >
          <FaReply size={18} />
          <span className="sr-only">{text("reply")}</span>
        </Button>
        <Button
          onClick={() => {
            setIsDeleting(true);
          }}
          size={"icon"}
          variant={"outline"}
          className="flex justify-center items-center"
        >
          <AiFillDelete size={18} />
          <span className="sr-only">{text("delete")}</span>
        </Button>
      </div>
      <Dialog open={isReplying} onOpenChange={setIsReplying}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{text("review_reply")}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleReply();
            }}
          >
            <div className="space-y-3">
              <Label htmlFor="name">{text("reply")}</Label>
              <Textarea
                disabled={isLoading}
                required
                onChange={(e) => {
                  setReply(e.target.value);
                }}
              />
            </div>
            <button className="hidden" ref={replySubmitButtonRef}>
              {text("submit")}
            </button>
          </form>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => {
                setIsReplying(false);
              }}
            >
              {text("cancel")}
            </Button>
            <Button
              disabled={isLoading}
              onClick={() => {
                replySubmitButtonRef.current?.click();
              }}
            >
              {text("reply")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text("are_you_sure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {text("delete_confirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isLoading}
              onClick={() => {
                setIsDeleting(false);
              }}
            >
              {text("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={handleDelete}>
              {text("continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
