import React from "react";
import ServiceCard from "../../../../components/cards/ServiceCard";
import { getTranslations } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { IPackage } from "@/types";
import GridSection from "@/components/GridSection";

const Services: React.FC<{ viewAll?: boolean }> = async ({ viewAll }) => {
  const text = await getTranslations("services");
  const axiosInstance = await createServerAxiosInstance();
  const packagesRes = await axiosInstance.get(
    `/packages${viewAll ? "" : "?limit=3"}`
  );
  const packagesData = packagesRes.data.data as IPackage[];
  return (
    <GridSection
      id="services-section"
      heading={text("heading")}
      button={!viewAll ? text("exploreAllServices") : ""}
      href="/courses#services-section"
    >
      {packagesData.map((_package, index) => (
        <ServiceCard key={index} {..._package} />
      ))}
    </GridSection>
  );
};

export default Services;
