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
      textSize: "text-xl sm:text-2xl",
      imageClassName: "h-[52px] w-[50px] sm:h-[68px] sm:w-[65px]",
    },
    md: {
      width: 82,
      height: 85,
      textSize: "text-2xl sm:text-3xl",
      imageClassName: "h-[68px] w-[65px] sm:h-[85px] sm:w-[82px]",
    },
    lg: {
      width: 98,
      height: 102,
      textSize: "text-3xl sm:text-4xl",
      imageClassName: "h-[85px] w-[82px] sm:h-[102px] sm:w-[98px]",
    },
  };
  const imageClassName =
    isIconic && size === "sm"
      ? "size-9 sm:size-10"
      : sizes[size].imageClassName;

  return (
    <Link
      href={"/"}
      className={cn(
        `flex gap-px items-center font-semibold whitespace-nowrap  `,
        className,
      )}
    >
      <Image
        src="/logos/logo.svg"
        alt={text("alt")}
        className={cn("shrink-0 object-contain", imageClassName)}
        width={sizes[size].width}
        height={sizes[size].height}
      />
      {!isIconic && (
        <div className={`${sizes[size].textSize} flex flex-col`}>
          <span>NexGen</span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
