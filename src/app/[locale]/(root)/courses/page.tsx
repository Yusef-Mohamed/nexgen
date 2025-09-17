import { getMetadataCoursesPage } from "@/getMetaData";
import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Features from "../components/Features";
import FAQ from "../components/FAQ";
import CoursesFilterContent from "../components/CoursesFilterContent";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return getMetadataCoursesPage({
    params,
  });
}

const CoursesPage = async ({ params }: { params: { locale: string } }) => {
  unstable_setRequestLocale(params.locale);
  const text = await getTranslations("coursesPage");

  return (
    <main>
      <section className="container secPadding">
        <div className="max-w-3xl">
          <h2 className="h1-5">{text("heading")}</h2>
          <p className="mt-4 sm:mt-6">{text("description")}</p>
        </div>
      </section>

      <Features />

      {/* Client Component for Filter System */}
      <CoursesFilterContent />

      <FAQ />
    </main>
  );
};

export default CoursesPage;
