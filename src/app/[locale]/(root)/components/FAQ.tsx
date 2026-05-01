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
import { Link } from "@/i18n/navigation";
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineEnvelope,
} from "react-icons/hi2";

const FAQ: React.FC = () => {
  const text = useTranslations("faqs");
  const [count, setCount] = useState(5);

  return (
    <section className="container secPadding">
      <div className="flex flex-col items-start w-full gap-10 lg:gap-16 lg:flex-row">
        {/* Left: header + contact CTA */}
        <div className="lg:w-[420px] lg:sticky lg:top-24">
          <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-primary/10 border border-primary/20">
            <HiOutlineQuestionMarkCircle className="size-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              FAQs
            </span>
          </div>

          <h2 className="font-bold text-text-1 leading-tight">
            {text("heading")}
          </h2>
          <p className="mt-5 sm:text-lg sm:leading-7 text-text-3">
            {text("description")}
          </p>

          {/* Contact card */}
          <div className="mt-8 p-5 rounded-2xl bg-primary-faded border border-primary/15">
            <div className="flex items-start gap-4">
              <div className="flex shrink-0 size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <HiOutlineEnvelope className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-text-1">
                  Still have questions?
                </div>
                <p className="text-sm text-text-3 mt-1">
                  Reach out and our team will get back to you fast.
                </p>
                <Button
                  asChild
                  className="mt-4 w-full sm:w-auto"
                  size={"default"}
                  variant={"primaryOutline"}
                >
                  <Link href={"/contact"}>{text("contact")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: accordion */}
        <Accordion type="single" collapsible className="flex-1 w-full space-y-3">
          {Array.from({ length: count }).map((_, index) => (
            <AccordionItem
              key={index}
              value={"item-" + (index + 1)}
              className="!border !border-primary/15 hover:border-primary/40 !my-0 !py-0 !px-0 rounded-2xl bg-clear-ground transition-colors data-[state=open]:border-primary/40 data-[state=open]:shadow-md data-[state=open]:shadow-primary/5"
            >
              <AccordionTrigger className="w-full px-5 py-4 text-start font-semibold text-text-1 hover:no-underline gap-4">
                <span className="flex items-start gap-3 flex-1">
                  <span className="flex shrink-0 size-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    {text("faq_q_" + (index + 1))}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pt-0 pb-5 text-text-3 leading-relaxed">
                <div className="ps-10">{text("faq_a_" + (index + 1))}</div>
              </AccordionContent>
            </AccordionItem>
          ))}

          <div className="pt-4">
            {count !== 10 ? (
              <Button
                onClick={() => setCount(10)}
                className="block w-64 mx-auto"
                size={"lg"}
                variant={"outline"}
              >
                {text("displayMore")}
              </Button>
            ) : (
              <Button
                onClick={() => setCount(5)}
                className="block w-64 mx-auto"
                size={"lg"}
                variant={"outline"}
              >
                {text("displayLess")}
              </Button>
            )}
          </div>
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
