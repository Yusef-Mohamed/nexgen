"use client";

import { Search, ChevronDown, ChevronUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Instructor } from "@/hooks/useDashboardFilters";
import UserAvatar from "../UserAvatar";

interface InstructorFilterProps {
  value: string;
  onChange: (value: string) => void;
  instructors: Instructor[];
  filteredInstructors: Instructor[];
  instructorSearchTerm: string;
  onSearchTermChange: (term: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  searchForInstructorLabel: string;
  allInstructorsLabel: string;
}

export const InstructorFilter: React.FC<InstructorFilterProps> = ({
  value,
  onChange,
  instructors,
  filteredInstructors,
  instructorSearchTerm,
  onSearchTermChange,
  isOpen,
  onOpenChange,
  label,
  searchForInstructorLabel,
  allInstructorsLabel,
}) => {
  // Find the selected instructor
  const selectedInstructor = instructors.find(
    (instructor) => instructor._id === value,
  );

  // Determine what to display in the button
  const displayText =
    value === "all"
      ? allInstructorsLabel
      : selectedInstructor
        ? selectedInstructor.name
        : label;

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-12 w-full justify-between gap-4 rounded-xl border-primary/10 bg-clear-ground px-4 text-sm font-semibold text-text-2 shadow-none hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
        >
          <div className="flex items-center gap-2">
            {selectedInstructor && selectedInstructor.profileImg ? (
              <UserAvatar user={selectedInstructor} size="sm" />
            ) : null}
            <span className="truncate">{displayText}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{
          width: "var(--radix-dropdown-menu-trigger-width )",
        }}
        className="w-auto overflow-hidden p-1"
      >
        <div className="space-y-1 h-64 overflow-y-auto overflow-x-hidden">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchForInstructorLabel}
                value={instructorSearchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="h-10 rounded-xl border-primary/10 bg-background-2 ps-10! text-sm shadow-none"
              />
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onChange("all")}
            className={`flex items-center cursor-pointer gap-2 ${
              value === "all" ? "bg-primary/10" : ""
            }`}
          >
            <div className="flex size-6 items-center justify-center rounded-full bg-background-2">
              <User className="size-3" />
            </div>
            {allInstructorsLabel}
          </DropdownMenuItem>
          {filteredInstructors.map((instructor) => (
            <DropdownMenuItem
              key={instructor._id}
              onClick={() => onChange(instructor._id)}
              className={`flex items-center cursor-pointer gap-2 ${
                value === instructor._id ? "bg-primary/10" : ""
              }`}
            >
              <UserAvatar user={instructor} size="sm" />
              {instructor.name}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
