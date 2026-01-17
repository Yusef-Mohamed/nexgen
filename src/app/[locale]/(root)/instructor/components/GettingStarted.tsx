import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { FiEdit3, FiUsers, FiTrendingUp } from "react-icons/fi";

const GettingStarted: React.FC = () => {
  const text = useTranslations("instructorPage.gettingStarted");

  const steps = [
    {
      icon: <FiEdit3 className="w-6 h-6" />,
      title: text("step1.title"),
      description: text("step1.description"),
    },
    {
      icon: <FiEdit3 className="w-6 h-6" />,
      title: text("step2.title"),
      description: text("step2.description"),
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: text("step3.title"),
      description: text("step3.description"),
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: text("step4.title"),
      description: text("step4.description"),
    },
  ];

  return (
    <section className="container secPadding">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left side - Title and CTA */}
        <div>
          <h6 className="font-semibold mb-2">{text("subtitle")}</h6>
          <h2 className="h1 mb-8">{text("heading")}</h2>
          <Button size="lg" className="max-sm:w-full">
            <Link href="/contact">{text("ctaButton")}</Link>
          </Button>
        </div>

        {/* Right side - Steps */}
        <div className="relative">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white  flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GettingStarted;
