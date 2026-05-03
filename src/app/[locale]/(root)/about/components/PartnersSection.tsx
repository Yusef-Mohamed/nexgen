import { useTranslations } from "next-intl";
import SectionHeader from "@/components/SectionHeader";
import PartnersSlider from "./PartnersSlider";

const PartnersSection = () => {
  const text = useTranslations("aboutPartnersPage");
  return (
    <section className="secPadding">
      <div className="container mb-8">
        <SectionHeader
          eyebrow={text("eyebrow")}
          heading={text("heading")}
          align="center"
          tone="secondary"
        />
      </div>

      <PartnersSlider />
    </section>
  );
};

export default PartnersSection;
