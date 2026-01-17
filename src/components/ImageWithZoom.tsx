"use client";
import { cn } from "@/lib/utils";
import { Dialog } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState } from "react";
import { DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";

interface ImageWithZoomProps {
  className?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}
const ImageWithZoom: React.FC<ImageWithZoomProps> = ({
  className,
  src,
  alt,
  width,
  height,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("common");
  return (
    <>
      <Image
        width={width}
        height={height}
        src={src}
        alt={alt}
        className={cn(className, "cursor-pointer")}
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <Dialog
          open={isOpen}
          onOpenChange={(value) => {
            setIsOpen(value);
          }}
        >
          <DialogContent className="max-w-[95vw] sm:max-w-[95vw] p-0 overflow-hidden flex flex-col w-[95vw] max-h-[95vh] h-[95vh] ">
            <DialogTitle className="sr-only">{t("dialog.image_zoom_title")}</DialogTitle>
            <DialogDescription className="sr-only">
              {alt}
            </DialogDescription>
            <div className="grow w-full overflow-hidden">
              <Image
                width={2000}
                height={2000}
                src={src}
                alt={alt}
                onMouseEnter={(e) => {
                  e.currentTarget.style.scale = "2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.scale = "1";
                }}
                onMouseMove={(e) => {
                  const { left, top, width, height } =
                    e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - left) / width;
                  const y = (e.clientY - top) / height;
                  e.currentTarget.style.transformOrigin = `${x * 100}% ${
                    y * 100
                  }%`;
                }}
                className="object-contain w-full h-full cursor-zoom-in"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ImageWithZoom;
