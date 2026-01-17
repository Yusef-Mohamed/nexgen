import InstructorHero from "./components/InstructorHero";
import InstructorBenefits from "./components/InstructorBenefits";
import GettingStarted from "./components/GettingStarted";
import InstructorStories from "./components/InstructorStories";
import InstructorCTA from "./components/InstructorCTA";
import { Metadata } from "next";

import { getMetadataInstructorPage } from "@/getMetaData";

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataInstructorPage({ params });
}

const InstructorPage = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;
  

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
