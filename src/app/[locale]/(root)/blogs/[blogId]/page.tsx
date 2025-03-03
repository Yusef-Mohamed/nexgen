import { getMetadataBlogPage } from "@/getMetaData";
import { Metadata } from "next";

import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { IBlog } from "@/types";
import BlogCard, {
  BlogCard2,
  BlogUserComponent,
} from "@/components/cards/BlogCard";
import StayUpToDate from "./components/StayUpToDate";
import { ShareButtons } from "@/components/cards/BlogsShareButtons";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; blogId: string };
}): Promise<Metadata> {
  const axiosInstance = createServerAxiosInstance();
  const blogRes = await axiosInstance.get("/articals/" + params.blogId);
  const blogData = blogRes.data.data as IBlog;
  return getMetadataBlogPage({
    params,
    blog: blogData,
  });
}

const BlogsPage = async ({
  params,
}: {
  params: { locale: string; blogId: string };
}) => {
  unstable_setRequestLocale(params.locale);
  try {
    const text = await getTranslations("blogs");
    const axiosInstance = createServerAxiosInstance();
    const blogRes = await axiosInstance.get("/articals/" + params.blogId);
    const otherBlogsRes = await axiosInstance.get("/articals?limit=3");
    const blogData = blogRes.data.data as IBlog;
    const otherBlogs = (otherBlogsRes.data.data as IBlog[])
      .filter((b) => b._id !== blogData._id)
      .slice(0, 3);
    return (
      <main>
        <section className="container secPadding">
          <BlogCard2 {...blogData} isRow isMain />
          <div
            dangerouslySetInnerHTML={{
              __html: blogData.content,
            }}
            className="max-w-3xl pt-24 mx-auto prose"
          ></div>
          <div className="max-w-3xl py-12 mx-auto text-center border-b">
            <ShareButtons id={params.blogId} />
          </div>
          <BlogUserComponent className="mx-auto mt-12 w-fit " {...blogData} />
        </section>
        <StayUpToDate />
        <section className="container secPadding">
          <div>
            <h2 className="mb-4 sm:mb-6">{text("relatedBlogsHeading")}</h2>
            <p className="text-text-2">{text("relatedBlogsDescription")}</p>
          </div>
          <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
            {otherBlogs.map((blog) => (
              <BlogCard key={blog._id} {...blog} />
            ))}
          </div>{" "}
        </section>
      </main>
    );
  } catch (e) {
    console.log(e);
    return notFound();
  }
};

export default BlogsPage;
