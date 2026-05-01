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
  HiOutlineMagnifyingGlass,
  HiOutlineChatBubbleLeftRight,
  HiOutlineXMark,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";

const TOTAL_FAQS = 10;

const FAQ: React.FC = () => {
  const text = useTranslations("faqs");
  const [count, setCount] = useState(5);
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const all = Array.from({ length: TOTAL_FAQS }, (_, i) => ({
      idx: i + 1,
      q: text("faq_q_" + (i + 1)),
      a: text("faq_a_" + (i + 1)),
    }));
    if (!query.trim()) return all.slice(0, count);
    const q = query.trim().toLowerCase();
    return all.filter(
      (it) =>
        it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q),
    );
  }, [text, count, query]);

  const isSearching = query.trim().length > 0;
  const expanded = count === TOTAL_FAQS;

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
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-primary-faded via-primary-faded to-clear-ground border border-primary/15 cardShadowSm">
            <div className="flex items-start gap-4">
              <div className="flex shrink-0 size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <HiOutlineChatBubbleLeftRight className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-text-1">
                  Still have questions?
                </div>
                <p className="text-sm text-text-3 mt-1">
                  Reach out and our team will get back to you fast.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    asChild
                    size="default"
                    variant="primaryOutline"
                    className="flex-1 min-w-[140px]"
                  >
                    <Link
                      href={"/contact"}
                      className="flex items-center justify-center gap-2"
                    >
                      <HiOutlineEnvelope className="size-4" />
                      {text("contact")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: search + accordion */}
        <div className="flex-1 w-full">
          {/* Search */}
          <div className="relative mb-5">
            <div className="relative flex items-center">
              <HiOutlineMagnifyingGlass className="absolute start-4 size-5 text-text-3 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions..."
                className={cn(
                  "w-full ps-12 pe-12 py-3.5 rounded-2xl bg-clear-ground",
                  "border border-primary/15 focus:border-primary/40 focus:ring-2 focus:ring-primary/15",
                  "text-sm text-text-1 placeholder:text-text-3 outline-none transition-colors"
                )}
              />
              {isSearching && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute end-3 inline-flex size-7 items-center justify-center rounded-full bg-muted hover:bg-primary/10 text-text-2 transition-colors"
                >
                  <HiOutlineXMark className="size-4" />
                </button>
              )}
            </div>
            {isSearching && (
              <div className="mt-2 text-xs text-text-3 px-2">
                {items.length === 0
                  ? "No questions match your search."
                  : `${items.length} ${items.length === 1 ? "result" : "results"}`}
              </div>
            )}
          </div>

          {/* Accordion */}
          {items.length > 0 ? (
            <Accordion
              type="single"
              collapsible
              className="flex-1 w-full space-y-3"
            >
              {items.map((it) => (
                <AccordionItem
                  key={it.idx}
                  value={"item-" + it.idx}
                  className={cn(
                    "!border !border-primary/15 hover:border-primary/40 !my-0 !py-0 !px-0 rounded-2xl bg-clear-ground transition-colors",
                    "data-[state=open]:border-primary/40 data-[state=open]:shadow-md data-[state=open]:shadow-primary/5"
                  )}
                >
                  <AccordionTrigger className="w-full px-5 py-4 text-start font-semibold text-text-1 hover:no-underline gap-4">
                    <span className="flex items-start gap-3 flex-1">
                      <span className="flex shrink-0 size-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                        {String(it.idx).padStart(2, "0")}
                      </span>
                      <span className="flex-1">{it.q}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pt-0 pb-5 text-text-3 leading-relaxed">
                    <div className="ps-10">{it.a}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-primary/15 bg-background-2 px-6 py-12 text-center">
              <div className="text-text-2 font-semibold">No matches found</div>
              <p className="text-sm text-text-3 mt-1">
                Try a different keyword or contact our team.
              </p>
            </div>
          )}

          {!isSearching && (
            <div className="pt-5">
              <Button
                onClick={() => setCount(expanded ? 5 : TOTAL_FAQS)}
                className="block w-64 mx-auto"
                size={"lg"}
                variant={"outline"}
              >
                {expanded ? text("displayLess") : text("displayMore")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
