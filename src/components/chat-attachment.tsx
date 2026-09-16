"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "./auth-provider";
import { Button } from "./ui/button";
export function ChatAttachment({ uri }: { uri: string }) {
  const { token } = useAuth();
  const locale = useLocale();
  const [url, setUrl] = useState("");
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const name = uri.split("/").pop()?.split("?")[0] || "";
  useEffect(() => {
    if (!token || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,254}$/.test(name)) return;
    const controller = new AbortController();
    let objectUrl = "";
    axiosInstance.get<Blob>("/messages/media/" + name, { responseType: "blob", signal: controller.signal })
      .then(({ data }) => { if (controller.signal.aborted) return; objectUrl = URL.createObjectURL(data); setUrl(objectUrl); })
      .catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [token, name, attempt]);
  return <div className="mt-3 space-y-2">
    {failed ? <Button variant="outline" onClick={() => { setFailed(false); setAttempt(attempt + 1); }}>{locale === "ar" ? "تعذر تحميل المرفق. أعد المحاولة" : "Attachment unavailable. Retry"}</Button> : null}
    {url ? <>
      {/.(png|jpe?g|gif|webp)$/i.test(name) ? <Image unoptimized width={400} height={400} src={url} alt={locale === "ar" ? "مرفق المحادثة" : "Chat attachment"} className="max-h-80 rounded-xl object-contain" /> : null}
      <a className="inline-flex min-h-11 items-center underline" href={url} download={name}>{locale === "ar" ? "تنزيل المرفق" : "Download attachment"}</a>
    </> : !failed ? <span role="status">{locale === "ar" ? "جار تحميل المرفق..." : "Loading attachment..."}</span> : null}
  </div>;
}
