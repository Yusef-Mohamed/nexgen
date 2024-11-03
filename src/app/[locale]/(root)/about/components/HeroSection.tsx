import { useTranslations } from "next-intl";
import Image from "next/image";

const HeroSection = () => {
  const text = useTranslations("aboutHeroPage");
  return (
    <section className="container secPadding">
      <div className="max-w-3xl">
        <h2 className="h1-5">{text("heading")}</h2>
        <h3 className="mt-4 sm:mt-6 h5">{text("subHeading")}</h3>
      </div>
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

        <div className="flex flex-col gap-4 sm:items-center sm:flex-row sm:gap-0 whitespace-nowrap w-fit">
          <div className="flex flex-col px-4 border-text-2 max-sm:border-s-2 ">
            <h4 className="h2">6+</h4>
            <h3
              style={{
                fontWeight: 400,
              }}
              className="text-text-2 h4"
            >
              {text("yearsOfExperience")}
            </h3>
          </div>
          <div className="flex flex-col px-4 border-text-2 sm:border-x-2 max-sm:border-s-2 ">
            <h4 className="h2">20+</h4>
            <h3
              style={{
                fontWeight: 400,
              }}
              className="text-text-2 h4"
            >
              {text("ourInstructors")}
            </h3>
          </div>
          <div className="flex flex-col px-4 border-text-2 max-sm:border-s-2 ">
            <h4 className="h2">90%</h4>
            <h3
              style={{
                fontWeight: 400,
              }}
              className="text-text-2 h4"
            >
              {text("ourLearners")}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
