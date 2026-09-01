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

  let blogsData: IBlog[];
  try {
    const blogsRes = await axiosInstance.get("/articals?limit=3");
    blogsData = blogsRes.data.data as IBlog[];
  } catch {
    return null;
  }
  return (
    <GridSection
      heading={text("heading")}
      eyebrow={text("eyebrow")}
      description={text("landingDescription")}
      tone="primary"
      align="center"
      button={text("exploreAllBlogs")}
      href="/blogs"
    >
      {blogsData.map((blog) => (
        <BlogCard key={blog._id} {...blog} />
      ))}
    </GridSection>
  );
};
export const BlogSection2: React.FC = async () => {
  const text = await getTranslations("blogs");
  const locale = await getLocale();
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: locale,
  });

  let blogsData: IBlog[];
  try {
    const blogsRes = await axiosInstance.get("/articals?limit=2");
    blogsData = blogsRes.data.data as IBlog[];
  } catch {
    return null;
  }
  return (
    <section className="container secPadding">
      <h2>{text("heading2")}</h2>
      <p className="mt-4 text-text-2 sm:mt-6">{text("description")}</p>
      <div className="grid gap-6 my-6 sm:my-12 sm:gap-12 lg:grid-cols-2">
        {blogsData.map((blog) => (
          <BlogCard2 key={blog._id} {...blog} />
        ))}
      </div>
      <Button
        className="flex mx-auto text-center exploreAllReviews w-80"
        variant="outline"
        size="lg"
        asChild
      >
        <Link href="/blogs">{text("exploreAllBlogs")}</Link>
      </Button>
    </section>
  );
};

export default BlogSection;
