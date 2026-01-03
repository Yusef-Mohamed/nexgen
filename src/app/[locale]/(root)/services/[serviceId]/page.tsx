import { getMetadataServicePage } from "@/getMetaData";
import { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { IPackage } from "@/types";
import { notFound } from "next/navigation";
import { getDynamicString } from "@/lib/utils";
import MobileAppHero from "../../components/MobileAppHero";
import PopularServices from "../../components/PopularServices";
import ServiceHeading from "./components/ServiceHeading";
import ServiceCard from "./components/ServiceCard";

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
    service: {
      title: getDynamicString(serviceData.title),
      description: getDynamicString(serviceData.description),
    },
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
    const axiosInstance = createServerAxiosInstance();
    const serviceRes = await axiosInstance.get("/packages/" + params.serviceId);
    const serviceData = serviceRes.data.data as IPackage;
    return (
      <main>
        <section className="container flex gap-20 secPadding">
          <div className="flex-1 w-full">
            <ServiceHeading
              serviceData={serviceData}
              className="max-lg:hidden"
            />
            <ServiceCard
              serviceData={serviceData}
              className="lg:hidden relative overflow-hidden"
            />
            {serviceData.whoThisCourseFor &&
              serviceData.whoThisCourseFor.length > 0 && (
                <div className="my-4 md:my-8">
                  <h3 className="mb-4 md:mb-8">{text("whoThisCourseFor")}</h3>
                  <ul className="grid gap-4 list-disc md:grid-cols-2 md:gap-8">
                    {serviceData.whoThisCourseFor.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-text-2 md:text-base"
                      >
                        <p className="flex-1">{getDynamicString(item)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {serviceData.whatWillLearn &&
              serviceData.whatWillLearn.length > 0 && (
                <div className="my-4 md:my-8">
                  <h3 className="mb-4 md:mb-8">{text("whatYouWillLearn")}</h3>
                  <ul className="grid gap-4 md:grid-cols-2 md:gap-8">
                    {serviceData.whatWillLearn.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-text-2 md:text-base"
                      >
                        <p className="flex-1"> {getDynamicString(item)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {serviceData.coursePrerequisites && (
              <div className="my-4 md:my-8">
                <h3 className="mb-4 md:mb-8">{text("coursePrerequisites")}</h3>
                <ul className="grid gap-4 md:grid-cols-2 md:gap-8">
                  {serviceData.coursePrerequisites.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-text-2 md:text-base"
                    >
                      <p className="flex-1"> {getDynamicString(item)}</p>
                    </li>
                  ))}{" "}
                </ul>
              </div>
            )}
          </div>
          <div className="max-w-[29rem] hidden relative overflow-hidden h-fit lg:block rounded-3xl basis-[40%] bg-clear-ground cardShadow p-6">
            <ServiceCard serviceData={serviceData} />
          </div>
        </section>
        <MobileAppHero />
        <PopularServices />
      </main>
    );
  } catch (e) {
    console.log(e);
    return notFound();
  }
};

export default ServicePage;
