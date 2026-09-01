"use client";
import React, { useCallback } from "react";
import {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";
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
import {
  getYouTubeEmbedUrl,
  YOUTUBE_IFRAME_ALLOW,
  YOUTUBE_IFRAME_REFERRER_POLICY,
} from "@/lib/youtube";

interface PromotionVideoFieldProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  commonFormStyles?: string;
  loading?: boolean;
}

const PromotionVideoField = <TFieldValues extends FieldValues,>({
  form,
  name,
  commonFormStyles,
  loading = false,
}: PromotionVideoFieldProps<TFieldValues>) => {
  const text = useTranslations("courses");

  const extractYouTubeEmbedUrl = useCallback(
    (input: string) => getYouTubeEmbedUrl(input),
    [],
  );

  // Watch the promotion video field value
  const watchedValue = form.watch(name);
  const promotionVideoValue =
    typeof watchedValue === "string" ? watchedValue : "";

  // Check if it's already an embed URL or extract from other formats
  const embedUrl = promotionVideoValue
    ? extractYouTubeEmbedUrl(promotionVideoValue)
    : null;

  const handleValueChange = useCallback(
    (value: string) => {
      const embedUrl = extractYouTubeEmbedUrl(value);
      if (embedUrl) {
        form.setValue(
          name,
          embedUrl as PathValue<TFieldValues, Path<TFieldValues>>,
          { shouldValidate: true },
        );
      } else {
        form.setValue(
          name,
          value as PathValue<TFieldValues, Path<TFieldValues>>,
          { shouldValidate: true },
        );
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
              allow={YOUTUBE_IFRAME_ALLOW}
              referrerPolicy={YOUTUBE_IFRAME_REFERRER_POLICY}
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
