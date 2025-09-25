import { getMetadataBlogsPage } from "@/getMetaData";
import { Metadata } from "next";

import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { IBlog } from "@/types";
import { BlogCard2 } from "@/components/cards/BlogCard";
import BlogsPageHeroSection from "../../(root)/blogs/components/BlogsPageHeroSection";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return getMetadataBlogsPage({
    params,
  });
}

const BlogsPage = async ({ params }: { params: { locale: string } }) => {
  unstable_setRequestLocale(params.locale);
  const text = await getTranslations("blogs");
  const axiosInstance = createServerAxiosInstance();
  const blogsRes = await axiosInstance.get("/articals");
  const blogsData = blogsRes.data.data as IBlog[];
  return (
    <main className="bg-background w-full p-8 lg:p-10">
      <BlogsPageHeroSection inDashboard blog={blogsData[0]} />

      <section className="container secPadding">
        <h2>{text("latestBlogs")}</h2>
        <div className="grid gap-6 my-6 sm:my-12 sm:gap-12 lg:grid-cols-2">
          {blogsData.slice(1).map((blog, index) => (
            <BlogCard2 inDashboard key={index} {...blog} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default BlogsPage;
