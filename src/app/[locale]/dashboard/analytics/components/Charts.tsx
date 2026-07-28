"use client";
// import ProgressCircle from "@/components/ProgressCircle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement,
} from "chart.js";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
ChartJS.register(
  CategoryScale,
  BarElement,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);
import { IUser } from "@/types";
import { useAnalyticsStore } from "@/stores/AnalyticsStore";
import PracticeChart from "./PracticeChart";
import { useAuth } from "@/components/auth-provider";
import ProgressCircle from "@/components/ProgressCircle";
import LeaderBoardCard from "@/components/LeaderBoardCard";
import CourseProgress from "./CourseProgress";
import ExamsChart from "./ExamsChart";
import CertificateCard from "./CertificateCard";
import { useSearchParams } from "next/navigation";
import { axiosInstance } from "@/app/lib/utils";
import { UserFilter } from "@/components/filters/UserFilter";
import { getDynamicString } from "@/lib/utils";
import { useAnalyticsLearningSummary } from "@/hooks/useMyCoursesQueries";
import DashboardContainer from "../../components/DashboardContainer";
import { BarChart3, BookOpenCheck, UsersRound } from "lucide-react";
const Charts = () => {
  const inputs = useTranslations("Forms");
  const text = useTranslations("analytics");
  const dashboardText = useTranslations("dashboard");
  const { user: myAccount, token } = useAuth();
  const [myChildren, setMyChildren] = useState<IUser[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [isUserFilterOpen, setIsUserFilterOpen] = useState(false);
  const {
    selectedUser,
    setSelectedUser,
    selectedCourse,
    setSelectedCourse,
    setSelectedCourseObject,
    setSelectedUserObject,
    topUsers,
    setTopUsers,
  } = useAnalyticsStore();
  const searchParams = useSearchParams();
  const selectedUserParam = searchParams.get("selectedUser");
  const selectedCourseParam = searchParams.get("selectedCourse");
  const { data: courses = [] } = useAnalyticsLearningSummary(
    token,
    selectedUser,
  );
  useEffect(() => {
    if (myAccount) setSelectedUserObject(myAccount);
  }, [myAccount, setSelectedUserObject]);
  useEffect(() => {
    if (!myAccount) return;
    const accountId = selectedUserParam || myAccount._id;
    setSelectedUser(accountId);
    axiosInstance
      .get(`/marketing/getMarketerChildren/${myAccount._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMyChildren(res.data.teamMembers1);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [myAccount, selectedUserParam]);
  useEffect(() => {
    if (!courses.length) return;

    const courseFromParam = selectedCourseParam
      ? courses.find((course) => course._id === selectedCourseParam)
      : null;
    const currentCourse = courses.find(
      (course) => course._id === selectedCourse,
    );
    const nextCourse = courseFromParam || currentCourse || courses[0];

    if (selectedCourse !== nextCourse._id) {
      setSelectedCourse(nextCourse._id);
    }
    setSelectedCourseObject(nextCourse);
  }, [
    courses,
    selectedCourse,
    selectedCourseParam,
    setSelectedCourse,
    setSelectedCourseObject,
  ]);
  const getCourseDetails = async (courseId: string) => {
    try {
      const courseDetails = await axiosInstance.get(
        `/courses/courseDetails/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const users = courseDetails.data.data.users.slice(0, 3);
      setTopUsers(users);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (selectedCourse) {
      setTopUsers([]);
      getCourseDetails(selectedCourse as string);
    }
  }, [selectedCourse]);
  const children = useMemo(() => {
    return myChildren.filter((child) => child._id !== myAccount?._id);
  }, [myChildren, myAccount]);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!userSearchTerm) return children;
    return children.filter((user) =>
      user.name?.toLowerCase().includes(userSearchTerm?.toLowerCase()),
    );
  }, [children, userSearchTerm]);
  return (
    <main className="w-full !bg-transparent px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
      <DashboardContainer className="space-y-5">
        <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-5 shadow-sm sm:p-6">
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(hsl(var(--primary)/0.08)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary">
                <BarChart3 className="size-5" />
              </span>
              <div className="min-w-0">
                <h1 className="text-lg font-black text-text-1 sm:text-xl">
                  {dashboardText("analytics")}
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-text-3">
                  {text("overviewDescription")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-text-2 sm:flex">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/10 px-3 py-1.5 text-primary">
                <BookOpenCheck className="size-3.5" />
                {inputs("course")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1.5 text-secondary">
                <UsersRound className="size-3.5" />
                {inputs("user")}
              </span>
            </div>
          </div>
        </section>

        <div className="grid w-full gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="w-full space-y-5 max-xl:order-2">
            <CourseProgress />
            <ExamsChart />
            <PracticeChart />
          </div>
          <aside className="w-full space-y-5">
            <div className="w-full space-y-4 rounded-2xl border border-primary/10 bg-clear-ground p-4 shadow-sm">
              <ProgressCircle />
              <Select
                value={selectedCourse}
                name="course"
                onValueChange={(value) => {
                  setSelectedCourse(value);
                  const course = courses.find((course) => course._id === value);
                  if (course) {
                    setSelectedCourseObject(course);
                  }
                }}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-primary/10 bg-background-2 shadow-none">
                  <SelectValue placeholder={inputs("course")} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => {
                    return (
                      <SelectItem value={course._id} key={course._id}>
                        {getDynamicString(course.title)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <UserFilter
                value={selectedUser}
                onChange={(value) => {
                  const user = myChildren.find((user) => user._id === value);
                  if (user) {
                    setSelectedUserObject(user);
                  }
                  setSelectedUser(value);
                }}
                users={children}
                filteredUsers={filteredUsers}
                userSearchTerm={userSearchTerm}
                onSearchTermChange={setUserSearchTerm}
                isOpen={isUserFilterOpen}
                onOpenChange={setIsUserFilterOpen}
                label={inputs("user")}
                searchForUserLabel={
                  inputs("searchForUser") || "Search for user..."
                }
                myAccount={myAccount || undefined}
                meLabel={inputs("me")}
              />
            </div>
            <LeaderBoardCard
              users={topUsers}
              isLoading={topUsers.length === 0}
              title={text("outTopStudentsInThisCourse")}
            />
            <CertificateCard />
          </aside>
        </div>
      </DashboardContainer>
    </main>
  );
};

export default Charts;
