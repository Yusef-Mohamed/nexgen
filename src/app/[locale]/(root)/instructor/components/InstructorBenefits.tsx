import React from "react";
import { useTranslations } from "next-intl";
import { FiUsers, FiHeart, FiDollarSign } from "react-icons/fi";
import { cn } from "@/lib/utils";

const InstructorBenefits: React.FC = () => {
  const text = useTranslations("instructorPage.benefits");

  const benefits = [
    {
      icon: <FiHeart className="w-8 h-8 text-yellow-500" />,
      title: text("impactLives.title"),
      description: text("impactLives.description"),
    },
    {
      icon: <FiUsers className="w-8 h-8 text-blue-500" />,
      title: text("supportiveCommunity.title"),
      description: text("supportiveCommunity.description"),
    },
    {
      icon: <FiDollarSign className="w-8 h-8 text-green-500" />,
      title: text("earnMoney.title"),
      description: text("earnMoney.description"),
    },
  ];

  return (
    <section className="container py-8 md:py-16">
      <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-3 ">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className={cn("space-y-6", {
              "md:col-span-2 lg:col-span-1": index === 2,
            })}
          >
            <div>{benefit.icon}</div>
            <h3 className="text-2xl font-bold">{benefit.title}</h3>
            <p className="text-text-2">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstructorBenefits;
