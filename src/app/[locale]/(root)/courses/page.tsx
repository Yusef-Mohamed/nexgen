import { getMetadataCoursesPage } from "@/getMetaData";
import { Metadata } from "next";

import { unstable_setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import LearningPaths from "../components/LearningPaths";
import PopularCourses from "../components/PopularCourses";
import Features from "../components/Features";
import Services from "../components/Services";
import FAQ from "../components/FAQ";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return getMetadataCoursesPage({
    params,
  });
}

const CoursesPage = ({ params }: { params: { locale: string } }) => {
  unstable_setRequestLocale(params.locale);
  const text = useTranslations("coursesPage");
  return (
    <main>
      <section className="container secPadding">
        <div className="max-w-3xl">
          <h2 className="h1-5">{text("heading")}</h2>
          <p className="mt-4 sm:mt-6 ">{text("description")}</p>
        </div>
      </section>
      <Features />
      <PopularCourses viewAll />
      <LearningPaths />
      <Services />
      <FAQ />
    </main>
  );
};

export default CoursesPage;
