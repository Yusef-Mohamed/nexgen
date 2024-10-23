import { useTranslations } from "next-intl";
import PartnersSlider from "./PartnersSlider";

const PartnersSection = () => {
  const text = useTranslations("aboutPartnersPage");
  return (
    <section className=" secPadding">
      <h2 className="container mb-6 text-center sm:mb-8 h4">
        {text("heading")}
      </h2>
      <PartnersSlider />
    </section>
  );
};

export default PartnersSection;
