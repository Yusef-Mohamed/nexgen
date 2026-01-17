"use client";
import { useTranslations } from "next-intl";
import { IPackage } from "@/types";
import { getDynamicString } from "@/lib/utils";
import Image from "next/image";
import { CiDiscount1 } from "react-icons/ci";
import { FiPlayCircle } from "react-icons/fi";
import { CiMobile2 } from "react-icons/ci";
import { FaRegClock } from "react-icons/fa6";
import ServiceHeading from "./ServiceHeading";
import BuyService from "./BuyService";

interface ServiceCardProps {
  serviceData: IPackage;
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  serviceData,
  className,
}) => {
  const text = useTranslations("servicePage");

  // Calculate course duration if available
  const courseDuration = serviceData.course?.courseDuration || 0;
  const hoursOfVideos = (courseDuration / 60).toFixed(1);

  const items = [
    ...(courseDuration > 0
      ? [
          {
            icon: <FiPlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
            text: "nHourOfVideos",
            params: { n: hoursOfVideos },
          },
        ]
      : []),
    {
      icon: <FaRegClock className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "subscriptionDuration",
      params: { days: serviceData.subscriptionDurationDays },
    },
    {
      icon: <CiMobile2 className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "accessOnMobile",
    },
  ];

  return (
    <div className={className}>
      <div
        style={{
          filter: "blur(100px)",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
        }}
        className="absolute max-lg:hidden dark:bg-purple-400 bg-purple-200 opacity-70 bottom-0 right-0 translate-x-1/4 translate-y-1/4 size-20"
      ></div>
      <Image
        src={serviceData.course?.image || "/images/hero.png"}
        width={1000}
        height={1000}
        className="aspect-[41/31] object-cover w-full rounded-2xl"
        alt={getDynamicString(serviceData.title)}
      />
      <div className="flex items-center justify-between my-4 md:my-8">
        <div className="flex items-end gap-1 font-medium whitespace-nowrap">
          {serviceData.priceAfterDiscount ? (
            <>
              <div className="h2">${serviceData.priceAfterDiscount}</div>
              <del className="h3 text-text-3">${serviceData.price}</del>
            </>
          ) : (
            <div className="h2">
              {serviceData.price && serviceData.price !== 0 ? (
                <>${serviceData.price}</>
              ) : (
                text("free")
              )}
            </div>
          )}
        </div>
        {serviceData.priceAfterDiscount &&
        serviceData.priceAfterDiscount !== serviceData.price ? (
          <div
            style={{
              fontWeight: 400,
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-md h5 text-green bg-fadedGreen"
          >
            <CiDiscount1 className="w-6 h-6" />
            <span>
              {text("discounted")}{" "}
              {(
                ((serviceData.price - (serviceData.priceAfterDiscount || 0)) /
                  serviceData.price) *
                100
              ).toFixed(0)}
              %
            </span>
          </div>
        ) : null}
      </div>
      <ServiceHeading serviceData={serviceData} className="lg:hidden" />
      <BuyService id={serviceData._id} price={serviceData.price.toString()} />
      <div className="mt-6">
        <h4 className="mb-4 md:mb-6">{text("thisServiceIncludes")}</h4>
        <ul className="space-y-2 md:space-y-4">
          {items.map((item, index) => (
            <li
              className="flex items-center gap-2 text-sm md:text-base"
              key={index}
            >
              {item.icon}
              {item.params ? text(item.text, item.params as any) : text(item.text)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceCard;
