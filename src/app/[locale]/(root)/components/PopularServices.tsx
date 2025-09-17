"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/app/lib/utils";
import { IPackage } from "@/types";
import OneSidedContainer from "@/components/OneSidedContainer";
import ServicesSubsection from "./ServicesSubsection";

const getPopularServices = async (): Promise<IPackage[]> => {
  try {
    const res = await axiosInstance.get(
      `/packages?sort=-ratingsQuantity&limit=50`
    );
    return res.data.data as IPackage[];
  } catch (error) {
    console.error("Error fetching popular services:", error);
    return [];
  }
};

const PopularServices: React.FC = () => {
  const text = useTranslations("services");

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["popularServices"],
    queryFn: getPopularServices,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return (
    <OneSidedContainer className="pb-8">
      <ServicesSubsection
        services={services}
        loading={isLoading}
        theme={"carousel"}
        title={text("ourPopularServices")}
      />
    </OneSidedContainer>
  );
};

export default PopularServices;
