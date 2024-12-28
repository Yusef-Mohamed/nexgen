import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

const BannedPage = ({ params }: { params: { locale: string } }) => {
  unstable_setRequestLocale(params.locale);
  const text = useTranslations("common");
  return (
    <main>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {text("banned.title")}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {text("banned.description")}
            </p>
          </div>
          <div className="mt-8">
            <Button className="w-full" asChild>
              <Link href={"/contact"}>{text("banned.contact_support")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BannedPage;
