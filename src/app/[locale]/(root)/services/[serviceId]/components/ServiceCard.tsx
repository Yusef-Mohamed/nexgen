"use client";
import { useTranslations } from "next-intl";
import { IPackage } from "@/types";
import { FiPlayCircle } from "react-icons/fi";
import { CiMobile2 } from "react-icons/ci";
import { FaRegClock } from "react-icons/fa6";
import ServiceHeading from "./ServiceHeading";
import BuyService from "./BuyService";
import ItemImage from "../../../courses/[courseId]/components/ItemImage";
import CouponAwarePrice from "@/components/CouponAwarePrice";

interface ServiceCardProps {
  serviceData: IPackage;
  couponCode?: string;
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  serviceData,
  couponCode,
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
      <ItemImage
        image={serviceData.image || "/images/hero.png"}
        title={serviceData.title}
        promotionVideo={serviceData?.promotionVideo}
      />
      <CouponAwarePrice
        item={serviceData}
        itemId={serviceData._id}
        itemType="service"
        couponCode={couponCode}
        freeLabel={text("free")}
        discountedLabel={text("discounted")}
      />
      <ServiceHeading serviceData={serviceData} className="lg:hidden" />
      <BuyService
        id={serviceData._id}
        price={serviceData.priceAfterDiscount ?? serviceData.price}
        couponCode={couponCode}
      />
      <div className="mt-6">
        <h4 className="mb-4 md:mb-6">{text("thisServiceIncludes")}</h4>
        <ul className="space-y-2 md:space-y-4">
          {items.map((item, index) => (
            <li
              className="flex items-center gap-2 text-sm md:text-base"
              key={index}
            >
              {item.icon}
              {item.params
                ? text(item.text, item.params as any)
                : text(item.text)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceCard;
