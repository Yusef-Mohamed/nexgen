"use client";
import React, { useEffect, useRef, useState } from "react";

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
  const [parentWidth, setParentWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setParentWidth(containerRef.current?.clientWidth || 0);
    const handleResize = () => {
      setParentWidth(containerRef.current?.clientWidth || 0);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const XLCONTAINER = 1350;
  const selectedContainer = parentWidth > XLCONTAINER ? 1350 : 1280;

  return (
    <div className={`${className}`} ref={containerRef}>
      <div
        style={{
          maxWidth: selectedContainer + (parentWidth - selectedContainer) / 2,
        }}
        className={`ps-4 ms-auto ${containerClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export default OneSidedContainer;
