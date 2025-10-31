import React from "react";
import FeatureCard from "../../../../components/cards/FeatureCard";
import { useTranslations } from "next-intl";

const Features: React.FC = () => {
  const text = useTranslations("features");
  return (
    <section className="container secPadding">
      <div className="grid gap-4 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <FeatureCard
            key={index}
            description={text(`feature_${index + 1}_description`)}
            iconSrc={`/images/feature_${index + 1}.png`}
            title={text(`feature_${index + 1}_title`)}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
