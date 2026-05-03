import { getMetadataServicePage } from "@/getMetaData";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import { IPackage } from "@/types";
import { getDynamicString } from "@/lib/utils";
import MobileAppHero from "../../components/MobileAppHero";
import PopularServices from "../../components/PopularServices";
import ServiceHeading from "./components/ServiceHeading";
import ServiceCard from "./components/ServiceCard";
import { getCouponCodeFromSearchParams } from "@/lib/coupons";
import SectionBlock from "@/components/SectionBlock";
import {
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineUserGroup,
} from "react-icons/hi2";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; serviceId: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: params.locale,
  });
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

const ServicePage = async (props: {
  params: Promise<{ locale: string; serviceId: string }>;
  searchParams: Promise<{ coupon?: string | string[]; code?: string | string[] }>;
}) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const couponCode = getCouponCodeFromSearchParams(searchParams);

  const text = await getTranslations("servicePage");
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: params.locale,
  });
  const serviceRes = await axiosInstance.get("/packages/" + params.serviceId);
  const serviceData = serviceRes.data.data as IPackage;
  return (
    <main>
      <section className="container pt-6 sm:pt-8">
        <div className="relative">
          <div
            aria-hidden
            className="absolute -top-10 -start-10 size-56 rounded-full bg-secondary/20 dark:bg-secondary/30 blur-[110px] opacity-70 pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute -top-10 end-0 size-56 rounded-full bg-gold/20 dark:bg-gold/30 blur-[110px] opacity-60 pointer-events-none"
          />
        </div>
      </section>

      <section className="container relative flex gap-12 xl:gap-20 secPadding">
        <div className="flex-1 w-full min-w-0">
          <ServiceHeading serviceData={serviceData} className="max-lg:hidden" />
          <ServiceCard
            serviceData={serviceData}
            couponCode={couponCode}
            className="lg:hidden relative overflow-hidden"
          />
          {serviceData.whoThisCourseFor &&
            serviceData.whoThisCourseFor.length > 0 && (
              <SectionBlock
                tone="secondary"
                eyebrow={text("whoThisServiceFor")}
                icon={<HiOutlineUserGroup className="size-5" />}
                title={text("whoThisServiceFor")}
              >
                <ul className="grid gap-3 md:grid-cols-2 md:gap-4">
                  {serviceData.whoThisCourseFor.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 rounded-xl bg-clear-ground/70 border border-secondary/15 p-3 sm:p-4 transition-colors hover:border-secondary/40"
                    >
                      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
                        <HiOutlineUserGroup className="size-4" />
                      </span>
                      <p className="flex-1 text-sm md:text-base text-text-2 leading-relaxed">
                        {getDynamicString(item)}
                      </p>
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            )}
          {serviceData.whatWillLearn &&
            serviceData.whatWillLearn.length > 0 && (
              <SectionBlock
                tone="primary"
                eyebrow={text("whatYouWillLearn")}
                icon={<HiOutlineCheckCircle className="size-5" />}
                title={text("whatYouWillLearn")}
              >
                <ul className="grid gap-3 md:grid-cols-2 md:gap-4">
                  {serviceData.whatWillLearn.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 rounded-xl bg-clear-ground/70 border border-primary/10 p-3 sm:p-4 transition-colors hover:border-primary/30"
                    >
                      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                        <HiOutlineCheckCircle className="size-4" />
                      </span>
                      <p className="flex-1 text-sm md:text-base text-text-2 leading-relaxed">
                        {getDynamicString(item)}
                      </p>
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            )}
          {serviceData.coursePrerequisites &&
            serviceData.coursePrerequisites.length > 0 && (
              <SectionBlock
                tone="gold"
                eyebrow={text("servicePrerequisites")}
                icon={<HiOutlineClipboardDocumentList className="size-5" />}
                title={text("servicePrerequisites")}
              >
                <ul className="grid gap-3 md:grid-cols-2 md:gap-4">
                  {serviceData.coursePrerequisites.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 rounded-xl bg-clear-ground/70 border border-gold/20 p-3 sm:p-4 transition-colors hover:border-gold/45"
                    >
                      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-gold">
                        <HiOutlineClipboardDocumentList className="size-4" />
                      </span>
                      <p className="flex-1 text-sm md:text-base text-text-2 leading-relaxed">
                        {getDynamicString(item)}
                      </p>
                    </li>
                  ))}
                </ul>
              </SectionBlock>
            )}
        </div>
        <div className="max-w-[29rem] hidden relative h-fit lg:block basis-[40%] lg:sticky lg:top-24">
          <div
            aria-hidden
            className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/15 via-secondary/10 to-gold/10 blur-2xl -z-10"
          />
          <div className="relative overflow-hidden rounded-3xl bg-clear-ground border border-primary/10 cardShadow p-5 sm:p-6">
            <ServiceCard serviceData={serviceData} couponCode={couponCode} />
          </div>
        </div>
      </section>
      <MobileAppHero />
      <PopularServices />
    </main>
  );
};

export default ServicePage;
