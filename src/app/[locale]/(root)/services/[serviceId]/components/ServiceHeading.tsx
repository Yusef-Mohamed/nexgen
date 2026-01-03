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
      <p
        style={{
          fontWeight: 400,
        }}
        className="my-4 text-text-2 h3 md:my-8"
      >
        {getDynamicString(serviceData.description)}
      </p>
    </div>
  );
};

export default ServiceHeading;
