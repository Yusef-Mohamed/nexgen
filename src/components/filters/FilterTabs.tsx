"use client";

import { cn } from "@/app/lib/utils";

interface FilterTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterTab: React.FC<FilterTabProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-6 py-3 rounded-full font-medium grow border transition-all duration-300",
      isActive
        ? "bg-primary text-primary-foreground border-primary shadow-lg"
        : "dark:bg-background bg-clear-ground text-foreground  border-transparent hover:border-primary hover:text-primary"
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
  onChange: (value: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  options,
  activeValue,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap  gap-2 bg-muted/50 dark:bg-card p-2 rounded-[24px]">
      {options.map((option) => (
        <FilterTab
          key={option.value}
          label={option.label}
          isActive={activeValue === option.value}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
};
