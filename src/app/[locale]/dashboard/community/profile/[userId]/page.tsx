import { unstable_setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { getMetadataCommunityPage } from "@/getMetaData";
import {
  createServerAxiosInstance,
  getServerCookie,
} from "@/app/lib/serverUtils";
import { IUser } from "@/types";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { Link } from "@/i18n/routing";
import UserAvatar from "@/components/UserAvatar";
import FollowBtn from "./components/FollowBtn";
import DisplayPosts from "../../../components/DisplayPosts";
import Image from "next/image";
import CommunitySidebar from "../../../components/CommunitySidebar";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataCommunityPage({ params });
}
const getThisUser = async (userId: string) => {
  try {
    const axiosInstance = createServerAxiosInstance();
    const token = getServerCookie("token");
    const response = await axiosInstance(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (e) {
    console.log(e);
    return {};
  }
};
const CommunityPage = async ({
  params: { locale, userId },
}: {
  params: { locale: string; userId: string };
}) => {
  unstable_setRequestLocale(locale);
  const thisUser = (await getThisUser(userId)) as IUser;
  return (
    <main className="flex flex-col xl:flex-row">
      <section className="flex-1 w-full max-w-2xl px-4 py-6 mx-auto space-y-3 sm:px-4 sm:py-12 sm:space-y-6">
        <div className="overflow-hidden rounded-md bg-clear-ground cardShadow">
          <Link
            href={"/dashboard/community?sharedTo=students"}
            className="flex items-center w-full gap-2 p-6 px-6 bg-clear-ground"
          >
            {locale === "ar" ? <FaArrowRightLong /> : <FaArrowLeftLong />}
            {thisUser.name}
          </Link>
          <div className="w-full aspect-video bg-muted ">
            {thisUser.coverImg && (
              <Image
                src={thisUser.coverImg}
                width={1920}
                height={1080}
                alt="cover image"
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div className="flex items-end justify-between px-4 -mt-20 md:-mt-40 sm:-mt-20">
            <div className="border-[10px] rounded-full border-clear-ground w-fit">
              <UserAvatar
                user={thisUser}
                size="lg"
                className="w-32 h-32 sm:h-40 sm:w-40 md:w-52 md:h-52"
              />
            </div>
            <FollowBtn userId={userId} />
          </div>
          <div className="p-6 pt-0">
            <h2 className="mt-6 font-semibold">{thisUser.name}</h2>
            <p className="mt-2 text-text-3 md:text-lg">{thisUser.bio || ""}</p>
          </div>
        </div>
        <DisplayPosts userId={userId} />
      </section>
      <CommunitySidebar />
    </main>
  );
};

export default CommunityPage;
