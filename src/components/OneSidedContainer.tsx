"use client";

import React from "react";

interface OneSidedContainerProps {
  children: React.ReactNode;
  className?: string;
  backgroundClassName?: string;
  containerClassName?: string;
  extendSide?: "left" | "right";
  padding?: string;
}

const OneSidedContainer: React.FC<OneSidedContainerProps> = ({
  children,
  className = "",
  containerClassName = "",
}) => {
  return (
    <div className={`${className}`}>
      <div
        style={{
          maxWidth: "calc(50% + 700px)",
        }}
        className={`ps-4 md:ps-8 ms-auto ${containerClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export default OneSidedContainer;
