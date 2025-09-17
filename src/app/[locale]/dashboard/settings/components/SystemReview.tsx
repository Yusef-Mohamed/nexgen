"use client";

import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { IReview } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

const SystemReview = () => {
  const { token } = useAuth();
  const router = useRouter();
  const text = useTranslations("learn");
  const [data, setData] = useState<{
    title: string;
    ratings: number;
  }>({
    title: "",
    ratings: 5,
  });
  const [idToEdit, setIdToEdit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getCurrentReview = async () => {
      axiosInstance
        .get("/systemReviews/myReviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const thisReview = res.data.data[
            res.data.data?.length - 1
          ] as IReview;
          if (!thisReview) return;
          setIdToEdit(thisReview?._id);
          setData({
            title: thisReview?.title,
            ratings: thisReview?.ratings,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCurrentReview();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token) {
      try {
        setIsLoading(true);

        if (idToEdit) {
          await axiosInstance.put(`/systemReviews/${idToEdit}`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          const res = await axiosInstance.post(`/systemReviews`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setIdToEdit(res.data.data._id);
        }
        toast.success(
          idToEdit
            ? text("reviewUpdatedSuccessfully")
            : text("reviewCreatedSuccessfully")
        );
        router.refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (token) {
      setIsLoading(true);
      try {
        await axiosInstance.delete(`/systemReviews/${idToEdit}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData({
          title: "",
          ratings: 5,
        });
        setIdToEdit("");
        toast.success(text("reviewDeletedSuccessfully"));
        router.refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <Image
        src="/images/system_reviews.png"
        width={220}
        height={220}
        alt="feedback"
        className="object-cover mx-auto aspect-square rounded-3xl"
      />
      <h2 className="mt-6 mb-8 text-center">
        {text("yourExperienceMattersToUsTellUsHowCanWeImproves")}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            {text("shareWithUsYourOpinionAndHelpUsImprove")}
          </Label>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setData((prev) => ({ ...prev, ratings: index + 1 }))
                }
                disabled={isLoading}
                className={cn(`text-2xl`, {
                  "text-primary": index < data.ratings,
                  "text-input": !(index < data.ratings),
                  "opacity-50": isLoading,
                })}
              >
                <FaStar />
              </button>
            ))}
          </div>
          <Textarea
            disabled={isLoading}
            id="title"
            name="title"
            value={data.title}
            placeholder={text("writeYourFeedbackExample")}
            className="min-h-20"
            required
            onChange={(e) =>
              setData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          {idToEdit && (
            <Button
              onClick={handleDelete}
              isLoading={isLoading}
              variant="destructive"
              className="w-[200px]"
            >
              {text("delete")}
            </Button>
          )}
          <Button
            isLoading={isLoading}
            type="submit"
            className="w-[200px] flex items-center justify-center"
          >
            {text("saveMyReview")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SystemReview;
