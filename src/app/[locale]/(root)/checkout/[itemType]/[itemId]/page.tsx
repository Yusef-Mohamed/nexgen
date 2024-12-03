import { unstable_setRequestLocale } from "next-intl/server";
import MainComponent from "./component/MainComponent";
import { ICourse, ICoursePackage, IPackage } from "@/types";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
// export function generateMetadata({
//   params,
// }: {
//   params: { locale: string };
// }): Metadata {
//   return getMetadataCheckoutPage({
//     params,
//   });
// }
const getThisItem = async (
  itemType: "course" | "learning-path" | "service",
  itemId: string
) => {
  try {
    const axiosInstance = await createServerAxiosInstance();
    if (itemType === "course") {
      const res = await axiosInstance.get(`/courses/${itemId}`);
      return res.data.data;
    } else if (itemType === "learning-path") {
      const res = await axiosInstance.get(`/coursePackages/${itemId}`);
      return res.data.data;
    } else if (itemType === "service") {
      const res = await axiosInstance.get(`/packages/${itemId}`);
      return res.data.data;
    } else return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};
export type ItemType = "course" | "learning-path" | "service";
const CheckoutPage = async ({
  params,
}: {
  params: {
    locale: string;
    itemType: ItemType;
    itemId: string;
  };
}) => {
  unstable_setRequestLocale(params.locale);
  const thisItem = (await getThisItem(params.itemType, params.itemId)) as
    | ICourse
    | ICoursePackage
    | IPackage
    | null;
  return (
    <main>
      <MainComponent thisItem={thisItem} itemType={params.itemType} />
    </main>
  );
};

export default CheckoutPage;
