import { useTranslations } from "next-intl";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import SectionHeader from "@/components/SectionHeader";
import { cn } from "@/lib/utils";

const ContactCols = () => {
  const text = useTranslations("contact");
  const cards = [
    {
      title: text("email"),
      description: text("emailDescription"),
      action: text("supportEmail"),
      href: "mailto:nexgensupprot@gmail.com",
      icon: <MdOutlineMail />,
      tone: "primary",
    },
    {
      title: text("telegram"),
      description: text("telegramDescription"),
      action: text("supportTelegram"),
      href: "https://t.me/nexgensupport",
      icon: <FaTelegramPlane />,
      tone: "secondary",
    },
    {
      title: text("whatsapp"),
      description: text("whatsappDescription"),
      action: text("supportWhatsapp"),
      href: "https://wa.me/+972593442082",
      icon: <FaWhatsapp />,
      tone: "primary",
    },
  ];

  return (
    <section className="container secPadding">
      <div className="mb-8">
        <SectionHeader
          eyebrow={text("contactFormTitle")}
          heading={text("contactFormTitle")}
          description={text("contactFormDescription")}
          align="center"
          tone="secondary"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const isPrimary = card.tone === "primary";
          return (
            <a
              key={card.title}
              href={card.href}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-text-1/5",
                isPrimary
                  ? "bg-primary-faded border-primary/15 hover:border-primary/35"
                  : "bg-secondary/10 border-secondary/20 hover:border-secondary/45",
              )}
            >
              <div
                aria-hidden
                className={cn(
                  "absolute top-0 start-6 end-6 h-1 rounded-b-full opacity-70 group-hover:opacity-100 transition-opacity",
                  isPrimary ? "bg-primary" : "bg-secondary",
                )}
              />
              <div
                className={cn(
                  "mb-5 inline-flex size-14 items-center justify-center rounded-2xl text-2xl ring-4 transition-transform duration-300 group-hover:scale-105",
                  isPrimary
                    ? "bg-primary/10 text-primary ring-primary/20"
                    : "bg-secondary/10 text-secondary ring-secondary/25",
                )}
              >
                {card.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-text-1">
                {card.title}
              </h3>
              <p className="mt-3 min-h-12 text-sm sm:text-base leading-relaxed text-text-3">
                {card.description}
              </p>
              <span
                className={cn(
                  "mt-5 inline-flex items-center text-sm font-semibold underline underline-offset-4",
                  isPrimary ? "text-primary" : "text-secondary",
                )}
              >
                {card.action}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default ContactCols;
