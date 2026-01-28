"use client";

import { Button } from "@/components/ui/button";
import { Lock, ChevronUp, ChevronDown } from "lucide-react";
import { MdOutlineErrorOutline } from "react-icons/md";
import { type ComponentType } from "react";
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
        "w-full flex items-center !h-auto justify-between gap-2 py-4 px-4 rounded-2xl text-start transition-all duration-300 cursor-pointer",
        {
          "hover:bg-primary/10": variant !== "primary",
          "border border-primary bg-primary/5": isOutline,
        }
      )}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Image width={40} height={40} alt="section" src={icon} />

        <div className="w-full flex-1 overflow-hidden space-y-1">
          <div className="flex items-center gap-2">
            {badge && (
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-bold rounded-md shrink-0",
                  isPrimary ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                )}
              >
                {badge}
              </span>
            )}
            <h5
              className={cn(
                "overflow-hidden line-clamp-1 font-bold text-base whitespace-break-spaces",
                isPrimary ? "text-white" : "text-gray-900 dark:text-gray-100"
              )}
            >
              {title}
            </h5>
          </div>
          <span
            className={cn(
              "text-sm line-clamp-1 whitespace-break-spaces font-medium",
              isPrimary ? "text-white/80" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {subtitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!disabled && isDone === false && (
          <MdOutlineErrorOutline className="w-5 h-5 text-destructive shrink-0" />
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
                  isPrimary ? "text-white/60" : "text-gray-400 dark:text-gray-500"
                )}
              />
            ) : isExpanded ? (
              <ChevronUp
                className={cn("w-5 h-5", isPrimary ? "text-white" : "text-gray-400 dark:text-gray-500")}
              />
            ) : (
              <ChevronDown
                className={cn("w-5 h-5", isPrimary ? "text-white" : "text-gray-400 dark:text-gray-500")}
              />
            )}
          </div>
        ) : (
          disabled && (
            <Lock
              className={cn(
                "w-4 h-4 shrink-0",
                isPrimary ? "text-white/60" : "text-gray-400 dark:text-gray-500"
              )}
            />
          )
        )}
      </div>
    </Button>
  );
};

export default SidebarItemButton;
