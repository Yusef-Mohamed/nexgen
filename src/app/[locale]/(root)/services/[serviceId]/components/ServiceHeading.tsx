"use client";
import { IPackage } from "@/types";
import { cn, getDynamicString } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { HiOutlineSparkles } from "react-icons/hi2";

interface ServiceHeadingProps {
  serviceData: IPackage;
  className?: string;
}

const ServiceHeading: React.FC<ServiceHeadingProps> = ({
  serviceData,
  className,
}) => {
  const text = useTranslations("servicePage");

  return (
    <div className={cn("relative", className)}>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-primary/10 border border-primary/20 cardShadowSm">
        <HiOutlineSparkles className="size-4 text-primary" />
        <span className="text-xs sm:text-sm font-medium text-primary">
          {text("service")}
        </span>
      </div>
      <h1 className="font-bold leading-tight tracking-tight text-text-1">
        {getDynamicString(serviceData.title)}
      </h1>
      <div
        style={{
          fontWeight: 400,
        }}
        className="my-4 text-text-2 md:my-8 prose prose-sm md:prose-base max-w-none prose-headings:font-semibold prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5"
        dangerouslySetInnerHTML={{
          __html: getDynamicString(serviceData.description) ?? "",
        }}
      />
    </div>
  );
};

export default ServiceHeading;
