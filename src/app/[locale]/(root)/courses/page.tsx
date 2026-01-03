import { getMetadataCoursesPage } from "@/getMetaData";
import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Features from "../components/Features";
import FAQ from "../components/FAQ";
import CoursesFilterContent from "../components/CoursesFilterContent";
import Image from "next/image";
import MobileAppHero from "../components/MobileAppHero";

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
        <div className="flex items-center justify-between">
          <div className="lg:basis-[55%]">
            <h1 className="!font-semibold">{text("heading")}</h1>
            <p className="mt-4 sm:mt-6">{text("description")}</p>
          </div>
          <div className="basis-[35%] max-lg:hidden">
            <Image
              src="/images/courses.png"
              alt="courses"
              width={536}
              height={209}
              className="w-full object-cover rounded-3xl aspect-[536/209]"
            />
          </div>
        </div>
      </section>

      <Features />

      {/* Client Component for Filter System */}
      <CoursesFilterContent />
      <MobileAppHero />
      <FAQ />
    </main>
  );
};

export default CoursesPage;
