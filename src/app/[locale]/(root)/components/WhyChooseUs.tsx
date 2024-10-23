import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const WhyChooseUs: React.FC = () => {
  const text = useTranslations("whyChooseUs");
  // why_chose_us_1.png
  return (
    <section className="container grid gap-8 md:gap-12 lg:gap-24 lg:grid-cols-2">
      <div className="order-2 lg:order-1">
        <div className="flex flex-col w-full font-semibold">
          <h2 className="h4">{text("heading")}</h2>
          <h3 className="mt-6 h2">{text("subHeading")}</h3>
        </div>
        <div className="mt-12 space-y-8 max-md:mt-10 max-md:space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 md:gap-6 md:p-6 bg-muted md:rounded-2xl rounded-xl"
            >
              <Image
                src={`/images/why_chose_us_${index + 1}.png`}
                width={96}
                height={96}
                alt={text(`case_${index + 1}_title`)}
                className="w-20 rounded-lg md:w-24 md:h-24 aspect-square bg-primary-faded"
              />{" "}
              <div>
                <h4>{text(`case_${index + 1}_title`)}</h4>
                <p className="mt-3 text-text-3">
                  {text(`case_${index + 1}_description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="aspect-[0.96] rounded-[32px] bg-muted flex items-center justify-center p-6">
        <Image
          src="/images/why_chose_us.png"
          alt={text("heading")}
          height={580}
          width={560}
          className="aspect-[58/56] w-full object-cover"
        />
      </div>
    </section>
  );
};

export default WhyChooseUs;
