import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { FaSpinner } from "react-icons/fa";

const buttonVariants = cva(
  "inline-flex flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          // "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        muted: "bg-muted shadow-sm hover:bg-muted/90",
        primaryOutline:
          "border border-primary text-primary shadow-sm hover:bg-primary/90 hover:text-primary-foreground",
      },
      // size: {
      //   default: "h-10 px-4 py-2",
      //   sm: "h-9 rounded-md px-3",
      //   lg: "h-11 rounded-md px-8",
      //   icon: "h-10 w-10",
      // },
      // size: {
      //   default:
      //     "md:h-[3rem] lg:h-[3.25rem] min-w-36 md:px-5 md:py-3 px-4 py-2 h-[2.75rem] text-sm md:text-base",
      //   lg: "md:h-[3.5rem] lg:h-[3.75rem] min-w-40 lg:px-6 lg:py-4 px-5 py-3 h-[3.25rem] text-base lg:text-lg",
      //   sm: "h-8 rounded-md px-3 text-xs",
      //   icon: "h-9 w-9",
      // },
      size: {
        default:
          "md:h-[2.75rem] lg:h-[3rem] min-w-36 md:px-5 px-4 h-[2.5rem] text-sm md:text-base",
        lg: "md:h-[3rem] lg:h-[3.25rem] min-w-40 lg:px-6 px-5 h-[2.75rem] text-base lg:text-lg",
        sm: "h-8 rounded-md px-3 text-xs",
        icon: "h-9 w-9",
        old: "h-10 px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? <FaSpinner className="animate-spin" /> : children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
