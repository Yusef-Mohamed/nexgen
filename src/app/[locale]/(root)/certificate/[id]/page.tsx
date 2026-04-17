import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import CertificateView from "./components/CertificateView";
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;

  try {
    const axiosInstance = await createServerAxiosInstance({
      overRideLocale: params.locale,
    });
    const res = await axiosInstance.get(`/courses/getCertificate/${id}`);
    const certificate = res.data;

    return {
      title: `Certificate: ${certificate.user.name} - ${certificate.courseDetails.title}`,
      description: `View the certificate awarded to ${certificate.user.name} for completing "${certificate.courseDetails.title}" at NexGen Academy.`,
      openGraph: {
        images: [{ url: certificate.certificate.file }],
      },
    };
  } catch (error) {
    return {
      title: "Certificate Not Found - NexGen Academy",
    };
  }
}

export default async function CertificatePage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const { id } = params;
  const axiosInstance = await createServerAxiosInstance({
    overRideLocale: params.locale,
  });
  const res = await axiosInstance.get(`/courses/getCertificate/${id}`);
  const certificate = res.data;

  return <CertificateView data={certificate} />;
}
