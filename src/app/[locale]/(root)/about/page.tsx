import { getMetadataAboutPage } from "@/getMetaData";
import { Metadata } from "next";
import { BlogSection2 } from "../components/BlogSection";
import HeroSection from "./components/HeroSection";
import PartnersSection from "./components/PartnersSection";
import OurValues from "./components/OurValues";
import ReviewsSection from "./components/ReviewsSection";
import { PromoBanner2 } from "../components/PromoBanner";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return getMetadataAboutPage({
    params,
  });
}

const AboutPage = () => {
  return (
    <main>
      <HeroSection />
      <PartnersSection />
      <OurValues />
      <ReviewsSection />
      <PromoBanner2 />
      <BlogSection2 />
    </main>
  );
};

export default AboutPage;
