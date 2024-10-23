import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Logo = ({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) => {
  const sizes = {
    sm: {
      width: 65,
      height: 68,
      textSize: "text-2xl",
    },
    md: {
      width: 82,
      height: 85,
      textSize: "text-3xl",
    },
    lg: {
      width: 98,
      height: 102,
      textSize: "text-4xl",
    },
  };
  const responsiveSizes = {
    sm: {
      width: 50,
      height: 52,
      textSize: "text-xl",
    },
    md: {
      width: 65,
      height: 68,
      textSize: "text-2xl",
    },
    lg: {
      width: 82,
      height: 85,
      textSize: "text-3xl",
    },
  };
  return (
    <Link
      href={"/"}
      className={cn(
        `flex gap-px items-center font-semibold whitespace-nowrap sm:${sizes[size].textSize} ${responsiveSizes[size].textSize}`,
        className
      )}
    >
      <Image
        src="/images/logo.svg"
        alt="NexGen Logo"
        className={cn(
          `sm:w-${sizes[size].width} w-${responsiveSizes[size].width} sm:h-${sizes[size].height} h-${responsiveSizes[size].height}`
        )}
        width={sizes[size].width}
        height={sizes[size].height}
      />
      <div>NexGen</div>
    </Link>
  );
};

export default Logo;
