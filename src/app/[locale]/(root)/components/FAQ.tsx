"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

const FAQ: React.FC = () => {
  const text = useTranslations("faqs");
  const [count, setCount] = useState(5);
  return (
    <section className="container secPadding">
      <div className="flex flex-col items-start w-full gap-12 lg:flex-row">
        <div className="lg:w-[500px]">
          <div>
            <h2>{text("heading")}</h2>
            <p className="mt-6 sm:text-lg sm:leading-7 text-text-2">
              {text("description")}
            </p>
          </div>
          <Button asChild className="w-64 mt-8" size={"lg"} variant={"outline"}>
            <Link href={"/contact"}>{text("contact")}</Link>
          </Button>
        </div>
        <Accordion type="single" collapsible className="flex-1 w-full">
          {Array.from({ length: count }).map((_, index) => (
            <AccordionItem key={index} value={"item-" + (index + 1)}>
              <AccordionTrigger>
                {text("faq_q_" + (index + 1))}
              </AccordionTrigger>
              <AccordionContent>
                {text("faq_a_" + (index + 1))}
              </AccordionContent>
            </AccordionItem>
          ))}{" "}
          {count !== 10 && (
            <Button
              onClick={() => setCount(10)}
              className="block w-64 mx-auto mt-4"
              size={"lg"}
              variant={"outline"}
            >
              {text("displayMore")}{" "}
            </Button>
          )}
          {count === 10 && (
            <Button
              onClick={() => setCount(5)}
              className="block w-64 mx-auto mt-4"
              size={"lg"}
              variant={"outline"}
            >
              {text("displayLess")}{" "}
            </Button>
          )}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
