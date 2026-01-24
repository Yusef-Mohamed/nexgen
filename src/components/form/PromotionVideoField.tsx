"use client";
import React, { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Play } from "lucide-react";

interface PromotionVideoFieldProps {
  form: UseFormReturn<any>;
  name: string;
  commonFormStyles?: string;
  loading?: boolean;
}

const PromotionVideoField: React.FC<PromotionVideoFieldProps> = ({
  form,
  name,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("courses");

  // Extract YouTube video ID and convert to embed URL
  const extractYouTubeEmbedUrl = useCallback((input: string): string | null => {
    if (!input || input.trim() === "") return null;

    let videoId: string | null = null;

    // Check if it's already an embed URL or contains embed URL (for iframe code)
    const embedMatch = input.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) {
      videoId = embedMatch[1];
    }
    // Check if it's a watch URL
    else {
      const watchMatch = input.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
      if (watchMatch) {
        videoId = watchMatch[1];
      }
      // Check if it's a short URL (youtu.be)
      else {
        const shortMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
        if (shortMatch) {
          videoId = shortMatch[1];
        }
      }
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return null;
  }, []);

  // Watch the promotion video field value
  const promotionVideoValue = form.watch(name);

  // Check if it's already an embed URL or extract from other formats
  const embedUrl = promotionVideoValue
    ? promotionVideoValue.startsWith("https://www.youtube.com/embed/")
      ? promotionVideoValue
      : extractYouTubeEmbedUrl(promotionVideoValue)
    : null;

  const handleValueChange = useCallback(
    (value: string) => {
      const embedUrl = extractYouTubeEmbedUrl(value);
      if (embedUrl) {
        form.setValue(name, embedUrl, { shouldValidate: true });
      } else {
        form.setValue(name, value, { shouldValidate: true });
      }
    },
    [form, name, extractYouTubeEmbedUrl]
  );

  return (
    <div className="space-y-4 mt-8">
      <FormLabel className="text-base block font-semibold">
        {text("promotion_video")}
      </FormLabel>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video Preview Placeholder */}
        <div className="shrink-0 w-full lg:w-[400px] h-[240px] bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden">
          {embedUrl ? (
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title="Promotion Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Play className="w-16 h-16 mb-2 opacity-60" />
            </div>
          )}
        </div>

        {/* Video URL Input */}
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-foreground">
              {text("promotion_video_instruction")}
            </p>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {text("accepted_formats")}
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>{text("promotion_video_format_1")}</li>
                <li>{text("promotion_video_format_2")}</li>
                <li>{text("promotion_video_format_3")}</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        handleValueChange(e.target.value);
                      }}
                      placeholder={text("enter_promotion_video_url")}
                      className={commonFormStyles}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionVideoField;
