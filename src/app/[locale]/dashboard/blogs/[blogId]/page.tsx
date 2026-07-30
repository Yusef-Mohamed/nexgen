import { getMetadataBlogPage } from "@/getMetaData";
import { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { IBlog } from "@/types";
import BlogCard, {
  BlogCard2,
  BlogUserComponent,
} from "@/components/cards/BlogCard";
import { ShareButtons } from "@/components/cards/BlogsShareButtons";
import { notFound } from "next/navigation";
import DashboardContainer from "../../components/DashboardContainer";
import { Newspaper } from "lucide-react";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; blogId: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: params.locale,
  });
  const blogRes = await axiosInstance.get("/articals/" + params.blogId);
  const blogData = blogRes.data.data as IBlog;
  return getMetadataBlogPage({
    params,
    blog: blogData,
  });
}

const getBlogPageData = async (locale: string, blogId: string) => {
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: locale,
  });
  const blogRes = await axiosInstance.get("/articals/" + blogId);
  const otherBlogsRes = await axiosInstance.get("/articals?limit=3");
  const blogData = blogRes.data.data as IBlog;
  const otherBlogs = (otherBlogsRes.data.data as IBlog[])
    .filter((b) => b._id !== blogData._id)
    .slice(0, 3);

  return { blogData, otherBlogs };
};

const BlogsPage = async (props: {
  params: Promise<{ locale: string; blogId: string }>;
}) => {
  const params = await props.params;
  const text = await getTranslations("blogs");
  const dashboardText = await getTranslations("dashboard");

  let pageData: Awaited<ReturnType<typeof getBlogPageData>>;

  try {
    pageData = await getBlogPageData(params.locale, params.blogId);
  } catch {
    notFound();
  }

  const { blogData, otherBlogs } = pageData;

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

        <article className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-4 shadow-sm sm:p-5">
          <BlogCard2 {...blogData} inDashboard isRow isMain />
          <div
            dangerouslySetInnerHTML={{
              __html: blogData.content,
            }}
            className="prose mx-auto max-w-3xl pt-14 text-text-2 dark:prose-invert prose-headings:text-text-1 prose-a:text-primary"
          />
          <div className="mx-auto max-w-3xl border-b border-primary/10 py-10 text-center">
            <ShareButtons id={params.blogId} />
          </div>
          <BlogUserComponent className="mx-auto mt-10 w-fit" {...blogData} />
        </article>

        <section className="overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground shadow-sm">
          <div className="border-b border-primary/10 p-4 sm:p-5">
            <h2 className="text-base font-black text-text-1 sm:text-lg">
              {text("relatedBlogsHeading")}
            </h2>
            <p className="mt-1 text-sm text-text-3">
              {text("relatedBlogsDescription")}
            </p>
          </div>
          <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-2 lg:grid-cols-3">
            {otherBlogs.map((blog) => (
              <BlogCard inDashboard key={blog._id} {...blog} />
            ))}
          </div>
        </section>
      </DashboardContainer>
    </main>
  );
};

export default BlogsPage;
