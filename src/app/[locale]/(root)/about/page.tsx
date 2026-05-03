import { getMetadataAboutPage } from "@/getMetaData";
import { Metadata } from "next";
import BlogSection from "../components/BlogSection";
import HeroSection from "./components/HeroSection";
import PartnersSection from "./components/PartnersSection";
import OurValues from "./components/OurValues";
import ReviewsSection from "./components/ReviewsSection";
import { PromoBanner2 } from "../components/PromoBanner";

import MobileAppHero from "../components/MobileAppHero";

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataAboutPage({
    params,
  });
}

const AboutPage = async (props: { params: Promise<{ locale: string }> }) => {
  await props.params;

  return (
    <main className="max-w-full overflow-hidden">
      <HeroSection />
      <PartnersSection />
      <OurValues />
      <MobileAppHero />
      <ReviewsSection />
      <PromoBanner2 />
      <BlogSection />
    </main>
  );
};

export default AboutPage;
