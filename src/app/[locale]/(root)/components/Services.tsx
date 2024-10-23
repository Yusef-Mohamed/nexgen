import React from "react";
import ServiceCard from "../../../../components/cards/ServiceCard";
import { getTranslations } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { IPackage } from "@/types";
import GridSection from "@/components/GridSection";

const Services: React.FC = async () => {
  const text = await getTranslations("services");
  const axiosInstance = createServerAxiosInstance();
  const packagesRes = await axiosInstance.get("/packages");
  const packagesData = packagesRes.data.data as IPackage[];
  return (
    <GridSection heading={text("heading")}>
      {packagesData.map((_package, index) => (
        <ServiceCard key={index} {..._package} />
      ))}
    </GridSection>
  );
};

export default Services;
