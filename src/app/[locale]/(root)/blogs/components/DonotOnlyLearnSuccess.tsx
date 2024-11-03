import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

const DonotOnlyLearnSuccess = () => {
  const text = useTranslations("blogs");
  return (
    <section className="container grid lg:grid-cols-2 gap-8 secPadding">
      <div className="max-lg:order-2">
        <h2 className="mb-4 sm:mb-6 h1-5">{text("donotOnlyLearnSuccess")}</h2>
        <p className="text-text-2">{text("donotOnlyLearnSuccessP")}</p>
        <Button
          size={"lg"}
          asChild
          className="sm:w-[20rem]
        mt-6 sm:mt-8 
        w-full"
        >
          <Link href={"/sign-up"}>{text("startNow")}</Link>
        </Button>
      </div>
      <div>
        <Image
          src="/images/donot_only_learn_success.jpeg"
          alt="Learn Success"
          className="w-full  aspect-[34/30] object-cover lg:aspect-[65/40] rounded-lg"
          width={650}
          height={400}
        />
      </div>
    </section>
  );
};

export default DonotOnlyLearnSuccess;
