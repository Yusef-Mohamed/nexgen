import * as React from "react";

import { cn } from "@/lib/utils";
import { inputControlClassName } from "@/components/ui/input-styles";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        inputControlClassName,
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text-1",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
