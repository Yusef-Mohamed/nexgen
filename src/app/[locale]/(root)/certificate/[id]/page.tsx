import { createServerAxiosInstance } from "@/app/lib/serverUtils";
export default async function CertificatePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const axiosInstance = createServerAxiosInstance();
  const res = await axiosInstance.get(`/courses/getCertificate/${id}`);
  const certificate = res.data.data;
  console.log(certificate);
  return <div>CertificatePage</div>;
}
