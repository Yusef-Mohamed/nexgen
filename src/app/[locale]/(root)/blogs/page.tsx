import { getMetadataBlogsPage } from "@/getMetaData";
import { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import BlogsPageHeroSection from "./components/BlogsPageHeroSection";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { IBlog } from "@/types";
import BlogCard from "@/components/cards/BlogCard";
import DonotOnlyLearnSuccess from "./components/DonotOnlyLearnSuccess";
import GridSection from "@/components/GridSection";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  return getMetadataBlogsPage({
    params,
  });
}

const BlogsPage = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;

  const text = await getTranslations("blogs");
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: params.locale,
  });
  const blogsRes = await axiosInstance.get("/articals");
  const blogsData = blogsRes.data.data as IBlog[];
  return (
    <main className="max-w-full overflow-hidden">
      <BlogsPageHeroSection blog={blogsData[0]} />
      <GridSection
        heading={text("latestBlogs")}
        eyebrow={text("eyebrow")}
        description={text("landingDescription")}
        tone="primary"
        align="center"
      >
        {blogsData.slice(1).map((blog, index) => (
          <BlogCard key={index} {...blog} />
        ))}
      </GridSection>
      <DonotOnlyLearnSuccess />
    </main>
  );
};

export default BlogsPage;
