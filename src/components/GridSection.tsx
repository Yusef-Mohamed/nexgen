import { Link } from "@/i18n/routing";
import { Button } from "./ui/button";

const GridSection = ({
  children,
  heading,
  button,
  href,
  id,
}: {
  children: React.ReactNode;
  heading: string;
  button?: string;
  href?: string;
  id?: string;
}) => {
  return (
    <section id={id} className="container secPadding">
      <h2>{heading}</h2>
      <div className="grid gap-6 my-6 sm:my-12 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
      {button && (
        <Button
          className="block mx-auto text-center exploreAllReviews w-80"
          variant={"outline"}
          size={"lg"}
          asChild={!!href}
        >
          {href ? <Link href={href}>{button}</Link> : button}
        </Button>
      )}
    </section>
  );
};

export default GridSection;
