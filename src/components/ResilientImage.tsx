"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

const FALLBACK = "/images/image-unavailable.svg";
const LOAD_TIMEOUT_MS = 4000;

export default function ResilientImage(props: ImageProps) {
  const sourceKey = typeof props.src === "string"
    ? props.src
    : "src" in props.src ? props.src.src : props.src.default.src;
  return <ImageAttempt key={sourceKey} {...props} />;
}

function ImageAttempt({ src, alt, onLoad, onError, ...props }: ImageProps) {
  const [failed, setFailed] = useState(!src);
  const imageRef = useRef<HTMLImageElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settled = useRef(false);
  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    const image = imageRef.current;
    if (!image || failed || settled.current) return;
    const startTimer = () => {
      if (settled.current || timerRef.current) return;
      timerRef.current = setTimeout(() => {
        settled.current = true;
        setFailed(true);
      }, LOAD_TIMEOUT_MS);
    };
    // Lazy images get their full timeout once they approach the viewport.
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        startTimer();
        observer.disconnect();
      }
    }, { rootMargin: "200px" });
    if (props.priority || props.preload || props.loading === "eager") startTimer();
    else observer.observe(image);
    return () => { clearTimer(); observer.disconnect(); };
  }, [failed, props.priority, props.preload, props.loading]);

  return <Image
    {...props}
    ref={imageRef}
    alt={alt}
    src={failed ? FALLBACK : src}
    // Browser requests keep slow upload servers out of Next's image optimizer.
    unoptimized
    onLoad={(event) => {
      settled.current = true;
      clearTimer();
      if (!failed) onLoad?.(event);
    }}
    onError={(event) => {
      settled.current = true;
      clearTimer();
      if (!failed) { setFailed(true); onError?.(event); }
    }}
  />;
}
