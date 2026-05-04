"use client";
import React, { useMemo, useState } from "react";
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
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import { FaTelegramPlane } from "react-icons/fa";
import { cn } from "@/lib/utils";

const TOTAL_FAQS = 10;

const FAQ: React.FC = () => {
  const text = useTranslations("faqs");
  const [count, setCount] = useState(5);

  const items = useMemo(() => {
    const all = Array.from({ length: TOTAL_FAQS }, (_, i) => ({
      idx: i + 1,
      q: text("faq_q_" + (i + 1)),
      a: text("faq_a_" + (i + 1)),
    }));
    return all.slice(0, count);
  }, [text, count]);

  const expanded = count === TOTAL_FAQS;

  return (
    <section className="container secPadding">
      <div className="flex flex-col items-start w-full gap-10 lg:gap-16 lg:flex-row">
        {/* Left: header + contact CTA */}
        <div className="lg:w-[420px] lg:sticky lg:top-32 w-full">
          <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-primary/10 border border-primary/20">
            <HiOutlineQuestionMarkCircle className="size-4 text-primary" />
            <span className="text-xs sm:text-sm font-semibold text-primary tracking-wide uppercase">
              {text("eyebrow")}
            </span>
          </div>

          <h2 className="font-bold text-text-1 leading-tight tracking-tight">
            {text("heading")}
          </h2>
          <p className="mt-5 sm:text-lg sm:leading-7 text-text-3">
            {text("description")}
          </p>

          {/* Contact card */}
          <div className="relative mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-primary-faded via-primary-faded to-clear-ground border border-primary/15 cardShadowSm overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-12 -end-12 size-32 rounded-full bg-primary/15 blur-2xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-12 -start-12 size-32 rounded-full bg-secondary/15 blur-2xl"
            />
            <div className="relative flex items-start gap-4">
              <div className="flex shrink-0 size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <HiOutlineChatBubbleLeftRight className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-text-1">
                  {text("stillHaveQuestions")}
                </div>
                <p className="text-sm text-text-3 mt-1">
                  {text("contactDescription")}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    asChild
                    size="default"
                    variant="primaryOutline"
                    className="flex-1 min-w-[140px] bg-clear-ground/70"
                  >
                    <Link
                      href={"/contact"}
                      className="flex items-center justify-center gap-2"
                    >
                      <HiOutlineEnvelope className="size-4" />
                      {text("contact")}
                    </Link>
                  </Button>
                  <a
                    href="https://t.me/nexgensupport"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-clear-ground hover:bg-primary/90 transition-colors"
                  >
                    <FaTelegramPlane className="size-4" />
                    {text("telegram")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: accordion */}
        <div className="flex-1 w-full min-w-0">
          <Accordion
            type="single"
            collapsible
            className="flex-1 w-full flex flex-col gap-3"
          >
            {items.map((it) => (
              <AccordionItem
                key={it.idx}
                value={"item-" + it.idx}
                className={cn(
                  "group  !border !border-primary/15 hover:!border-primary/40 !my-0 !py-0 !px-0 rounded-2xl bg-clear-ground transition-all",
                  "data-[state=open]:!border-primary/40 data-[state=open]:shadow-md data-[state=open]:shadow-primary/5",
                )}
              >
                <AccordionTrigger
                  className={cn(
                    "w-full px-4 sm:px-5 py-4 text-start font-semibold text-text-1 hover:no-underline gap-3 sm:gap-4",
                    "[&>svg]:hidden",
                  )}
                >
                  <span className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <span
                      className={cn(
                        "flex shrink-0 size-8 items-center justify-center rounded-lg text-xs font-bold mt-0.5 transition-colors",
                        "bg-primary/10 text-primary",
                        "group-hover:bg-primary/15",
                        "group-data-[state=open]:bg-primary group-data-[state=open]:text-clear-ground",
                      )}
                    >
                      {String(it.idx).padStart(2, "0")}
                    </span>
                    <span className="flex-1 leading-snug">{it.q}</span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 inline-flex size-7 items-center justify-center rounded-full border border-primary/20 text-primary transition-all",
                      "group-data-[state=open]:bg-primary group-data-[state=open]:text-clear-ground group-data-[state=open]:border-primary",
                      "group-data-[state=open]:rotate-45",
                    )}
                    aria-hidden
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="size-3.5"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-5 pt-0 pb-5 text-text-3 leading-relaxed">
                  <div>
                    <div className="ps-3">{it.a}</div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="pt-6">
            <Button
              onClick={() => setCount(expanded ? 5 : TOTAL_FAQS)}
              className="block w-64 mx-auto"
              size={"lg"}
              variant={"outline"}
            >
              {expanded ? text("displayLess") : text("displayMore")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
