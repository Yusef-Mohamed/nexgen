import { getMetadataAboutPage } from "@/getMetaData";
import { Metadata } from "next";
import { BlogSection2 } from "../components/BlogSection";
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
  const params = await props.params;
  
  return (
    <main>
      <HeroSection />
      <PartnersSection />
      <OurValues />
      <MobileAppHero />
      <ReviewsSection />
      <PromoBanner2 />
      <BlogSection2 />
    </main>
  );
};

export default AboutPage;
