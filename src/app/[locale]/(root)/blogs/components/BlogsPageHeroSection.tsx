import { BlogCard2 } from "@/components/cards/BlogCard";
import { IBlog } from "@/types";
import { useTranslations } from "next-intl";

const BlogsPageHeroSection = ({ blog }: { blog: IBlog }) => {
  const text = useTranslations("aboutOurValuesPage");
  return (
    <section className="container secPadding">
      <div className="max-w-3xl mb-12 sm:mb-20">
        <h2 className="mb-2 sm:mb-4 h4">{text("ourValues")}</h2>
        <h3 className="h2">{text("heading")}</h3>
        <p
          className="mt-3 sm:mt-6 h5 text-text-2"
          style={{
            fontWeight: 400,
          }}
        >
          {text("description")}
        </p>
      </div>
      {blog && <BlogCard2 {...blog} isRow />}
    </section>
  );
};

export default BlogsPageHeroSection;
