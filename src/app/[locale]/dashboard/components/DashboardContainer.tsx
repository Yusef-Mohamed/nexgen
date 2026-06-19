import { cn } from "@/lib/utils";

const DashboardContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("mx-auto w-full max-w-[1320px]", className)} {...props}>
      {children}
    </div>
  );
};

export default DashboardContainer;
