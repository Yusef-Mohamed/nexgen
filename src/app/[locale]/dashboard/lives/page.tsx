import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import LivesCalender from "./components/LivesCalender";
import { cookies } from "next/headers";
import { ILive } from "@/types";
import { getMetadataLivesPage } from "@/getMetaData";
import { Metadata } from "next";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import LiveCard from "@/components/cards/LiveCard";
import LiveFilters from "./components/LiveFilters";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataLivesPage({ params });
}
const getLives = async ({ date, course }: { date: string; course: string }) => {
  try {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token")?.value;
    const searchParams = new URLSearchParams();
    if (date) searchParams.append("day", date);
    if (course !== "all" && course) searchParams.append("package", course);
    const search = searchParams.toString();
    const axiosInstance = createServerAxiosInstance();
    const response = await axiosInstance(
      `/lives${search ? "?" + search : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data as ILive[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
const Lives = async ({
  params: { locale },
  searchParams: { date, course },
}: {
  params: { locale: string };
  searchParams: { date: string; course: string };
}) => {
  unstable_setRequestLocale(locale);

  const lives = (await getLives({ date: date, course: course })) as ILive[];
  const text = await getTranslations("lives");
  const livesNow = lives.filter((e) => e.link);
  const livesUpcoming = lives.filter((e) => !e.link);
  return (
    <main className="flex flex-col-reverse w-full gap-8 p-8 lg:flex-row lg:gap-10 lg:p-10">
      <div className="flex-1 w-full">
        <div className="px-6 py-4 mb-4 bg-clear-ground rounded-xl h-fit">
          <h2 className="mb-4 font-medium md:mb-6">{text("livesNow")}</h2>
          {livesNow.length !== 0 ? (
            <div className="grid gap-4 lg:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
              {livesNow.map((live) => (
                <LiveCard key={live._id} live={live} />
              ))}
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-center text-text-3">
                {text("noLivesNow")}
              </p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 mb-4 bg-clear-ground rounded-xl h-fit">
          <h2 className="mb-4 font-medium md:mb-6">{text("upcomingLives")}</h2>
          {livesUpcoming.length !== 0 ? (
            <div className="grid gap-4 lg:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
              {livesUpcoming.map((live) => (
                <LiveCard key={live._id} live={live} />
              ))}
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-center text-text-3">
                {text("noUpcomingLives")}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="xl:w-[25rem] lg:w-[20rem]">
        <LiveFilters />
        <LivesCalender />
      </div>
    </main>
  );
};

export default Lives;
