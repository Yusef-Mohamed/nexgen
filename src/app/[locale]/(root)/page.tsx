import Hero from "./components/Hero";
import Features from "./components/Features";
import PopularCourses from "./components/PopularCourses";
import LearningPaths from "./components/LearningPaths";
import WhyChooseUs from "./components/WhyChooseUs";
import Services from "./components/Services";
import PromoBanner from "./components/PromoBanner";
import SuccessStories from "./components/SuccessStories";
import Testimonials from "./components/Testimonials";
import FeaturedInstructors from "./components/FeaturedInstructors";
import BlogSection from "./components/BlogSection";
import FAQ from "./components/FAQ";
import { Metadata } from "next";
import { getMetadataLandingPage } from "@/getMetaData";
export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return getMetadataLandingPage({
    params,
  });
}

const LandingPage = () => {
  return (
    <main>
      <Hero />
      <Features />
      <PopularCourses />
      <LearningPaths />
      <WhyChooseUs />
      <Services />
      <PromoBanner />
      <SuccessStories />
      <Testimonials />
      <FeaturedInstructors />
      <BlogSection />
      <FAQ />
    </main>
  );
};

export default LandingPage;
