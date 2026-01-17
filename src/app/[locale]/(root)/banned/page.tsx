import { use } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";


const BannedPage = (props: { params: Promise<{ locale: string }> }) => {
  const params = use(props.params);
  
  const text = useTranslations("common");
  return (
    <main>
      <div className="flex items-center justify-center min-h-screen ">
        <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold ">{text("banned.title")}</h2>
            <p className="mt-2 text-sm text-text-3">
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
