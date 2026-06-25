import DashboardContainer from "../../components/DashboardContainer";

const MarketingPageShell = ({
  children,
  description,
  icon,
  title,
}: {
  children: React.ReactNode;
  description: string;
  icon: React.ReactNode;
  title: string;
}) => {
  return (
    <main className="w-full !bg-transparent px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
      <DashboardContainer className="space-y-5">
        <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-5 shadow-sm sm:p-6">
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(hsl(var(--primary)/0.08)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="relative flex min-w-0 items-center gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
              {icon}
            </span>
            <div className="min-w-0">
              <h1 className="text-lg font-black text-text-1 sm:text-xl">
                {title}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-text-3">
                {description}
              </p>
            </div>
          </div>
        </section>
        {children}
      </DashboardContainer>
    </main>
  );
};

export default MarketingPageShell;
