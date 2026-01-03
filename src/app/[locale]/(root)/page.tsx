import Hero from "./components/Hero";
import Features from "./components/Features";
import WhyChooseUs from "./components/WhyChooseUs";
import SuccessStories from "./components/SuccessStories";
import Testimonials from "./components/Testimonials";
import BlogSection from "./components/BlogSection";
import FAQ from "./components/FAQ";
import { Metadata } from "next";
import { getMetadataLandingPage } from "@/getMetaData";
import { unstable_setRequestLocale } from "next-intl/server";
import OurLearningPaths from "./components/OurLearningPaths";
import OurCourses from "./components/OurCourses";
import OurServices from "./components/OurServices";
import MobileAppHero from "./components/MobileAppHero";
export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return getMetadataLandingPage({
    params,
  });
}

const LandingPage = ({ params }: { params: { locale: string } }) => {
  unstable_setRequestLocale(params.locale);

  return (
    <main className="max-w-full overflow-hidden">
      <Hero />
      <Features />
      <OurCourses />
      <OurLearningPaths />
      <OurServices />
      <WhyChooseUs />
      <MobileAppHero />
      <SuccessStories />
      <Testimonials />
      {/* <FeaturedInstructors /> */}
      <BlogSection />
      <FAQ />
    </main>
  );
};

export default LandingPage;
