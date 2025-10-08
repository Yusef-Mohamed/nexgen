import { useTranslations } from "next-intl";
import Image from "next/image";

const HeroSection = () => {
  const text = useTranslations("aboutHeroPage");
  return (
    <section className="container secPadding">
      <h2 className="h1-5">{text("heading")}</h2>
      <h3 className="mt-4 sm:mt-6 h5">{text("subHeading")}</h3>
      <Image
        width={1350}
        height={540}
        loading="lazy"
        src="/images/about_hero_section.jpeg"
        alt="Forex trading education illustration"
        className="object-cover w-full rounded-3xl aspect-[2.49] sm:mt-16 sm:mb-10 mt-8 mb-6"
      />{" "}
      <div className="flex flex-col gap-4 sm:gap-8 xl:flex-row ">
        <h3
          style={{
            fontWeight: 400,
          }}
          color="flex-1"
        >
          {text("description")}
        </h3>
      </div>
    </section>
  );
};

export default HeroSection;
