"use client";

import { useChatStore } from "@/stores/ChatStore";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { safetyCopy, safetyReasons, safetyError, type SafetyMe, type SafetyKind } from "@/lib/safety-contract";

export function useCommunitySafety() {
  const { user, token } = useAuth();
  const query = useQuery({
    queryKey: ["community-safety", user?._id], enabled: Boolean(token),
    queryFn: async ({ signal }) => (await axiosInstance.get<{ data: SafetyMe }>("/moderation/me", { signal })).data.data,
    staleTime: 15000, refetchOnMount: "always",
  });
  return { ...query, user };
}
export function useSafetyHidden(authorId?: string) {
  const query = useCommunitySafety();
  return !query.data || query.isError || Boolean(authorId && query.data.hiddenUserIds.includes(authorId));
}
function useSafetyAction() {
  const cache = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ path, method = "post", body }: { path: string; method?: "post" | "put" | "delete"; body?: object }) =>
      axiosInstance.request({ url: "/moderation" + path, method, data: body }),
    onSuccess: async (_result, variables) => {
      if (variables.path.startsWith("/blocks/")) useChatStore.getState().resetSafety();
      await cache.invalidateQueries({ queryKey: ["community-safety", user?._id] });
      await cache.invalidateQueries({ predicate: (q) => String(q.queryKey[0]).startsWith("community-") && q.queryKey[0] !== "community-safety" });
    },
  });
}
export function CommunitySafetyRules() {
  const locale = useLocale();
  const t = safetyCopy[locale === "ar" ? "ar" : "en"];
  return <section className="space-y-3 text-start" dir={locale === "ar" ? "rtl" : "ltr"}>
    <h2 className="text-lg font-bold">{t.rulesTitle}</h2>
    <p className="text-sm leading-7">{t.rules}</p>
    <p className="text-sm leading-7 text-muted-foreground">{t.review}</p>
    <Link href="/contact" className="inline-flex min-h-11 items-center font-semibold text-primary underline">{t.support}</Link>
  </section>;
}
export function CommunitySafetyActions({ kind, targetId, authorId }: {
  kind: SafetyKind; targetId: string; authorId?: string; entity?: object;
}) {
  const locale = useLocale();
  const t = safetyCopy[locale === "ar" ? "ar" : "en"];
  const { user } = useAuth();
  const action = useSafetyAction();
  const [reason, setReason] = useState<(typeof safetyReasons)[number]>("spam");
  const [blocking, setBlocking] = useState(false);
  const own = user?._id === authorId;
  if (own) return null;
  if (!authorId) return null;
  return <details className="relative z-[5] mx-4 my-2 rounded-xl border border-primary/10 p-3 text-start text-sm" dir={locale === "ar" ? "rtl" : "ltr"}>
    <summary className="cursor-pointer py-2 font-semibold text-primary">{t.actions}</summary>
    <div className="space-y-3 pt-3">
      <label className="block space-y-2"><span>{t.reason}</span>
        <select className="block min-h-11 w-full rounded-lg border bg-background p-2" value={reason}
          onChange={(event) => setReason(event.target.value as typeof reason)}>
          {safetyReasons.map((value) => <option key={value} value={value}>{t[value]}</option>)}
        </select>
      </label>
      <div className="flex flex-wrap gap-2">
        <Button disabled={action.isPending} onClick={() => action.mutate({ path: "/reports/" + kind + "/" + targetId, body: { reason } })}>{t.report}</Button>
        <Button variant="outline" disabled={action.isPending} onClick={() => setBlocking(true)}>{t.block}</Button>
      </div>
      {blocking ? <div role="group" aria-label={t.confirmBlock} className="space-y-3 rounded-lg border p-3">
        <p>{t.blockInfo}</p>
        <Button disabled={action.isPending} onClick={() => action.mutate({ path: "/blocks/" + authorId, method: "put", body: {} })}>{t.confirmBlock}</Button>
        <Button variant="ghost" onClick={() => setBlocking(false)}>{t.cancel}</Button>
      </div> : null}
      {action.isError ? <p role="alert">{safetyError(action.error, locale)}</p> : null}
      {action.isSuccess ? <p role="status">{action.variables?.path.startsWith("/reports/") ? t.reportSent : t.sent}</p> : null}
    </div>
  </details>;
}
export function CommunityPublishingNotice() {
  const locale = useLocale();
  const t = safetyCopy[locale === "ar" ? "ar" : "en"];
  const safety = useCommunitySafety();
  if (!safety.data?.suspended) return null;
  return <div role="alert" className="m-3 space-y-2 text-start" dir={locale === "ar" ? "rtl" : "ltr"}>
    <p>{t.suspend}</p><Link href="/contact" className="inline-flex min-h-11 items-center text-primary underline">{t.support}</Link>
  </div>;
}
export function BlockedUsersSettings() {
  const locale = useLocale();
  const t = safetyCopy[locale === "ar" ? "ar" : "en"];
  const safety = useCommunitySafety();
  const action = useSafetyAction();
  return <section className="space-y-4 rounded-xl border border-primary/15 p-4 text-start" dir={locale === "ar" ? "rtl" : "ltr"}>
    <h2 className="font-semibold">{t.blocked}</h2>
    {safety.isPending ? <p role="status">{t.loading}</p> : null}
    {safety.isError ? <div role="alert">{t.error} <Button type="button" variant="outline" onClick={() => void safety.refetch()}>{t.retry}</Button></div> : null}
    {safety.data?.blocks.length === 0 ? <p>{t.noneBlocked}</p> : null}
    {safety.data?.blocks.map((member) => <div key={member.id} className="flex flex-wrap items-center justify-between gap-3">
      <span>{member.name}</span><Button type="button" disabled={action.isPending} variant="outline"
        onClick={() => action.mutate({ path: "/blocks/" + member.id, method: "delete" })}>{t.unblock}</Button>
    </div>)}
    {action.isError ? <p role="alert">{safetyError(action.error, locale)}</p> : null}
  </section>;
}
