import Image from "next/image";
import React from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  iconSrc: string;
  style?: React.CSSProperties;
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  iconSrc,
  style,
}) => {
  return (
    <div
      className="flex items-center gap-4 p-3 shadow-md  sm:p-4 sm:gap-5 rounded-xl"
      style={style}
    >
      <Image
        src={iconSrc}
        alt={title}
        className="rounded-md aspect-square w-16 sm:w-[4.5rem]"
        width={72}
        height={72}
      />
      <div>
        <div className="text-sm font-semibold sm:text-base">{title}</div>
        <div className="mt-2 text-xs sm:text-sm text-text-3">{description}</div>
      </div>
    </div>
  );
};

export default FeatureCard;
