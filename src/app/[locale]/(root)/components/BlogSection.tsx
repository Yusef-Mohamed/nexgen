import React from "react";
import BlogCard, { BlogCard2 } from "../../../../components/cards/BlogCard";
import { getLocale, getTranslations } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { IBlog } from "@/types";
import GridSection from "@/components/GridSection";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const BlogSection: React.FC = async () => {
  const text = await getTranslations("blogs");
  const locale = await getLocale();
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: locale,
  });

  try {
    const blogsRes = await axiosInstance.get("/articals?limit=3");
    const blogsData = blogsRes.data.data as IBlog[];
    return (
      <GridSection
        heading={text("heading")}
        button={text("exploreAllBlogs")}
        href="/blogs"
      >
        {blogsData.map((blog, index) => (
          <BlogCard key={index} {...blog} />
        ))}
      </GridSection>
    );
  } catch {
    return null;
  }
};
export const BlogSection2: React.FC = async () => {
  const text = await getTranslations("blogs");
  const locale = await getLocale();
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: locale,
  });

  try {
    const blogsRes = await axiosInstance.get("/articals?limit=2");
    const blogsData = blogsRes.data.data as IBlog[];
    return (
      <section className="container secPadding">
        <h2>{text("heading2")}</h2>
        <p className="mt-4 text-text-2 sm:mt-6">{text("description")}</p>
        <div className="grid gap-6 my-6 sm:my-12 sm:gap-12 lg:grid-cols-2">
          {blogsData.map((blog, index) => (
            <BlogCard2 key={index} {...blog} />
          ))}{" "}
        </div>
        <Button
          className="flex mx-auto text-center exploreAllReviews w-80"
          variant={"outline"}
          size={"lg"}
          asChild={true}
        >
          <Link href={"/blogs"}>{text("exploreAllBlogs")}</Link>
        </Button>
      </section>
    );
  } catch {
    return null;
  }
};

export default BlogSection;
