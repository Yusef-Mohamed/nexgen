import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Logo = ({
  className,
  size = "md",
  isIconic = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  isIconic?: boolean;
}) => {
  const text = useTranslations("logo");
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
        `flex gap-px items-center font-semibold whitespace-nowrap  `,
        className
      )}
    >
      <Image
        src="/logos/logo.svg"
        alt={text("alt")}
        className={cn(
          `sm:w-${sizes[size].width} w-${responsiveSizes[size].width} sm:h-${sizes[size].height} h-${responsiveSizes[size].height}`
        )}
        width={sizes[size].width}
        height={sizes[size].height}
      />
      {!isIconic && (
        <div
          className={`${responsiveSizes[size].textSize} sm:${sizes[size].textSize} flex flex-col`}
        >
          <span>NexGen</span>
          <span className="h-1 text-xs text-text-3">{text("beta")}</span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
