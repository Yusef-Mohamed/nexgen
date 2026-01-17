import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const StayUpToDate = () => {
  const text = useTranslations("stayUpToDate");
  return (
    <section className="container grid gap-8 lg:grid-cols-2 secPadding">
      <div>
        <h2 className="mb-4 sm:mb-6">{text("heading")}</h2>
        <p className="text-text-2">{text("description")}</p>
      </div>
      <div className="lg:text-end">
        <div className="flex items-center gap-4 mb-4 lg:justify-end">
          <Input
            placeholder={text("enterYourEmail")}
            className="w-64"
            type="email"
          />
          <Button>{text("startNow")}</Button>
        </div>
        <p className="text-sm text-text-3">
          {text("byClickingStartNowYouAgree")}{" "}
          <Link href="/privacy-policy" className="underline">
            {text("privacyPolicy")}
          </Link>{" "}
          .
        </p>
      </div>
    </section>
  );
};

export default StayUpToDate;
