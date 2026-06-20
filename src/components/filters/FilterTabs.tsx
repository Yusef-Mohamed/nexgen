"use client";

import { cn } from "@/app/lib/utils";

interface FilterTabProps {
  label: string;
  isActive: boolean;
  flat?: boolean;
  onClick: () => void;
}

const FilterTab: React.FC<FilterTabProps> = ({
  label,
  isActive,
  flat = false,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "min-h-11 grow rounded-xl border px-5 py-2.5 text-sm font-bold transition-all duration-300",
      isActive
        ? cn(
            "border-primary bg-primary text-primary-foreground",
            !flat && "shadow-lg shadow-primary/10",
          )
        : "border-transparent bg-clear-ground text-text-3 hover:border-primary/30 hover:bg-primary/10 hover:text-primary",
    )}
    type="button"
  >
    {label}
  </button>
);

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterTabsProps {
  options: FilterOption[];
  activeValue: string;
  flat?: boolean;
  onChange: (value: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  options,
  activeValue,
  flat = false,
  onChange,
}) => {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 rounded-2xl bg-background-2 p-1.5",
        !flat && "cardShadow",
        flat && "border border-primary/10",
      )}
    >
      {options.map((option) => (
        <FilterTab
          key={option.value}
          label={option.label}
          isActive={activeValue === option.value}
          flat={flat}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
};
