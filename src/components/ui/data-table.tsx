import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";
const dataTableFilterControlClassName =
  "h-10! rounded-xl! border-primary/10! bg-clear-ground! text-sm font-normal text-text-1 shadow-sm hover:border-primary/25 hover:bg-clear-ground hover:text-text-1 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/15 md:h-10! md:text-sm lg:h-12!";

const dataTableOutlineButtonClassName =
  "rounded-xl border-primary/10 bg-clear-ground shadow-sm hover:border-primary/25 hover:bg-primary/10 hover:text-primary";

const dataTableVariants = cva(
  [
    "relative isolate overflow-hidden text-text-1",
    "[&_thead]:bg-primary/[0.045]",
    "[&_thead_tr]:border-primary/10 [&_thead_tr]:hover:bg-transparent",
    "[&_th]:!h-12 [&_th]:!px-4 [&_th]:text-xs [&_th]:font-bold [&_th]:tracking-wide [&_th]:text-text-3",
    "[&_tbody_tr]:border-primary/10 [&_tbody_tr]:hover:bg-primary/[0.035]",
    "[&_td]:!px-4 [&_td]:!py-3.5",
  ],
  {
    variants: {
      variant: {
        surface:
          "rounded-2xl border border-primary/10 bg-clear-ground shadow-sm",
        striped:
          "rounded-2xl border border-primary/10 bg-clear-ground shadow-sm [&_tbody_tr:nth-child(even)]:bg-primary/[0.035] [&_tbody_tr:nth-child(even)]:hover:bg-primary/[0.07]",
        grid: "rounded-2xl border border-primary/15 bg-clear-ground [&_th:not(:last-child)]:border-e [&_th:not(:last-child)]:border-primary/10 [&_td:not(:last-child)]:border-e [&_td:not(:last-child)]:border-primary/10",
        elevated:
          "rounded-2xl border border-primary/15 bg-clear-ground cardShadow before:absolute before:inset-x-6 before:top-0 before:z-10 before:h-1 before:rounded-b-full before:bg-primary/80",
        compact:
          "rounded-xl border border-primary/10 bg-clear-ground shadow-sm [&_th]:!h-9 [&_th]:!px-3 [&_td]:!px-3 [&_td]:!py-2",
      },
    },
    defaultVariants: {
      variant: "striped",
    },
  },
);

type DataTableVariant = NonNullable<
  VariantProps<typeof dataTableVariants>["variant"]
>;

const dataTableVariantNames = [
  "surface",
  "striped",
  "grid",
  "elevated",
  "compact",
] as const satisfies readonly DataTableVariant[];

interface DataTableProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dataTableVariants> {}

const DataTable = React.forwardRef<HTMLDivElement, DataTableProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(dataTableVariants({ variant }), className)}
      {...props}
    />
  ),
);
DataTable.displayName = "DataTable";

const DataTableHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="data-table-header"
    className={cn(
      "flex flex-col gap-4 border-b border-primary/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5",
      className,
    )}
    {...props}
  />
));
DataTableHeader.displayName = "DataTableHeader";

const DataTableHeading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-w-0 items-center gap-3", className)}
    {...props}
  />
));
DataTableHeading.displayName = "DataTableHeading";

const DataTableIcon = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary",
      className,
    )}
    {...props}
  />
));
DataTableIcon.displayName = "DataTableIcon";

const DataTableTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("font-bold leading-tight text-text-1", className)}
    {...props}
  />
));
DataTableTitle.displayName = "DataTableTitle";

const DataTableDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mt-1 text-xs leading-5 text-text-3 sm:text-sm", className)}
    {...props}
  />
));
DataTableDescription.displayName = "DataTableDescription";

const DataTableToolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="data-table-toolbar"
    className={cn(
      "flex flex-col gap-3 border-b border-primary/10 bg-background-2/45 px-4 py-3 sm:px-5 lg:flex-row lg:items-center",
      className,
    )}
    {...props}
  />
));
DataTableToolbar.displayName = "DataTableToolbar";

const DataTableContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="data-table-content"
    className={cn(
      "relative w-full overflow-x-auto overscroll-x-contain",
      className,
    )}
    {...props}
  />
));
DataTableContent.displayName = "DataTableContent";

const DataTableFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="data-table-footer"
    className={cn(
      "flex items-center justify-center border-t border-primary/10 bg-background-2/35 px-4 py-3 sm:justify-end sm:px-5",
      className,
    )}
    {...props}
  />
));
DataTableFooter.displayName = "DataTableFooter";

interface DataTableEmptyProps extends Omit<
  React.TdHTMLAttributes<HTMLTableCellElement>,
  "title"
> {
  colSpan: number;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
}

const DataTableEmpty = ({
  className,
  colSpan,
  description,
  icon,
  title,
  ...props
}: DataTableEmptyProps) => (
  <TableRow className="hover:bg-transparent">
    <TableCell
      colSpan={colSpan}
      className={cn("!px-5 !py-14 text-center", className)}
      {...props}
    >
      <div className="mx-auto flex max-w-sm flex-col items-center">
        <span className="mb-3 inline-flex size-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
          {icon ?? <Inbox aria-hidden className="size-5" />}
        </span>
        <p className="font-semibold text-text-1">{title}</p>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-text-3">{description}</p>
        ) : null}
      </div>
    </TableCell>
  </TableRow>
);
DataTableEmpty.displayName = "DataTableEmpty";

export {
  DataTable,
  DataTableContent,
  DataTableDescription,
  DataTableEmpty,
  DataTableFooter,
  DataTableHeader,
  DataTableHeading,
  DataTableIcon,
  DataTableTitle,
  DataTableToolbar,
  dataTableFilterControlClassName,
  dataTableOutlineButtonClassName,
  dataTableVariants,
  dataTableVariantNames,
};
export type { DataTableProps, DataTableVariant };
