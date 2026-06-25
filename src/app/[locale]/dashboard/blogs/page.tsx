import { getMetadataBlogsPage } from "@/getMetaData";
import { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { IBlog } from "@/types";
import { BlogCard2 } from "@/components/cards/BlogCard";
import DashboardContainer from "../components/DashboardContainer";
import { Newspaper } from "lucide-react";

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
  const dashboardText = await getTranslations("dashboard");
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: params.locale,
  });
  const blogsRes = await axiosInstance.get("/articals");
  const blogsData = blogsRes.data.data as IBlog[];
  const featuredBlog = blogsData[0];
  const latestBlogs = blogsData.slice(1);

  return (
    <main className="w-full !bg-transparent px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
      <DashboardContainer className="space-y-5">
        <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-5 shadow-sm sm:p-6">
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(hsl(var(--primary)/0.08)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="relative flex min-w-0 items-center gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
              <Newspaper className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-lg font-black text-text-1 sm:text-xl">
                {dashboardText("blogs")}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-text-3">
                {dashboardText("blogsDescription")}
              </p>
            </div>
          </div>
        </section>

        {featuredBlog && (
          <section className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-4 shadow-sm sm:p-5">
            <BlogCard2 inDashboard {...featuredBlog} isRow />
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground shadow-sm">
          <div className="border-b border-primary/10 p-4 sm:p-5">
            <h2 className="text-base font-black text-text-1 sm:text-lg">
              {text("latestBlogs")}
            </h2>
          </div>
          <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-2">
            {latestBlogs.map((blog) => (
              <BlogCard2 inDashboard key={blog._id} {...blog} />
            ))}
          </div>
        </section>
      </DashboardContainer>
    </main>
  );
};

export default BlogsPage;
