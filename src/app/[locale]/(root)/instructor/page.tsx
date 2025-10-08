import InstructorHero from "./components/InstructorHero";
import InstructorBenefits from "./components/InstructorBenefits";
import GettingStarted from "./components/GettingStarted";
import InstructorStories from "./components/InstructorStories";
import InstructorCTA from "./components/InstructorCTA";
import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { getMetadataInstructorPage } from "@/getMetaData";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return getMetadataInstructorPage({ params });
}

const InstructorPage = ({ params }: { params: { locale: string } }) => {
  unstable_setRequestLocale(params.locale);

  return (
    <main className="max-w-full overflow-hidden">
      <InstructorHero />
      <InstructorBenefits />
      <GettingStarted />
      <InstructorStories />
      <InstructorCTA />
    </main>
  );
};

export default InstructorPage;
