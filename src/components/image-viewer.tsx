"use client";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from "lucide-react";
import { ImageZoom, type ZoomPoint } from "@/lib/image-zoom";
import { Button } from "./ui/button";

type Props = { images: string[]; index: number; onClose: () => void; onIndexChange?: (index: number) => void; alt?: string; unoptimized?: boolean };

export function ImageViewer({ images, index, onClose, onIndexChange, alt = "", unoptimized = false }: Props) {
  const t = useTranslations("imageViewer"), rtl = useLocale() === "ar";
  if (!images[index]) return null;
  return <Dialog.Root open onOpenChange={open => { if (!open) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/80" />
      <Dialog.Content dir={rtl ? "rtl" : "ltr"} className="fixed inset-2 z-[80] flex flex-col overflow-hidden rounded-2xl border bg-background text-foreground shadow-xl sm:inset-6" onClick={event => event.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-2">
          <Dialog.Title className="font-semibold">{t("title")}</Dialog.Title>
          <Dialog.Close asChild><Button type="button" size="icon" variant="ghost" className="size-11" aria-label={t("close")}><X /></Button></Dialog.Close>
        </div>
        <Dialog.Description className="sr-only">{alt || t("hint")}</Dialog.Description>
        <ZoomSurface key={images[index]} src={images[index]} alt={alt || t("title")} unoptimized={unoptimized} />
        {images.length > 1 && <div className="flex shrink-0 items-center justify-center gap-4 pb-2">
          <Button type="button" size="icon" variant="ghost" className="size-11" disabled={index === 0} aria-label={t("previous")} onClick={() => onIndexChange?.(index - 1)}>{rtl ? <ChevronRight /> : <ChevronLeft />}</Button>
          <span>{index + 1} / {images.length}</span>
          <Button type="button" size="icon" variant="ghost" className="size-11" disabled={index === images.length - 1} aria-label={t("next")} onClick={() => onIndexChange?.(index + 1)}>{rtl ? <ChevronLeft /> : <ChevronRight />}</Button>
        </div>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

function ZoomSurface({ src, alt, unoptimized }: { src: string; alt: string; unoptimized: boolean }) {
  const t = useTranslations("imageViewer");
  const viewport = useRef<HTMLDivElement>(null), layer = useRef<HTMLDivElement>(null);
  const [model] = useState(() => new ImageZoom());
  const pointers = useRef(new Map<number, ZoomPoint>());
  const [percent, setPercent] = useState(100);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const tap = useRef({ time: 0, x: 0, y: 0 });
  const started = useRef({ time: 0, x: 0, y: 0, moved: false });
  const apply = () => {
    const { x, y, scale } = model.value;
    if (layer.current) layer.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  };
  const point = (x: number, y: number) => {
    const box = viewport.current!.getBoundingClientRect();
    return { x: x - box.left - box.width / 2, y: y - box.top - box.height / 2 };
  };
  const zoom = (scale: number) => { model.zoom(scale); apply(); setPercent(Math.round(model.value.scale * 100)); };
  useEffect(() => {
    const element = viewport.current!;
    const applyTransform = () => {
      const { x, y, scale } = model.value;
      if (layer.current) layer.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    };
    const observer = new ResizeObserver(() => {
      model.resize({ width: element.clientWidth, height: element.clientHeight }); applyTransform();
    });
    observer.observe(element);
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const box = element.getBoundingClientRect();
      model.zoom(model.value.scale * Math.exp(-event.deltaY * 0.002), { x: event.clientX - box.left - box.width / 2, y: event.clientY - box.top - box.height / 2 });
      applyTransform(); setPercent(Math.round(model.value.scale * 100));
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => { observer.disconnect(); element.removeEventListener("wheel", wheel); };
  }, [model]);
  const finish = (id: number) => {
    pointers.current.delete(id); model.begin([...pointers.current.values()]);
    setPercent(Math.round(model.value.scale * 100));
  };
  return <>
    <div ref={viewport} data-testid="image-zoom-surface" className="relative min-h-0 flex-1 touch-none select-none overflow-hidden" style={{ cursor: percent > 100 ? "grab" : "zoom-in" }}
      onPointerDown={event => {
        if (event.button !== 0) return;
        event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId);
        pointers.current.set(event.pointerId, point(event.clientX, event.clientY));
        started.current = { time: Date.now(), x: event.clientX, y: event.clientY, moved: pointers.current.size > 1 };
        model.begin([...pointers.current.values()]);
      }}
      onPointerMove={event => {
        if (!pointers.current.has(event.pointerId)) return;
        if (Math.hypot(event.clientX - started.current.x, event.clientY - started.current.y) > 8) started.current.moved = true;
        pointers.current.set(event.pointerId, point(event.clientX, event.clientY)); model.move([...pointers.current.values()]); apply();
      }}
      onPointerUp={event => {
        const now = Date.now();
        if (!started.current.moved && now - started.current.time < 250) {
          if (now - tap.current.time < 300 && Math.hypot(event.clientX - tap.current.x, event.clientY - tap.current.y) < 28) {
            model.zoom(model.value.scale > 1 ? 1 : 2.5, point(event.clientX, event.clientY)); apply(); tap.current.time = 0;
          } else tap.current = { time: now, x: event.clientX, y: event.clientY };
        } else tap.current.time = 0;
        finish(event.pointerId);
      }}
      onPointerCancel={event => { tap.current.time = 0; finish(event.pointerId); }}
      onLostPointerCapture={event => finish(event.pointerId)}>
      <div ref={layer} className="pointer-events-none absolute inset-0 will-change-transform">
        <Image key={attempt} src={src} alt={alt} fill sizes="100vw" unoptimized={unoptimized} draggable={false} className="object-contain"
          onLoad={event => { model.resize(model.viewport, { width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight }); apply(); }} onError={() => setFailed(true)} />
      </div>
    </div>
    {failed && <Button type="button" variant="ghost" onClick={() => { setFailed(false); setAttempt(v => v + 1); }}>{t("retry")}</Button>}
    <p className="shrink-0 px-4 pt-2 text-center text-xs text-muted-foreground">{t("hint")}</p>
    <div className="flex shrink-0 items-center justify-center gap-3 p-2">
      <Button type="button" size="icon" variant="ghost" className="size-11" aria-label={t("zoomOut")} disabled={percent <= 100} onClick={() => zoom(model.value.scale - 0.5)}><Minus /></Button>
      <span data-testid="image-zoom-percent" aria-live="polite" className="w-14 text-center tabular-nums">{percent}%</span>
      <Button type="button" size="icon" variant="ghost" className="size-11" aria-label={t("zoomIn")} disabled={percent >= 500} onClick={() => zoom(model.value.scale + 0.5)}><Plus /></Button>
      <Button type="button" size="icon" variant="ghost" className="size-11" aria-label={t("reset")} onClick={() => zoom(1)}><RotateCcw /></Button>
    </div>
  </>;
}
