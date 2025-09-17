import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { CourseFormData } from "../../types/formTypes";

interface Step4AppearanceFinalizationProps {
  form: UseFormReturn<CourseFormData>;
  commonFormStyles: string;
}

const Step4AppearanceFinalization: React.FC<
  Step4AppearanceFinalizationProps
> = ({ form, commonFormStyles }) => {
  const text = useTranslations("courses");

  // Watch form values for preview
  const bgColor = form.watch("bgColor");
  const bgDarkMode = form.watch("bgDarkMode");
  const fontColor = form.watch("fontColor");
  const fontDarkMode = form.watch("fontDarkMode");
  const title = form.watch("title");

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {text("step4_title")}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 px-2">
          {text("step4_description")}
        </p>
      </div>

      {/* Color Customization */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">{text("course_colors")}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="bgColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text("background_color")}</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      type="color"
                      {...field}
                      className={commonFormStyles}
                    />
                    <div className="text-xs text-gray-500">{field.value}</div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bgDarkMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text("background_dark_mode")}</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      type="color"
                      {...field}
                      className={commonFormStyles}
                    />
                    <div className="text-xs text-gray-500">{field.value}</div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fontColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text("font_color")}</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      type="color"
                      {...field}
                      className={commonFormStyles}
                    />
                    <div className="text-xs text-gray-500">{field.value}</div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fontDarkMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{text("font_dark_mode")}</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      type="color"
                      {...field}
                      className={commonFormStyles}
                    />
                    <div className="text-xs text-gray-500">{field.value}</div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Color Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{text("color_preview")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Light Mode Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {text("light_mode_preview")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="p-4 rounded-md border"
                style={{
                  backgroundColor: bgColor,
                  color: fontColor,
                }}
              >
                <h4 className="font-semibold mb-2">
                  {title?.en || text("sample_course_title")}
                </h4>
                <p className="text-sm opacity-80">
                  {text("sample_course_description")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dark Mode Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                {text("dark_mode_preview")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="p-4 rounded-md border"
                style={{
                  backgroundColor: bgDarkMode,
                  color: fontDarkMode,
                }}
              >
                <h4 className="font-semibold mb-2">
                  {title?.en || text("sample_course_title")}
                </h4>
                <p className="text-sm opacity-80">
                  {text("sample_course_description")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Final Review Summary */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            {text("ready_to_create")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            {text("review_and_submit_description")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step4AppearanceFinalization;
