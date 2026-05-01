import React from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "secondary" | "gold";

interface SectionHeaderProps {
  eyebrow?: React.ReactNode;
  heading: React.ReactNode;
  description?: React.ReactNode;
  align?: "start" | "center";
  tone?: Tone;
  className?: string;
  icon?: React.ReactNode;
}

const toneClasses: Record<Tone, { dot: string; chip: string; text: string }> = {
  primary: {
    dot: "bg-primary",
    chip: "bg-primary/10 border-primary/20",
    text: "text-primary",
  },
  secondary: {
    dot: "bg-secondary",
    chip: "bg-secondary/10 border-secondary/20",
    text: "text-secondary",
  },
  gold: {
    dot: "bg-gold",
    chip: "bg-gold/15 border-gold/30",
    text: "text-gold",
  },
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  heading,
  description,
  align = "start",
  tone = "primary",
  className,
  icon,
}) => {
  const t = toneClasses[tone];
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center max-w-2xl mx-auto",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full border",
            t.chip,
          )}
        >
          {icon ?? <span className={cn("size-1.5 rounded-full", t.dot)} />}
          <span className={cn("text-xs sm:text-sm font-medium", t.text)}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="font-bold text-text-1 leading-tight">{heading}</h2>
      {description && (
        <p className="text-text-3 max-w-2xl">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
