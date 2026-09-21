"use client";

import { useChatStore } from "@/stores/ChatStore";
import { type ReactNode, useRef, useState } from "react";
import { Ban, Flag, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
export function CommunitySafetyActions({ kind, targetId, authorId, children, className }: {
  kind: SafetyKind; targetId: string; authorId?: string; entity?: object;
  children?: ReactNode; className?: string;
}) {
  const locale = useLocale();
  const t = safetyCopy[locale === "ar" ? "ar" : "en"];
  const { user } = useAuth();
  const action = useSafetyAction();
  const [reason, setReason] = useState<(typeof safetyReasons)[number]>("spam");
  const [mode, setMode] = useState<"report" | "block" | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const canModerate = Boolean(authorId && user && user._id !== authorId);
  const moreLabel = locale === "ar" ? "المزيد من الخيارات" : "More options";
  const closeLabel = locale === "ar" ? "إغلاق" : "Close";
  const startAction = (next: "report" | "block") => {
    action.reset();
    setReason("spam");
    setMode(next);
  };
  if (!canModerate && !children) return null;
  return <>
    <DropdownMenu dir={locale === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button ref={trigger} type="button" size="icon" variant="ghost" aria-label={moreLabel} title={moreLabel}
          className={cn("relative z-[5] size-11 shrink-0 rounded-full p-0 text-text-3 hover:bg-primary/5 hover:text-text-1 focus-visible:ring-2 focus-visible:ring-primary", className)}>
          <MoreHorizontal className="size-5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="min-w-48">
        {children}
        {canModerate && <>
          {children && <DropdownMenuSeparator />}
          <DropdownMenuItem className="min-h-11" onSelect={() => startAction("report")}><Flag aria-hidden="true" />{t.report}</DropdownMenuItem>
          <DropdownMenuItem className="min-h-11 text-destructive focus:bg-destructive/10 focus:text-destructive" onSelect={() => startAction("block")}><Ban aria-hidden="true" />{t.block}</DropdownMenuItem>
        </>}
      </DropdownMenuContent>
    </DropdownMenu>
    <Dialog open={mode !== null} onOpenChange={(open) => { if (!open && !action.isPending) setMode(null); }}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl text-start" dir={locale === "ar" ? "rtl" : "ltr"}
        onCloseAutoFocus={(event) => { event.preventDefault(); trigger.current?.focus(); }}>
        <DialogTitle className="pe-6">{mode === "block" ? t.confirmBlock : t.report}</DialogTitle>
        <DialogDescription>{mode === "block" ? t.blockInfo : t.review}</DialogDescription>
        {action.isSuccess ? <p role="status" className="rounded-xl bg-primary/5 p-4 text-sm leading-7">{mode === "report" ? t.reportSent : t.sent}</p> : <>
          {mode === "report" && <label className="space-y-2 text-sm font-medium"><span>{t.reason}</span>
            <select className="block min-h-11 w-full rounded-xl border border-primary/15 bg-background p-3 focus-visible:outline-primary" value={reason} disabled={action.isPending}
              onChange={(event) => setReason(event.target.value as typeof reason)}>
              {safetyReasons.map((value) => <option key={value} value={value}>{t[value]}</option>)}
            </select>
          </label>}
          {action.isError && <p role="alert" className="text-sm text-destructive">{safetyError(action.error, locale)}</p>}
        </>}
        <DialogFooter className="gap-2 sm:space-x-0">
          <Button type="button" variant="outline" disabled={action.isPending} onClick={() => setMode(null)}>{action.isSuccess ? closeLabel : t.cancel}</Button>
          {!action.isSuccess && <Button type="button" variant={mode === "block" ? "destructive" : "default"} disabled={action.isPending}
            onClick={() => action.mutate(mode === "block" ? { path: "/blocks/" + authorId, method: "put", body: {} } : { path: "/reports/" + kind + "/" + targetId, body: { reason } })}>
            {action.isPending ? t.loading : mode === "block" ? t.confirmBlock : t.report}
          </Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>;
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
