import { unstable_setRequestLocale } from "next-intl/server";
import LivesCalender from "./components/LivesCalender";
import { cookies } from "next/headers";
import { ILive } from "@/types";
import { getMetadataLivesPage } from "@/getMetaData";
import { Metadata } from "next";
import { createServerAxiosInstance } from "@/app/lib/serverUtils";
import LiveCard from "@/components/cards/LiveCard";
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadataLivesPage({ params });
}
const Lives = async ({
  params: { locale },
  searchParams: { date, course },
}: {
  params: { locale: string };
  searchParams: { date: string; course: string };
}) => {
  unstable_setRequestLocale(locale);
  const cookiesStore = cookies();
  const token = cookiesStore.get("token")?.value;
  const searchParams = new URLSearchParams();
  if (date) searchParams.append("day", date);
  if (course) searchParams.append("package", course);
  const search = searchParams.toString();
  const axiosInstance = createServerAxiosInstance();
  const response = await axiosInstance(`/lives${search ? "?" + search : ""}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const lives = response.data.data as ILive[];
  return (
    <main className="flex flex-col-reverse w-full gap-8 p-8 lg:flex-row lg:gap-10 lg:p-10">
      <div className="flex-1 w-full mt-4 lg:col-span-2 bg-clear-ground rounded-xl lg:mt-0">
        {/* <LiveFilters /> */}
        {lives.map((live) => (
          <LiveCard key={live._id} live={live} />
        ))}
      </div>{" "}
      <div className="lg:w-[25rem]">
        <LivesCalender />
      </div>
    </main>
  );
};

export default Lives;
