import { cn } from "@/lib/utils";

type SectionTone = "primary" | "secondary" | "gold";

const toneStyles: Record<
  SectionTone,
  {
    pillBg: string;
    iconBg: string;
    panelBg: string;
    panelBorder: string;
    bar: string;
  }
> = {
  primary: {
    pillBg: "bg-primary/10 border-primary/20 text-primary",
    iconBg: "bg-primary/15 text-primary",
    panelBg: "bg-primary-faded",
    panelBorder: "border-primary/15",
    bar: "bg-primary",
  },
  secondary: {
    pillBg: "bg-secondary/10 border-secondary/20 text-secondary",
    iconBg: "bg-secondary/15 text-secondary",
    panelBg: "bg-secondary/10",
    panelBorder: "border-secondary/20",
    bar: "bg-secondary",
  },
  gold: {
    pillBg: "bg-gold/10 border-gold/25 text-gold",
    iconBg: "bg-gold/20 text-gold",
    panelBg: "bg-gold/10",
    panelBorder: "border-gold/25",
    bar: "bg-gold",
  },
};

const SectionBlock: React.FC<{
  tone: SectionTone;
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ tone, eyebrow, title, icon, children, className }) => {
  const styles = toneStyles[tone];

  return (
    <div
      className={cn(
        "relative my-6 md:my-8 rounded-2xl border p-5 sm:p-6 md:p-7 overflow-hidden",
        styles.panelBg,
        styles.panelBorder,
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute top-0 start-6 end-6 h-1 rounded-b-full opacity-70",
          styles.bar,
        )}
      />
      <div className="flex items-center gap-3 mb-5 md:mb-6">
        <div
          className={cn(
            "inline-flex items-center justify-center size-10 rounded-xl",
            styles.iconBg,
          )}
        >
          {icon}
        </div>
        <div>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] sm:text-xs font-semibold uppercase tracking-wide",
              styles.pillBg,
            )}
          >
            <span className="size-1 rounded-full bg-current opacity-70" />
            {eyebrow}
          </div>
          <h3 className="mt-1 font-bold text-text-1">{title}</h3>
        </div>
      </div>
      {children}
    </div>
  );
};

export default SectionBlock;
