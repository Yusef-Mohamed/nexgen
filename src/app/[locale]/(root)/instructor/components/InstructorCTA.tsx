import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

const InstructorCTA: React.FC = () => {
  const text = useTranslations("instructorPage.finalCTA");

  return (
    <section className="container py-8 sm:py-12 md:py-16 lg:py-20 xl:py-32">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="h1 font-bold  mb-6">{text("heading")}</h2>
        <p className="text-xl text-text-1 mb-6 max-w-2xl mx-auto">
          {text("description")}
        </p>
        <Button size="lg" className="mx-auto block w-64 max-sm:w-full">
          <Link href="/contact">{text("ctaButton")}</Link>
        </Button>
      </div>
    </section>
  );
};

export default InstructorCTA;
