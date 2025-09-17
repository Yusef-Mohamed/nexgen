import { getMetadataServicePage } from "@/getMetaData";
import { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { IPackage } from "@/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CiDiscount1 } from "react-icons/ci";
import PromoBanner from "../../components/PromoBanner";
import PopularCourses from "../../components/PopularCourses";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; serviceId: string };
}): Promise<Metadata> {
  const axiosInstance = createServerAxiosInstance();
  const serviceRes = await axiosInstance.get("/packages/" + params.serviceId);
  const serviceData = serviceRes.data.data as IPackage;

  return getMetadataServicePage({
    params,
    service: serviceData,
  });
}

const ServicePage = async ({
  params,
}: {
  params: { locale: string; serviceId: string };
}) => {
  unstable_setRequestLocale(params.locale);
  try {
    const text = await getTranslations("services");
    const pageText = await getTranslations("servicePage");
    const axiosInstance = createServerAxiosInstance();
    const serviceRes = await axiosInstance.get("/packages/" + params.serviceId);
    const serviceData = serviceRes.data.data as IPackage;

    const isFree =
      serviceData.priceAfterDiscount === 0 || serviceData.price === 0;
    const priceToShow =
      serviceData.priceAfterDiscount !== undefined &&
      serviceData.priceAfterDiscount !== null
        ? serviceData.priceAfterDiscount
        : serviceData.price;

    return (
      <main>
        <section className="container flex gap-20 secPadding">
          <div className="flex-1 w-full">
            <h1>{serviceData.title}</h1>
            <p
              style={{
                fontWeight: 400,
              }}
              className="my-4 text-text-2 h3 md:my-8"
            >
              {serviceData.description}
            </p>

            <div className="my-4 md:my-8">
              <h3 className="mb-4 md:mb-8">{pageText("whatYouWillLearn")}</h3>
              <ul className="grid gap-4 md:grid-cols-2 md:gap-8">
                {serviceData.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-text-2 md:text-base"
                  >
                    <div className="w-1 h-1 mt-2 rounded-full bg-text-2"></div>
                    <p className="flex-1 ">{highlight}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="max-w-[29rem] hidden h-fit lg:block rounded-3xl basis-[40%] bg-clear-ground cardShadow p-6">
            <div>
              <Image
                src={serviceData.course?.image || "/images/hero.png"}
                width={1000}
                height={1000}
                className="aspect-[41/31] object-cover w-full rounded-2xl"
                alt={serviceData.title}
              />
              <div className="flex items-center justify-between my-4 md:my-8">
                <div className="flex items-end gap-1 font-medium whitespace-nowrap">
                  <div className="h2">
                    {isFree ? text("free") : `$${priceToShow}`}
                  </div>
                  {!isFree &&
                  serviceData.priceAfterDiscount !== undefined &&
                  serviceData.priceAfterDiscount !== serviceData.price ? (
                    <del className="h3 text-text-3">${serviceData.price}</del>
                  ) : null}
                </div>
                {!isFree &&
                serviceData.priceAfterDiscount !== undefined &&
                serviceData.priceAfterDiscount !== serviceData.price ? (
                  <div
                    style={{
                      fontWeight: 400,
                    }}
                    className="flex items-center gap-1 px-3 py-2 rounded-md h5 text-green bg-fadedGreen"
                  >
                    <CiDiscount1 className="w-6 h-6" />
                    <span>
                      {pageText("discounted")}{" "}
                      {(
                        ((serviceData.price -
                          (serviceData.priceAfterDiscount || 0)) /
                          serviceData.price) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="mt-6">
                <Button asChild className="w-full" size={"lg"}>
                  <Link
                    className="btn btn-primary block text-center"
                    href={`/checkout/service/${serviceData._id}`}
                  >
                    {isFree ? pageText("startLearning") : pageText("startNow")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <PromoBanner />
        <PopularCourses />
      </main>
    );
  } catch (e) {
    console.log(e);
    return notFound();
  }
};

export default ServicePage;
