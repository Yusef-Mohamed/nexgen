import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

interface ProgressUnitProps {
  totalProgress: number;
  layers: {
    darkColor: string;
    lightColor: string;
    progress: number;
  }[];
  size?: "sm" | "md" | "lg"; // Add size prop
}

const ProgressUnit: React.FC<ProgressUnitProps> = ({
  totalProgress,
  layers,
  size = "md", // Default to "md" if size is not provided
}) => {
  const radius = useMemo(() => {
    switch (size) {
      case "sm":
        return 30;
      case "lg":
        return 110;
      default:
        return 70;
    }
  }, [size]);

  const circumference = useMemo(() => radius * 2 * Math.PI, [radius]);

  const placeHolder = useMemo(() => {
    const percentage = 100;
    const stroke = circumference - (circumference * percentage) / 100;
    return (
      <circle
        cx="50%"
        cy="50%"
        r={radius}
        className="progress dark:block"
        style={
          {
            "--stroke-dashoffset": `${stroke}`,
            "--stroke-dasharray": `${circumference}`,
            "--stroke": `hsl(var(--muted))`,
            "--animation-time": `625ms`,
          } as React.CSSProperties
        }
      ></circle>
    );
  }, [radius, circumference]);

  return (
    <div className={`box ${size} relative w-fit mx-auto`}>
      <svg>
        <circle cx="50%" cy="50%" r={radius}></circle>
        {placeHolder}

        {layers?.map((layer, index) => {
          const percentage = layer.progress;
          const stroke = circumference - (circumference * percentage) / 100;
          return (
            <React.Fragment key={index}>
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="progress dark:block hidden"
                style={
                  {
                    "--stroke-dashoffset": `${stroke}`,
                    "--stroke-dasharray": `${circumference}`,
                    "--stroke": `${layer.darkColor}`,
                    "--animation-time": `625ms`,
                  } as React.CSSProperties
                }
              ></circle>
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="progress dark:hidden"
                style={
                  {
                    "--stroke-dashoffset": `${stroke}`,
                    "--stroke-dasharray": `${circumference}`,
                    "--stroke": `${layer.lightColor}`,
                    "--animation-time": `625ms`,
                  } as React.CSSProperties
                }
              ></circle>
            </React.Fragment>
          );
        })}
      </svg>
      <div
        style={{
          transform: "rotate(278deg)",
        }}
        className="absolute z-10 bg-transparent flex items-center justify-center top-0 right-0 w-full h-full"
      >
        <span
          className={cn("data-progress ", {
            "text-xs": size === "sm",
            "text-4xl": size === "lg",
            "text-3xl": size === "md",
          })}
          style={{
            transform: "rotate(-278deg)",
          }}
        >
          {totalProgress}%
        </span>
      </div>
    </div>
  );
};

export default ProgressUnit;
