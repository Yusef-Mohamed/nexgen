"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusOption<T extends string> {
  value: T;
  label: string;
}

interface SearchWithStatusFilterProps<T extends string> {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusValue: T;
  onStatusChange: (value: T) => void;
  statusOptions: StatusOption<T>[];
  statusPlaceholder?: string;
  className?: string;
}

export const SearchWithStatusFilter = <T extends string>({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  statusOptions,
  statusPlaceholder,
  className,
}: SearchWithStatusFilterProps<T>) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center",
        className
      )}
    >
      <div className="relative flex-1 w-full">
        <SearchIcon className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-10"
        />
      </div>

      <Select
        value={statusValue}
        onValueChange={(value) => onStatusChange(value as T)}
      >
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder={statusPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchWithStatusFilter;
