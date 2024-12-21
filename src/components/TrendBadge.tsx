import { cn } from "@/lib/utils";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

const TrendBadge = ({
  percentage,
  positive = false,
  className,
}: {
  percentage: string;
  positive?: boolean;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "flex items-center w-fit  py-1 px-1.5 rounded gap-1",
        {
          "bg-primary/10 text-primary": positive,
          "bg-destructive/10 text-destructive": !positive,
        },
        className
      )}
    >
      {percentage}%{positive ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
    </span>
  );
};

export default TrendBadge;
