"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useCourseReviewStore } from "@/stores/CourseReview";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CreateCourseReviewProps {
  courseId: string;
}

const CreateCourseReview: React.FC<CreateCourseReviewProps> = ({
  courseId,
}) => {
  const { token } = useAuth();
  const router = useRouter();
  const text = useTranslations("learn");
  const {
    data,
    idToEdit,
    isLoading,
    setData,
    fetchReview,
    submitReview,
    deleteReview,
  } = useCourseReviewStore();

  useEffect(() => {
    if (token) {
      fetchReview(courseId, token);
    }
  }, [courseId, token, fetchReview]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token) {
      try {
        await submitReview(courseId, token);
        toast.success(
          idToEdit
            ? text("reviewUpdatedSuccessfully")
            : text("reviewCreatedSuccessfully"),
        );
        router.refresh();
      } catch {
        toast.error(text("something_wrong"));
      }
    }
  };

  const handleDelete = async () => {
    if (token) {
      try {
        await deleteReview(token);
        toast.success(text("reviewDeletedSuccessfully"));
        router.refresh();
      } catch {
        toast.error(text("something_wrong"));
      }
    }
  };

  return (
    <div className="rounded-2xl border border-primary/10 bg-background-2 p-4 sm:p-5">
      <h3 className="mb-4 text-lg font-black text-text-1">
        {idToEdit ? text("editYourReview") : text("addReview")}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            {text("shareWithUsYourOpinionAndHelpUsImprove")}
          </Label>
          <div className="flex items-center gap-2 rounded-xl border border-primary/10 bg-clear-ground p-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setData({ ratings: index + 1 })}
                disabled={isLoading}
                className={cn(
                  "rounded-lg p-1 text-2xl transition-transform hover:scale-110",
                  {
                    "text-primary": index < data.ratings,
                    "text-input": !(index < data.ratings),
                    "opacity-50": isLoading,
                  },
                )}
              >
                <Star className="size-7 fill-current" />
              </button>
            ))}
          </div>
          <Textarea
            disabled={isLoading}
            id="title"
            name="title"
            value={data.title}
            placeholder={text("writeYourFeedbackExample")}
            className="min-h-28 rounded-xl"
            required
            onChange={(e) => setData({ title: e.target.value })}
          />
        </div>

        <div className="flex flex-col-reverse items-stretch justify-end gap-3 sm:flex-row sm:items-center">
          {idToEdit && (
            <Button
              onClick={handleDelete}
              isLoading={isLoading}
              type="button"
              variant="destructive"
              className="w-full rounded-xl sm:w-[200px]"
            >
              {text("delete")}
            </Button>
          )}
          <Button
            isLoading={isLoading}
            type="submit"
            className="flex w-full items-center justify-center rounded-xl sm:w-[200px]"
          >
            {text("saveMyReview")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourseReview;
