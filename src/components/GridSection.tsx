import { Link } from "@/i18n/navigation";
import { Button } from "./ui/button";
import SectionHeader from "./SectionHeader";

const GridSection = ({
  children,
  heading,
  eyebrow,
  description,
  tone = "primary",
  align = "start",
  button,
  href,
  id,
  onClick,
}: {
  children: React.ReactNode;
  heading: string;
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  tone?: "primary" | "secondary";
  align?: "start" | "center";
  button?: string;
  href?: string;
  id?: string;
  onClick?: () => void;
}) => {
  return (
    <section id={id} className="container secPadding">
      {eyebrow || description ? (
        <SectionHeader
          eyebrow={eyebrow}
          heading={heading}
          description={description}
          tone={tone}
          align={align}
        />
      ) : (
        <h2>{heading}</h2>
      )}
      <div className="grid gap-6 my-6 sm:my-12 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
      {button && (
        <Button
          className="mx-auto text-center exploreAllReviews w-80"
          variant={"outline"}
          size={"lg"}
          asChild={!!href}
          onClick={onClick}
        >
          {href ? <Link href={href}>{button}</Link> : button}
        </Button>
      )}
    </section>
  );
};

export default GridSection;
