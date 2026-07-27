"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineLockClosed,
} from "react-icons/hi2";

interface SidebarItemButtonProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  isFocused: boolean;
  isDone?: boolean;
  disabled?: boolean;
  onClick: () => void;
  badge?: string;
  variant?: "primary" | "none" | "primary-outline";
  isExpanded?: boolean;
  onToggle?: () => void;
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
    <div
      className={cn(
        "group/item relative flex items-center rounded-xl border transition-all duration-200",
        isPrimary
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-transparent bg-transparent text-text-1 hover:border-primary/15 hover:bg-primary/5",
        isOutline && "border-primary/25 bg-primary/10",
        isFocused && !isPrimary && "border-primary/30 bg-primary/10",
        disabled && "opacity-60",
      )}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-current={isFocused ? "step" : undefined}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed"
      >
        <span
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-lg border",
            isPrimary
              ? "border-primary-foreground/20 bg-primary-foreground/15 text-primary-foreground"
              : "border-primary/10 bg-primary/10 text-primary",
          )}
        >
          {icon}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            {badge && (
              <span
                className={cn(
                  "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-black",
                  isPrimary
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "bg-primary/10 text-primary",
                )}
              >
                {badge}
              </span>
            )}
            <span
              className={cn(
                "line-clamp-2 text-sm font-bold leading-5",
                isPrimary ? "text-primary-foreground" : "text-text-1",
              )}
            >
              {title}
            </span>
          </span>
          {subtitle && (
            <span
              className={cn(
                "mt-0.5 block line-clamp-1 text-xs font-medium",
                isPrimary ? "text-primary-foreground/75" : "text-text-3",
              )}
            >
              {subtitle}
            </span>
          )}
        </span>

        {disabled ? (
          <HiOutlineLockClosed
            className={cn(
              "size-4 shrink-0",
              isPrimary ? "text-primary-foreground/70" : "text-text-3",
            )}
          />
        ) : isDone ? (
          <HiOutlineCheckCircle
            className={cn(
              "size-5 shrink-0",
              isPrimary ? "text-primary-foreground" : "text-green",
            )}
          />
        ) : (
          <span
            aria-hidden
            className={cn(
              "size-2 shrink-0 rounded-full",
              isPrimary ? "bg-primary-foreground/70" : "bg-primary/35",
            )}
          />
        )}
      </button>

      {onToggle && !disabled && (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          className={cn(
            "me-2 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            isPrimary
              ? "text-primary-foreground hover:bg-primary-foreground/10"
              : "text-text-3 hover:bg-primary/10 hover:text-primary",
          )}
        >
          {isExpanded ? (
            <HiOutlineChevronUp className="size-4" />
          ) : (
            <HiOutlineChevronDown className="size-4" />
          )}
        </button>
      )}
    </div>
  );
};

export default SidebarItemButton;
