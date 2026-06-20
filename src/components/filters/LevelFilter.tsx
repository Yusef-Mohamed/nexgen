"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FilterType,
  CourseLevel,
  PathLevels,
} from "@/hooks/useDashboardFilters";

interface LevelFilterProps {
  value: string;
  onChange: (value: CourseLevel | PathLevels) => void;
  activeFilter: FilterType;
  label: string;
  allLevelsLabel: string;
  beginnerLabel: string;
  intermediateLabel: string;
  advancedLabel: string;
  beginnerToIntermediateLabel: string;
  intermediateToAdvancedLabel: string;
  beginnerToAdvancedLabel: string;
}

export const LevelFilter: React.FC<LevelFilterProps> = ({
  value,
  onChange,
  activeFilter,
  label,
  allLevelsLabel,
  beginnerLabel,
  intermediateLabel,
  advancedLabel,
  beginnerToIntermediateLabel,
  intermediateToAdvancedLabel,
  beginnerToAdvancedLabel,
}) => {
  // Don't render for services or events
  if (activeFilter !== "courses" && activeFilter !== "learning-paths") {
    return null;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-12 w-full rounded-xl border-primary/10 bg-clear-ground px-4 text-sm font-semibold text-text-2 shadow-none">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLevelsLabel}</SelectItem>
        {activeFilter === "courses" ? (
          <>
            <SelectItem value="beginner">{beginnerLabel}</SelectItem>
            <SelectItem value="intermediate">{intermediateLabel}</SelectItem>
            <SelectItem value="advanced">{advancedLabel}</SelectItem>
          </>
        ) : (
          <>
            <SelectItem value="beginnerToIntermediate">
              {beginnerToIntermediateLabel}
            </SelectItem>
            <SelectItem value="intermediateToAdvanced">
              {intermediateToAdvancedLabel}
            </SelectItem>
            <SelectItem value="beginnerToAdvanced">
              {beginnerToAdvancedLabel}
            </SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  );
};
