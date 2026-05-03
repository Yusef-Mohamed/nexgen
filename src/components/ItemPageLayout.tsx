import type { ReactNode } from "react";

const StickyItemCard: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="max-w-[29rem] hidden relative h-fit lg:block basis-[40%] lg:sticky lg:top-32">
      <div className="relative overflow-hidden rounded-3xl bg-clear-ground border border-primary/10 p-5 sm:p-6">
        {children}
      </div>
    </div>
  );
};

const ItemPageLayout: React.FC<{
  children: ReactNode;
  aside: ReactNode;
}> = ({ children, aside }) => {
  return (
    <>
      <section className="container relative flex gap-12 xl:gap-20 secPadding">
        <div className="flex-1 w-full min-w-0">{children}</div>
        <StickyItemCard>{aside}</StickyItemCard>
      </section>
    </>
  );
};

export { StickyItemCard };
export default ItemPageLayout;
