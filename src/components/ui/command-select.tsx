"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { inputTriggerClassName } from "@/components/ui/input-styles";

type CommandSelectOption = {
  value: string;
  label: React.ReactNode;
  searchLabel?: string;
  leading?: React.ReactNode;
  disabled?: boolean;
};

type CommandSelectProps = {
  value?: string;
  onValueChange: (value: string) => void;
  options: CommandSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  triggerClassName?: string;
  align?: "start" | "center" | "end";
};

const getOptionSearchValue = (option: CommandSelectOption) =>
  option.searchLabel ||
  (typeof option.label === "string" ? option.label : option.value);

const CommandSelect = ({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  disabled,
  className,
  contentClassName,
  triggerClassName,
  align = "start",
}: CommandSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const listId = React.useId();
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-controls={listId}
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            inputTriggerClassName,
            "text-start",
            !selectedOption && "text-text-3",
            triggerClassName,
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-3">
            {selectedOption?.leading}
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-text-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn(
          "w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border-primary/10 bg-clear-ground p-0 shadow-lg shadow-text-1/5",
          contentClassName,
        )}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList id={listId}>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={getOptionSearchValue(option)}
                  disabled={option.disabled}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-3">
                    {option.leading}
                    <span className="truncate">{option.label}</span>
                  </span>
                  <Check
                    className={cn(
                      "ms-auto size-4 text-primary",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { CommandSelect };
export type { CommandSelectOption, CommandSelectProps };
