"use client";
import { useTranslations } from "next-intl";
import { IPackage } from "@/types";
import { FiPlayCircle } from "react-icons/fi";
import { CiMobile2 } from "react-icons/ci";
import { HiOutlineChatBubbleLeftRight, HiOutlineClock, HiOutlineVideoCamera } from "react-icons/hi2";
import ServiceHeading from "./ServiceHeading";
import BuyService from "./BuyService";
import ItemImage from "../../../courses/[courseId]/components/ItemImage";
import CouponAwarePrice from "@/components/CouponAwarePrice";
import { getItemBasePrice } from "@/lib/coupons";
import { cn } from "@/lib/utils";

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

  const items: {
    icon: React.ReactNode;
    text: string;
    params?: Record<string, string | number>;
    tone: "primary" | "secondary" | "gold";
  }[] = [
    ...(courseDuration > 0
      ? [
          {
            icon: <FiPlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
            text: "nHourOfVideos",
            params: { n: hoursOfVideos },
            tone: "primary" as const,
          },
        ]
      : []),
    {
      icon: <HiOutlineClock className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "subscriptionDuration",
      params: { days: serviceData.subscriptionDurationDays },
      tone: "secondary" as const,
    },
    {
      icon: <CiMobile2 className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "accessOnMobile",
      tone: "gold" as const,
    },
    {
      icon: <HiOutlineVideoCamera className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "liveCoachingSessions",
      tone: "primary" as const,
    },
    {
      icon: (
        <HiOutlineChatBubbleLeftRight className="w-4 h-4 sm:w-5 sm:h-5" />
      ),
      text: "communityGroupChat",
      tone: "secondary" as const,
    },
  ];

  const toneToBg: Record<"primary" | "secondary" | "gold", string> = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    gold: "bg-gold/15 text-gold",
  };

  return (
    <div className={className}>
      <div
        aria-hidden
        className="absolute max-lg:hidden -bottom-16 -end-16 size-48 rounded-full bg-secondary/30 dark:bg-secondary/40 blur-[100px] opacity-60 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute max-lg:hidden -top-16 -start-16 size-40 rounded-full bg-gold/25 dark:bg-gold/35 blur-[100px] opacity-60 pointer-events-none"
      />
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
        price={getItemBasePrice(serviceData)}
        couponCode={couponCode}
      />
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4 md:mb-5">
          <span className="size-1.5 rounded-full bg-primary" />
          <h4 className="font-bold text-text-1">
            {text("thisServiceIncludes")}
          </h4>
        </div>
        <ul className="space-y-2.5 md:space-y-3">
          {items.map((item, index) => (
            <li
              className="flex items-center gap-3 text-sm md:text-base text-text-2"
              key={index}
            >
              <span
                className={cn(
                  "inline-flex size-9 shrink-0 items-center justify-center rounded-xl",
                  toneToBg[item.tone],
                )}
              >
                {item.icon}
              </span>
              <span className="flex-1">
                {item.params ? text(item.text, item.params) : text(item.text)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceCard;
