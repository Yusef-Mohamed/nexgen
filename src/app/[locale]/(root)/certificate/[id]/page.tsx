import { createServerAxiosInstance } from "@/app/lib/serverUtils";
export default async function CertificatePage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const { id } = params;
  const axiosInstance = await createServerAxiosInstance();
  const res = await axiosInstance.get(`/courses/getCertificate/${id}`);
  const certificate = res.data.data;
  console.log(certificate);
  return <div>CertificatePage</div>;
}
