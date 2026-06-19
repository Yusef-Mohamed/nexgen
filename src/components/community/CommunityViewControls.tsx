"use client";

import useCustomSearchParams from "@/hooks/useSearchParams";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  Columns3,
  Focus,
  LayoutDashboard,
  MessageSquareText,
  Newspaper,
  Rows3,
  Sparkles,
  SquareStack,
  TableProperties,
} from "lucide-react";
import {
  CommunityContentVariant,
  CommunityLayoutVariant,
  communityContentOptions,
  communityLayoutOptions,
  resolveCommunityContent,
  resolveCommunityLayout,
} from "./communityViewVariants";

const layoutIcons: Record<
  CommunityLayoutVariant,
  React.ComponentType<{ className?: string }>
> = {
  hub: LayoutDashboard,
  rooms: Columns3,
  board: TableProperties,
  focus: Focus,
};

const contentIcons: Record<
  CommunityContentVariant,
  React.ComponentType<{ className?: string }>
> = {
  cards: Newspaper,
  rows: Rows3,
  threads: MessageSquareText,
  story: Sparkles,
};

const CommunityViewControls = () => {
  const t = useTranslations("community");
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const activeLayout = resolveCommunityLayout(searchParams.get("layout"));
  const activeContent = resolveCommunityContent(searchParams.get("content"));

  const setLayout = (layout: CommunityLayoutVariant) => {
    setSearchParams({
      layout: layout === "hub" ? "" : layout,
    });
  };

  const setContent = (content: CommunityContentVariant) => {
    setSearchParams({
      content: content === "cards" ? "" : content,
    });
  };

  return (
    <>
      <VariantPanel
        className="fixed bottom-5 start-4 z-40 hidden max-w-[calc(50vw-2rem)] lg:start-[21rem] md:block"
        icon={<SquareStack className="size-4" />}
        label={t("layoutControl")}
      >
        {communityLayoutOptions.map((option) => {
          const Icon = layoutIcons[option.value];
          return (
            <VariantButton
              key={option.value}
              active={activeLayout === option.value}
              label={t(option.labelKey)}
              onClick={() => setLayout(option.value)}
            >
              <Icon className="size-4" />
            </VariantButton>
          );
        })}
      </VariantPanel>

      <VariantPanel
        className="fixed bottom-5 end-4 z-40 hidden max-w-[calc(50vw-2rem)] md:block"
        icon={<MessageSquareText className="size-4" />}
        label={t("contentControl")}
      >
        {communityContentOptions.map((option) => {
          const Icon = contentIcons[option.value];
          return (
            <VariantButton
              key={option.value}
              active={activeContent === option.value}
              label={t(option.labelKey)}
              onClick={() => setContent(option.value)}
            >
              <Icon className="size-4" />
            </VariantButton>
          );
        })}
      </VariantPanel>

      <div className="fixed inset-x-3 bottom-3 z-40 flex flex-col gap-2 md:hidden">
        <VariantPanel
          icon={<SquareStack className="size-4" />}
          label={t("layoutControl")}
        >
          {communityLayoutOptions.map((option) => {
            const Icon = layoutIcons[option.value];
            return (
              <VariantButton
                key={option.value}
                active={activeLayout === option.value}
                label={t(option.labelKey)}
                onClick={() => setLayout(option.value)}
                compact
              >
                <Icon className="size-4" />
              </VariantButton>
            );
          })}
        </VariantPanel>
        <VariantPanel
          icon={<MessageSquareText className="size-4" />}
          label={t("contentControl")}
        >
          {communityContentOptions.map((option) => {
            const Icon = contentIcons[option.value];
            return (
              <VariantButton
                key={option.value}
                active={activeContent === option.value}
                label={t(option.labelKey)}
                onClick={() => setContent(option.value)}
                compact
              >
                <Icon className="size-4" />
              </VariantButton>
            );
          })}
        </VariantPanel>
      </div>
    </>
  );
};

const VariantPanel: React.FC<{
  children: React.ReactNode;
  className?: string;
  icon: React.ReactNode;
  label: string;
}> = ({ children, className, icon, label }) => {
  return (
    <div
      className={cn(
        "pointer-events-auto rounded-2xl border border-primary/15 bg-clear-ground/90 p-2 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-text-3">
        <span className="inline-flex size-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        {label}
      </div>
      <div className="grid grid-cols-4 gap-1.5">{children}</div>
    </div>
  );
};

const VariantButton: React.FC<{
  active: boolean;
  children: React.ReactNode;
  compact?: boolean;
  label: string;
  onClick: () => void;
}> = ({ active, children, compact = false, label, onClick }) => {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "group inline-flex min-w-0 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-300",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-transparent bg-background hover:border-primary/30 hover:bg-primary/10 hover:text-primary",
        compact && "px-2",
      )}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
      <span className={cn("truncate", compact && "sr-only")}>{label}</span>
    </button>
  );
};

export default CommunityViewControls;
