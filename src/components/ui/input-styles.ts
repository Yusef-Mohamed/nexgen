import { cn } from "@/lib/utils";

const inputShellClassName =
  "min-w-36 rounded-xl border border-primary/10 bg-clear-ground text-sm text-text-1 shadow-sm transition-all duration-200 placeholder:text-text-3 hover:border-primary/25 focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60 md:text-base";

const inputHeightClassName = "h-11 md:h-12";

const inputPaddingClassName = "px-4 py-2 md:px-5 md:py-3";

const inputTriggerClassName = cn(
  "flex w-full items-center justify-between gap-3",
  inputHeightClassName,
  inputPaddingClassName,
  inputShellClassName,
);

const inputControlClassName = cn(
  "flex w-full",
  inputHeightClassName,
  inputPaddingClassName,
  inputShellClassName,
);

const inputTextareaClassName = cn(
  "flex min-h-32 w-full resize-y px-4 py-3 md:px-5 md:py-4",
  inputShellClassName,
);

export {
  inputShellClassName,
  inputHeightClassName,
  inputPaddingClassName,
  inputTriggerClassName,
  inputControlClassName,
  inputTextareaClassName,
};
