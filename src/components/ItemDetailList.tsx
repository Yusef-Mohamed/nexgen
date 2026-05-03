import { cn, getDynamicString } from "@/lib/utils";
import type { DynamicString } from "@/types";
import type { ReactNode } from "react";

type Tone = "primary" | "secondary";

const toneStyles: Record<
  Tone,
  {
    item: string;
    icon: string;
  }
> = {
  primary: {
    item: "border-primary/10 hover:border-primary/30",
    icon: "bg-primary/15 text-primary",
  },
  secondary: {
    item: "border-secondary/15 hover:border-secondary/40",
    icon: "bg-secondary/15 text-secondary",
  },
};

const ItemDetailList: React.FC<{
  items: DynamicString[];
  tone: Tone;
  icon: ReactNode;
  className?: string;
  asFragment?: boolean;
}> = ({ items, tone, icon, className, asFragment }) => {
  const styles = toneStyles[tone];

  const rows = items.map((item, index) => (
    <li
      key={index}
      className={cn(
        "flex items-start gap-3 rounded-xl bg-clear-ground/70 border p-3 sm:p-4 transition-colors",
        styles.item,
      )}
    >
      <span
        className={cn(
          "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg",
          styles.icon,
        )}
      >
        {icon}
      </span>
      <p className="flex-1 text-sm md:text-base text-text-2 leading-relaxed">
        {getDynamicString(item)}
      </p>
    </li>
  ));

  if (asFragment) {
    return <>{rows}</>;
  }

  return (
    <ul className={cn("grid gap-3 md:grid-cols-2 md:gap-4", className)}>
      {rows}
    </ul>
  );
};

export default ItemDetailList;
