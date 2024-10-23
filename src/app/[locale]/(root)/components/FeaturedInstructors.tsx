import React from "react";
import InstructorCard from "../../../../components/cards/InstructorCard";
import { useTranslations } from "next-intl";
import GridSection from "@/components/GridSection";

const instructorsData = [
  {
    name: "أحمد كامل",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/4d66045bcd04eb1516095cd70553f096bd34c994e217ed36368c100d2b134add?placeholderIfAbsent=true&apiKey=6e997725f4ef42d9a5c7140b68d32ddf",
    badgeSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/ccdf977bea44bf2b301076ccbf7cb0c0ea261f7579dad70414e9b70cbe0b82c7?placeholderIfAbsent=true&apiKey=6e997725f4ef42d9a5c7140b68d32ddf",
  },
  {
    name: "أحمد كامل",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/6ff7fe32683bfdeb9e44c12c4f3342a282122da7a064921ca8bf68c97468cf3e?placeholderIfAbsent=true&apiKey=6e997725f4ef42d9a5c7140b68d32ddf",
    badgeSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/222c79b710d4e104912be43f5ce352b72242aaa07d40fb9bce0647a2445d3214?placeholderIfAbsent=true&apiKey=6e997725f4ef42d9a5c7140b68d32ddf",
  },
  {
    name: "أحمد كامل",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/c292ad629c508eb6a7b256572b22be41441ff69a34bb417b4dabf3cb6e2abcf6?placeholderIfAbsent=true&apiKey=6e997725f4ef42d9a5c7140b68d32ddf",
    badgeSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d47d47f3eb9bfa436bf1fde6021e1e21b2dac265d536bf1340e14214a4dda378?placeholderIfAbsent=true&apiKey=6e997725f4ef42d9a5c7140b68d32ddf",
  },
];

const FeaturedInstructors: React.FC = () => {
  const text = useTranslations("featuredInstructors");
  return (
    <GridSection
      heading={text("heading")}
      button={text("exploreAllInstructors")}
      href="/instructors"
    >
      {instructorsData.map((instructor, index) => (
        <InstructorCard key={index} {...instructor} />
      ))}
    </GridSection>
  );
};

export default FeaturedInstructors;
