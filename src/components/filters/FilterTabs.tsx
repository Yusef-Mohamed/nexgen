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
      "px-6 py-3 rounded-full font-medium grow border transition-all duration-300",
      isActive
        ? cn(
            "bg-primary text-primary-foreground border-primary",
            !flat && "shadow-lg",
          )
        : "dark:bg-background bg-clear-ground text-foreground  border-transparent hover:border-primary hover:text-primary",
    )}
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
        "flex flex-wrap gap-2 bg-background-2 p-2 rounded-[24px]",
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
