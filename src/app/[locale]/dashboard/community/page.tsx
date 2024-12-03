import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import DisplayCommunityPosts from "./components/DisplayCommunityAnalytics";
import { Metadata } from "next";
import { getMetadataCommunityPage } from "@/getMetaData";
import {
  createServerAxiosInstance,
  getServerCookie,
} from "@/app/lib/serverUtils";
import { ILive } from "@/types";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataCommunityPage({ params });
}
const getLives = async () => {
  try {
    const axiosInstance = createServerAxiosInstance();
    const token = getServerCookie("token");
    const response = await axiosInstance(`/lives?limit=5`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data as ILive[];
  } catch (e) {
    console.log(e);
    return [];
  }
};
const CommunityPage = async ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  unstable_setRequestLocale(locale);
  const lives = (await getLives()) as ILive[];
  const text = await getTranslations("dashboard");
  return (
    <main className="flex flex-col xl:flex-row">
      <DisplayCommunityPosts />
      <div
        style={{
          maxHeight: "calc(100vh - 76px)",
          top: "76px",
          height: "calc(100vh - 76px)",
        }}
        className="w-full max-w-2xl p-4 py-4 overflow-auto lg:sticky max-xl:mx-auto xl:w-80 bg-clear-ground sm:py-8"
      >
        <h2 className="mb-3 sm:mb-6">{text("upComingLives")}</h2>
        <ul className="space-y-2 sm:space-y-4">
          {lives.map((live) => (
            <li
              key={live._id}
              className="flex items-center justify-between p-4 border rounded-md border-primary-faded max-sm:p-3"
            >
              <div className="flex items-center gap-2 text-sm max-sm:text-xs max-sm:gap-1">
                <div className="flex items-center justify-center w-5 rounded-full bg-destructive sm:w-6 aspect-square">
                  <div className="flex items-center justify-center w-[80%] rounded-full bg-clear-ground aspect-square">
                    {" "}
                    <div className="flex items-center justify-center w-[50%] rounded-full bg-destructive aspect-square"></div>
                  </div>
                </div>
                <p>{live.title}</p>
              </div>
              <span className="text-[0.6rem] sm:text-[0.715rem]">
                {new Date(live.date).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default CommunityPage;
