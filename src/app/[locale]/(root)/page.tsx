import Hero from "./components/Hero";
import Features from "./components/Features";
import WhyChooseUs from "./components/WhyChooseUs";
import SuccessStories from "./components/SuccessStories";
import Testimonials from "./components/Testimonials";
import BlogSection from "./components/BlogSection";
import FAQ from "./components/FAQ";
import { Metadata } from "next";
import { getMetadataLandingPage } from "@/getMetaData";

import MobileAppHero from "./components/MobileAppHero";
import PopularShowcase from "./components/showcase/PopularShowcase";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  return getMetadataLandingPage({
    params,
  });
}

const LandingPage = async (props: { params: Promise<{ locale: string }> }) => {
  await props.params;

  return (
    <main className="max-w-full overflow-hidden">
      {/* <Hero /> */}
      <Hero />
      <Features />
      <PopularShowcase />
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
