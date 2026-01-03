import { getMetadataAboutPage } from "@/getMetaData";
import { Metadata } from "next";
import { BlogSection2 } from "../components/BlogSection";
import HeroSection from "./components/HeroSection";
import PartnersSection from "./components/PartnersSection";
import OurValues from "./components/OurValues";
import ReviewsSection from "./components/ReviewsSection";
import { PromoBanner2 } from "../components/PromoBanner";
import { unstable_setRequestLocale } from "next-intl/server";
import MobileAppHero from "../components/MobileAppHero";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return getMetadataAboutPage({
    params,
  });
}

const AboutPage = ({ params }: { params: { locale: string } }) => {
  unstable_setRequestLocale(params.locale);
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
