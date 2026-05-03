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
import ItemPageLayout from "@/components/ItemPageLayout";
import ItemDetailList from "@/components/ItemDetailList";
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
      <ItemPageLayout
        aside={<ServiceCard serviceData={serviceData} couponCode={couponCode} />}
      >
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
                <ItemDetailList
                  items={serviceData.whoThisCourseFor}
                  tone="secondary"
                  icon={<HiOutlineUserGroup className="size-4" />}
                />
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
                <ItemDetailList
                  items={serviceData.whatWillLearn}
                  tone="primary"
                  icon={<HiOutlineCheckCircle className="size-4" />}
                />
              </SectionBlock>
            )}
          {serviceData.coursePrerequisites &&
            serviceData.coursePrerequisites.length > 0 && (
              <SectionBlock
                tone="secondary"
                eyebrow={text("servicePrerequisites")}
                icon={<HiOutlineClipboardDocumentList className="size-5" />}
                title={text("servicePrerequisites")}
              >
                <ItemDetailList
                  items={serviceData.coursePrerequisites}
                  tone="secondary"
                  icon={<HiOutlineClipboardDocumentList className="size-4" />}
                />
              </SectionBlock>
            )}
      </ItemPageLayout>
      <MobileAppHero />
      <PopularServices />
    </main>
  );
};

export default ServicePage;
