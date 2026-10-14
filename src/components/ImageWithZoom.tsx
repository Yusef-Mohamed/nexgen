"use client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import { ImageViewer } from "./image-viewer";

type Props = { className?: string; src: string; alt: string; width: number; height: number; unoptimized?: boolean };

export default function ImageWithZoom({ className, src, alt, width, height, unoptimized = false }: Props) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLImageElement>(null);
  const t = useTranslations("imageViewer");
  return <>
    <Image ref={trigger} width={width} height={height} src={src} alt={alt} unoptimized={unoptimized}
      className={cn(className, "cursor-zoom-in focus-visible:outline-2 focus-visible:outline-primary")}
      role="button" tabIndex={0} aria-label={alt ? `${t("open")}: ${alt}` : t("open")}
      onClick={event => { event.stopPropagation(); setOpen(true); }}
      onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); setOpen(true); } }} />
    {open && <ImageViewer images={[src]} index={0} alt={alt} unoptimized={unoptimized} onClose={() => { setOpen(false); trigger.current?.focus(); }} />}
  </>;
}
