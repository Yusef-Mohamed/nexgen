"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { axiosInstance } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useAuth } from "@/components/auth-provider";
import { AiFillDelete } from "react-icons/ai";
import { ArrowLeft, Plus } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface BlogFormData {
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  content: {
    en: string;
    ar: string;
  };
  readTime: string;
}

const commonFormStyles =
  "!px-4 !py-3 !h-auto !rounded-md min-h-12 items-center";

// ReactQuill configuration
const quillModules = {
  toolbar: [
    [{ header: "2" }, { header: "3" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

const BlogFormClient = () => {
  const params = useParams();
  const router = useRouter();
  const instructorText = useTranslations("instructorBlogs");
  const { user } = useAuth();
  const id = params?.id as string;
  const isEdit = id !== "new";

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEdit);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState<BlogFormData>({
    title: {
      en: "",
      ar: "",
    },
    description: {
      en: "",
      ar: "",
    },
    content: {
      en: "",
      ar: "",
    },
    readTime: "",
  });

  // Fetch blog data for editing
  useEffect(() => {
    const fetchBlog = async () => {
      if (!isEdit) return;

      try {
        setFetchingData(true);
        const response = await axiosInstance.get(`/articals/${id}`);
        const blogData = response?.data?.data;

        if (blogData) {
          setFormData({
            title: {
              en: blogData.translationTitle?.en || blogData.title || "",
              ar: blogData.translationTitle?.ar || blogData.title || "",
            },
            description: {
              en:
                blogData.translationDescription?.en ||
                blogData.description ||
                "",
              ar:
                blogData.translationDescription?.ar ||
                blogData.description ||
                "",
            },
            content: {
              en: blogData.translationContent?.en || blogData.content || "",
              ar: blogData.translationContent?.ar || blogData.content || "",
            },
            readTime: blogData.readTime?.toString() || "",
          });

          if (blogData.imageCover) {
            setImagePreview(blogData.imageCover);
          }
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        const typedError = error as AxiosError<{ message: string }>;
        const errorMessage =
          typedError?.response?.data?.message || typedError?.message;
        toast.error(errorMessage || "Failed to load blog data");
      } finally {
        setFetchingData(false);
      }
    };

    fetchBlog();
  }, [id, isEdit]);

  const handleInputChange = (
    field: keyof BlogFormData,
    lang: "en" | "ar" | null,
    value: string
  ) => {
    setFormData((prev) => {
      if (
        lang &&
        (field === "title" || field === "description" || field === "content")
      ) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [lang]: value,
          },
        };
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.en ||
      !formData.title.ar ||
      !formData.description.en ||
      !formData.description.ar ||
      !formData.content.en ||
      !formData.content.ar ||
      !formData.readTime ||
      !user?._id
    ) {
      toast.error(instructorText("pleaseFillRequiredFields"));
      return;
    }

    if (isNaN(Number(formData.readTime))) {
      toast.error(instructorText("readTimeMustBeNumber"));
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();

      // Add image if provided
      if (image) {
        submitData.append("imageCover", image);
      }

      // Add form fields
      submitData.append("readTime", formData.readTime);
      submitData.append("author", user._id);

      // Add multilingual fields
      submitData.append("title[en]", formData.title.en);
      submitData.append("title[ar]", formData.title.ar);
      submitData.append("description[en]", formData.description.en);
      submitData.append("description[ar]", formData.description.ar);
      submitData.append("content[en]", formData.content.en);
      submitData.append("content[ar]", formData.content.ar);

      if (isEdit) {
        await axiosInstance.put(`/articals/${id}`, submitData);
        toast.success(instructorText("blogUpdatedSuccessfully"));
      } else {
        await axiosInstance.post("/articals", submitData);
        toast.success(instructorText("blogCreatedSuccessfully"));
      }

      router.push("/instructor-dashboard/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
      const typedError = error as AxiosError<{ message: string }>;
      const errorMessage =
        typedError?.response?.data?.message || typedError?.message;
      toast.error(
        errorMessage ||
          (isEdit
            ? instructorText("failedToUpdateBlog")
            : instructorText("failedToCreateBlog"))
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton
  const FormSkeleton = () => (
    <div className="container max-w-7xl mx-auto py-4 px-4 sm:py-8 sm:px-6">
      <div className="space-y-6 mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-64" />
      </div>
      <div className="bg-card rounded-lg border p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="flex justify-end pt-6">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );

  if (fetchingData) {
    return <FormSkeleton />;
  }

  return (
    <div className="container max-w-7xl mx-auto py-4 px-4 sm:py-8 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
        <Link
          href="/instructor-dashboard/blogs"
          className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="xs:hidden">{instructorText("back")}</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        <Plus className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
          {isEdit ? instructorText("editBlog") : instructorText("createBlog")}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-card rounded-lg border p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {instructorText("imageCover")}
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="blog cover"
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="size-32 rounded-lg bg-muted" />
                  )}
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview("");
                      }}
                      className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 rounded-full bg-destructive text-background"
                    >
                      <AiFillDelete className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={cn(commonFormStyles, "flex-1")}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Title Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {instructorText("title")} ({instructorText("english")}) *
              </label>
              <Input
                value={formData.title.en}
                onChange={(e) =>
                  handleInputChange("title", "en", e.target.value)
                }
                placeholder={instructorText("enterTitleEn")}
                className={commonFormStyles}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {instructorText("title")} ({instructorText("arabic")}) *
              </label>
              <Input
                value={formData.title.ar}
                onChange={(e) =>
                  handleInputChange("title", "ar", e.target.value)
                }
                placeholder={instructorText("enterTitleAr")}
                className={commonFormStyles}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {instructorText("readTime")} *
            </label>
            <Input
              value={formData.readTime}
              onChange={(e) =>
                handleInputChange("readTime", null, e.target.value)
              }
              placeholder={instructorText("enterReadTime")}
              className={commonFormStyles}
              disabled={loading}
              required
            />
          </div>
          {/* Description Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {instructorText("description")} ({instructorText("english")}) *
              </label>
              <Textarea
                value={formData.description.en}
                onChange={(e) =>
                  handleInputChange("description", "en", e.target.value)
                }
                placeholder={instructorText("enterDescriptionEn")}
                className={cn(commonFormStyles, "min-h-[100px] resize-none")}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {instructorText("description")} ({instructorText("arabic")}) *
              </label>
              <Textarea
                value={formData.description.ar}
                onChange={(e) =>
                  handleInputChange("description", "ar", e.target.value)
                }
                placeholder={instructorText("enterDescriptionAr")}
                className={cn(commonFormStyles, "min-h-[100px] resize-none")}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Content Fields */}
          <div className="space-y-6">
            <div className="space-y-2 pb-8">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {instructorText("content")} ({instructorText("english")}) *
              </label>
              <ReactQuill
                modules={quillModules}
                formats={quillFormats}
                className="h-64 text-foreground"
                value={formData.content.en}
                onChange={(content) =>
                  handleInputChange("content", "en", content)
                }
                placeholder={instructorText("enterContentEn")}
                theme="snow"
                readOnly={loading}
              />
            </div>

            <div className="space-y-2 pb-8">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {instructorText("content")} ({instructorText("arabic")}) *
              </label>
              <ReactQuill
                modules={quillModules}
                formats={quillFormats}
                className="h-64 text-foreground"
                value={formData.content.ar}
                onChange={(content) =>
                  handleInputChange("content", "ar", content)
                }
                placeholder={instructorText("enterContentAr")}
                theme="snow"
                readOnly={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading
                ? isEdit
                  ? instructorText("updating")
                  : instructorText("creating")
                : isEdit
                ? instructorText("updateBlog")
                : instructorText("createBlog")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormClient;
