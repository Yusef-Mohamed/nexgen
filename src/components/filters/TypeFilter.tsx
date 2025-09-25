"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TypeFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

const TypeFilter = ({ value, onValueChange }: TypeFilterProps) => {
  const text = useTranslations("courses");

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        {text("filter_by_type")}:
      </span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="courses">{text("courses")}</SelectItem>
          <SelectItem value="learning-paths">
            {text("learning_paths")}
          </SelectItem>
          <SelectItem value="services">{text("services")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TypeFilter;
