"use client";

import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { MdOutlineErrorOutline } from "react-icons/md";
import { type ComponentType } from "react";
import { cn } from "@/lib/utils";

interface SidebarItemButtonProps {
  title: string;
  subtitle?: string;
  Icon: ComponentType<{ className?: string }>;
  isFocused: boolean;
  isDone?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const SidebarItemButton: React.FC<SidebarItemButtonProps> = ({
  title,
  subtitle,
  Icon,
  isFocused,
  isDone,
  disabled = false,
  onClick,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={isFocused ? "default" : "ghost"}
      className="w-full flex items-center !h-auto justify-between gap-2 py-3 px-3 rounded-lg text-start"
    >
      <div className="flex items-center gap-5 flex-1 min-w-0">
        <Icon className="w-10 h-10 flex-shrink-0" />
        <div className="w-full flex-1 overflow-hidden">
          <h5 className="overflow-hidden line-clamp-1 font-medium whitespace-break-spaces">
            {title}
          </h5>
          <span
            className={cn(
              "text-sm text-muted-foreground line-clamp-1 whitespace-break-spaces",
              isFocused && "text-primary-foreground/80"
            )}
          >
            {subtitle}
          </span>
        </div>
      </div>
      {disabled ? (
        <Lock className="w-4 h-4 flex-shrink-0" />
      ) : isDone === false ? (
        <MdOutlineErrorOutline className="w-5 h-5 text-destructive flex-shrink-0" />
      ) : null}
    </Button>
  );
};

export default SidebarItemButton;
