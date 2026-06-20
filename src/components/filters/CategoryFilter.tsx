"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/types";
import { getDynamicString } from "@/lib/utils";

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  categories: ICategory[];
  label: string;
  allCategoriesLabel: string;
  isLoading: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  value,
  onChange,
  categories,
  label,
  allCategoriesLabel,
  isLoading,
}) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger className="h-12 w-full rounded-xl border-primary/10 bg-clear-ground px-4 text-sm font-semibold text-text-2 shadow-none">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allCategoriesLabel}</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category._id} value={category._id}>
            {getDynamicString(category.title)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
