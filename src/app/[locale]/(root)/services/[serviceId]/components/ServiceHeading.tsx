"use client";
import { IPackage } from "@/types";
import { getDynamicString } from "@/lib/utils";

interface ServiceHeadingProps {
  serviceData: IPackage;
  className?: string;
}

const ServiceHeading: React.FC<ServiceHeadingProps> = ({
  serviceData,
  className,
}) => {
  return (
    <div className={className}>
      <h1>{getDynamicString(serviceData.title)}</h1>
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
