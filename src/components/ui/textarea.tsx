import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, value, ...props }, ref) => {
  const [hasScroll, setHasScroll] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const checkScroll = () => {
      if (wrapperRef.current) {
        const textareaElement = wrapperRef.current.querySelector(
          "textarea"
        ) as HTMLTextAreaElement;
        if (textareaElement) {
          const hasVerticalScroll =
            textareaElement.scrollHeight > textareaElement.clientHeight;

          setHasScroll(hasVerticalScroll);
        }
      }
    };
    setTimeout(() => {
      checkScroll();
    }, 100);
    window.addEventListener("resize", checkScroll);

    // Create a ResizeObserver to watch for content changes
    const resizeObserver = new ResizeObserver(checkScroll);
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      window.removeEventListener("resize", checkScroll);
      resizeObserver.disconnect();
    };
  }, [value]);
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
        hasScroll && "rounded-e-none"
      )}
      ref={ref}
      value={value}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
