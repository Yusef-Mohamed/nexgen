import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CourseFormSchema } from "../../hooks/useCourseForm";

interface Step6MessagesProps {
  form: UseFormReturn<CourseFormSchema>;
  commonFormStyles: string;
  loading?: boolean;
}

const Step6Messages: React.FC<Step6MessagesProps> = ({
  form,
  commonFormStyles,
  loading = false,
}) => {
  const text = useTranslations("courses");

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {text("course_messages")}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {text("course_messages_description")}
        </p>
      </div>

      {/* Welcome Message */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {text("welcome_message") || "Welcome Message"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="courseWelcomeMessage.en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {text("welcome_message")} ({text("english")})
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    placeholder={text("enter_welcome_message_english")}
                    rows={6}
                    className={cn(commonFormStyles, "!rounded-e-none")}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="courseWelcomeMessage.ar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {text("welcome_message")} ({text("arabic")})
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    placeholder={text("enter_welcome_message_arabic")}
                    rows={6}
                    className={cn(commonFormStyles, "!rounded-e-none")}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Goodbye / Congratulation Message */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {text("goodbye_message") || "Congratulation Message"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="goodByeMessage.en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {text("goodbye_message")} ({text("english")})
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    placeholder={text("enter_goodbye_message_english")}
                    rows={6}
                    className={cn(commonFormStyles, "!rounded-e-none")}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="goodByeMessage.ar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {text("goodbye_message")} ({text("arabic")})
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    placeholder={text("enter_goodbye_message_arabic")}
                    rows={6}
                    className={cn(commonFormStyles, "!rounded-e-none")}
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
  );
};

export default Step6Messages;
