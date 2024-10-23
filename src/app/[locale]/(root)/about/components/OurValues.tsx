import { useTranslations } from "next-intl";
import Image from "next/image";

const OurValues = () => {
  const text = useTranslations("aboutOurValuesPage");
  return (
    <section className="container secPadding">
      <div className="max-w-3xl mb-12 sm:mb-20">
        <h2 className="mb-2 sm:mb-4 h4">{text("ourValues")}</h2>
        <h3 className="h2">{text("heading")}</h3>
        <p
          className="mt-3 sm:mt-6 h5 text-text-2"
          style={{
            fontWeight: 400,
          }}
        >
          {text("description")}
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 sm:gap-12 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col ">
            <Image
              width={100}
              height={100}
              src={"/images/values_" + (index + 1) + ".png"}
              alt={text(`case_${index + 1}_title`)}
              className="rounded-md bg-muted"
            />
            <h3 className="mt-4 mb-3 sm:mt-8 sm:mb-6">
              {text(`case_${index + 1}_title`)}
            </h3>
            <p className="text-text-2">
              {text(`case_${index + 1}_description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurValues;
