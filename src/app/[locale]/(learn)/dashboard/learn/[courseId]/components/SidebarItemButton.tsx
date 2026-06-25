"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CircleAlert, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarItemButtonProps {
  title: string;
  subtitle?: string;
  icon: string;
  isFocused: boolean;
  isDone?: boolean;
  disabled?: boolean;
  onClick: () => void;
  badge?: string;
  variant?: "primary" | "none" | "primary-outline";
  isExpanded?: boolean;
  onToggle?: (e: React.MouseEvent) => void;
}

const SidebarItemButton: React.FC<SidebarItemButtonProps> = ({
  title,
  subtitle,
  icon,
  isFocused,
  isDone,
  disabled = false,
  onClick,
  badge,
  variant = "none",
  isExpanded,
  onToggle,
}) => {
  const isPrimary = variant === "primary";
  const isOutline = variant === "primary-outline";

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={isPrimary ? "default" : "none"}
      className={cn(
        "flex !h-auto w-full cursor-pointer items-center justify-between gap-2 rounded-2xl px-4 py-4 text-start transition-all duration-300",
        {
          "hover:bg-primary/10": variant !== "primary",
          "border border-primary/30 bg-primary/10": isOutline,
          "bg-primary/5 ring-1 ring-primary/20": isFocused && !isPrimary,
        },
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Image width={40} height={40} alt="section" src={icon} />

        <div className="w-full flex-1 space-y-1 overflow-hidden">
          <div className="flex items-center gap-2">
            {badge && (
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-bold rounded-md shrink-0",
                  isPrimary
                    ? "bg-white/20 text-white"
                    : "bg-primary/10 text-primary",
                )}
              >
                {badge}
              </span>
            )}
            <h5
              className={cn(
                "overflow-hidden line-clamp-1 font-bold text-base whitespace-break-spaces",
                isPrimary ? "text-white" : "text-text-1",
              )}
            >
              {title}
            </h5>
          </div>
          <span
            className={cn(
              "text-sm line-clamp-1 whitespace-break-spaces font-medium",
              isPrimary ? "text-white/80" : "text-text-3",
            )}
          >
            {subtitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!disabled && isDone === false && (
          <CircleAlert className="size-5 shrink-0 text-destructive" />
        )}

        {onToggle ? (
          <div
            onClick={(e) => {
              if (disabled) return;
              e.stopPropagation();
              onToggle(e);
            }}
            className={cn("p-1 rounded-full transition-colors", {
              "hover:bg-white/10 cursor-pointer": !disabled,
            })}
          >
            {disabled ? (
              <Lock
                className={cn(
                  "w-4 h-4 shrink-0",
                  isPrimary ? "text-white/60" : "text-text-3",
                )}
              />
            ) : isExpanded ? (
              <ChevronUp
                className={cn(
                  "w-5 h-5",
                  isPrimary ? "text-white" : "text-text-3",
                )}
              />
            ) : (
              <ChevronDown
                className={cn(
                  "w-5 h-5",
                  isPrimary ? "text-white" : "text-text-3",
                )}
              />
            )}
          </div>
        ) : (
          disabled && (
            <Lock
              className={cn(
                "w-4 h-4 shrink-0",
                isPrimary ? "text-white/60" : "text-text-3",
              )}
            />
          )
        )}
      </div>
    </Button>
  );
};

export default SidebarItemButton;
