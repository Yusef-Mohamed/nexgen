"use client";
import ImageWithZoom from "./ImageWithZoom";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "./auth-provider";
import { Button } from "./ui/button";
export function ChatAttachment({ uri }: { uri: string }) {
  const { token } = useAuth();
  const locale = useLocale();
  const [resource, setResource] = useState<{ name: string; token: string; url?: string; failed?: boolean } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const name = uri.split("/").pop()?.split("?")[0] || "";
  const isImage = /\.(png|jpe?g|gif|webp)$/i.test(name);
  const current = resource?.name === name && resource.token === token ? resource : null;
  const url = current?.url, failed = current?.failed;
  useEffect(() => {
    if (!token || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,254}$/.test(name)) return;
    const controller = new AbortController();
    let objectUrl = "";
    axiosInstance.get<Blob>("/messages/media/" + name, { responseType: "blob", signal: controller.signal })
      .then(({ data }) => { if (controller.signal.aborted) return; objectUrl = URL.createObjectURL(data); setResource({ name, token, url: objectUrl }); })
      .catch(() => { if (!controller.signal.aborted) setResource({ name, token, failed: true }); });
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [token, name, attempt]);
  return <div className="mt-3 space-y-2">
    <div className={isImage ? "relative flex aspect-square w-80 max-w-full items-center justify-center overflow-hidden rounded-xl bg-background-2" : ""}>
    {failed ? <Button variant="outline" className="max-w-full whitespace-normal" onClick={() => { setResource(null); setAttempt(attempt + 1); }}>{locale === "ar" ? "تعذر تحميل المرفق. أعد المحاولة" : "Attachment unavailable. Retry"}</Button> : null}
    {url ? (isImage ? <ImageWithZoom key={url} unoptimized width={400} height={400} src={url} alt={locale === "ar" ? "مرفق المحادثة" : "Chat attachment"} className="absolute inset-0 size-full object-contain" /> : null) : !failed ? <span role="status">{locale === "ar" ? "جار تحميل المرفق..." : "Loading attachment..."}</span> : null}
    </div>
    <div className="flex h-11 items-center">{url ? <a className="inline-flex min-h-11 items-center underline" href={url} download={name}>{locale === "ar" ? "تنزيل المرفق" : "Download attachment"}</a> : null}</div>
  </div>;
}
