import { useTranslations } from "next-intl";
import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";
import { cn } from "@/lib/utils";

const OurValues = () => {
  const text = useTranslations("aboutOurValuesPage");
  const tones = [
    {
      bg: "bg-primary-faded",
      border: "border-primary/15",
      bar: "bg-primary",
      icon: "bg-primary/10 ring-primary/20",
    },
    {
      bg: "bg-secondary/10",
      border: "border-secondary/20",
      bar: "bg-secondary",
      icon: "bg-secondary/10 ring-secondary/25",
    },
    {
      bg: "bg-primary-faded",
      border: "border-primary/15",
      bar: "bg-primary",
      icon: "bg-primary/10 ring-primary/20",
    },
  ];

  return (
    <section className="container secPadding">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <SectionHeader
          eyebrow={text("ourValues")}
          heading={text("heading")}
          description={text("description")}
          tone="primary"
          className="lg:sticky lg:top-24"
        />
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-text-1/5",
                index === 2 && "md:col-span-2",
                tones[index].bg,
                tones[index].border,
              )}
            >
              <div
                aria-hidden
                className={cn(
                  "absolute top-0 start-6 end-6 h-1 rounded-b-full opacity-70 group-hover:opacity-100 transition-opacity",
                  tones[index].bar,
                )}
              />
              <div
                className={cn(
                  "mb-5 inline-flex size-16 items-center justify-center rounded-2xl ring-4 transition-transform duration-300 group-hover:scale-105",
                  tones[index].icon,
                )}
              >
                <Image
                  width={72}
                  height={72}
                  src={"/images/values_" + (index + 1) + ".png"}
                  alt={text(`case_${index + 1}_title`)}
                  className="size-12 object-contain"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-text-1">
                {text(`case_${index + 1}_title`)}
              </h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-text-3">
                {text(`case_${index + 1}_description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;
