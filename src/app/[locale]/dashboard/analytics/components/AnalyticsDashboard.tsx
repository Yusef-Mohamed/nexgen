"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { BarChart3, BookOpenCheck, FolderTree, UsersRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "@/app/lib/utils";
import LeaderBoardCard from "@/components/LeaderBoardCard";
import { useAuth } from "@/components/auth-provider";
import { UserFilter } from "@/components/filters/UserFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnalyticsStudyTimeline } from "@/hooks/useAnalyticsStudyTimeline";
import { useAnalyticsLearningSummary } from "@/hooks/useMyCoursesQueries";
import { getDynamicString } from "@/lib/utils";
import { useAnalyticsStore } from "@/stores/AnalyticsStore";
import { ICourse, IUser } from "@/types";
import DashboardContainer from "../../components/DashboardContainer";
import CertificateCard from "./CertificateCard";
import CourseProgress from "./CourseProgress";
import ExamsChart from "./ExamsChart";
import PracticeChart from "./PracticeChart";
import StudyTimeline from "./StudyTimeline";

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

const selectorTriggerClassName =
  "h-12 w-full rounded-xl border-2 border-transparent border-s-primary bg-background-2 shadow-none focus:ring-2 focus:ring-primary/20";

const AnalyticsDashboard = () => {
  const inputs = useTranslations("Forms");
  const text = useTranslations("analytics");
  const dashboardText = useTranslations("dashboard");
  const { user: myAccount, token } = useAuth();
  const searchParams = useSearchParams();
  const selectedUserParam = searchParams.get("selectedUser");
  const selectedCourseParam = searchParams.get("selectedCourse");
  const [myChildren, setMyChildren] = useState<IUser[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [isUserFilterOpen, setIsUserFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const {
    selectedUser,
    setSelectedUser,
    selectedCourse,
    setSelectedCourse,
    setSelectedCourseObject,
    setSelectedUserObject,
    setCourseProgress,
    topUsers,
    setTopUsers,
  } = useAnalyticsStore();

  const { data: courses = [] } = useAnalyticsLearningSummary(
    token,
    selectedUser,
  );

  const activeOwnedCourses = useMemo(
    () => courses.filter((course) => course.status === "active"),
    [courses],
  );

  const availableCategories = useMemo(() => {
    const categoriesById = new Map<string, ICourse["category"]>();

    activeOwnedCourses.forEach((course) => {
      if (course.category?._id) {
        categoriesById.set(course.category._id, course.category);
      }
    });

    return Array.from(categoriesById.values()).sort((first, second) =>
      getDynamicString(first.title).localeCompare(
        getDynamicString(second.title),
      ),
    );
  }, [activeOwnedCourses]);

  const selectedCategoryId = useMemo(() => {
    if (availableCategories.length === 0) return "";
    const selectedCategoryIsAvailable = availableCategories.some(
      (category) => category._id === selectedCategory,
    );
    if (selectedCategoryIsAvailable) return selectedCategory;

    const paramCourse = activeOwnedCourses.find(
      (course) => course._id === selectedCourseParam,
    );
    return paramCourse?.category?._id || availableCategories[0]._id;
  }, [
    activeOwnedCourses,
    availableCategories,
    selectedCategory,
    selectedCourseParam,
  ]);
  const {
    data: timeline,
    isLoading: isTimelineLoading,
    isError: isTimelineError,
    refetch: refetchTimeline,
  } = useAnalyticsStudyTimeline(token, selectedUser, selectedCategoryId);

  const categoryCourses = useMemo(() => {
    const ownedCourses = activeOwnedCourses.filter(
      (course) => course.category?._id === selectedCategoryId,
    );
    const timelineIndexes = new Map(
      (timeline?.courses || []).map((course, index) => [course._id, index]),
    );

    return [...ownedCourses].sort((first, second) => {
      const firstIndex = timelineIndexes.get(first._id);
      const secondIndex = timelineIndexes.get(second._id);
      if (firstIndex !== undefined && secondIndex !== undefined) {
        return firstIndex - secondIndex;
      }
      if (firstIndex !== undefined) return -1;
      if (secondIndex !== undefined) return 1;

      const orderDifference = (first.order || 0) - (second.order || 0);
      if (orderDifference !== 0) return orderDifference;
      return getDynamicString(first.title).localeCompare(
        getDynamicString(second.title),
      );
    });
  }, [activeOwnedCourses, selectedCategoryId, timeline?.courses]);

  useEffect(() => {
    if (!myAccount) return;

    setSelectedUser(selectedUserParam || myAccount._id);
    axiosInstance
      .get(`/marketing/getMarketerChildren/${myAccount._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setMyChildren(response.data.teamMembers1 || []))
      .catch((error) =>
        console.error("Failed to load analytics students", error),
      );
  }, [myAccount, selectedUserParam, setSelectedUser, token]);

  useEffect(() => {
    if (!myAccount || !selectedUser) return;
    const selectedUserObject =
      selectedUser === myAccount._id
        ? myAccount
        : myChildren.find((user) => user._id === selectedUser);
    setSelectedUserObject(selectedUserObject || null);
  }, [myAccount, myChildren, selectedUser, setSelectedUserObject]);

  useEffect(() => {
    if (!selectedCategoryId || categoryCourses.length === 0) {
      if (selectedCourse) setSelectedCourse("");
      setSelectedCourseObject(null);
      setCourseProgress(null);
      setTopUsers([]);
      return;
    }

    const currentCourse = categoryCourses.find(
      (course) => course._id === selectedCourse,
    );
    const paramCourse = categoryCourses.find(
      (course) => course._id === selectedCourseParam,
    );
    const nextCourse = currentCourse || paramCourse || categoryCourses[0];

    if (selectedCourse !== nextCourse._id) {
      setSelectedCourse(nextCourse._id);
    }
    setSelectedCourseObject(nextCourse);
  }, [
    categoryCourses,
    selectedCategoryId,
    selectedCourse,
    selectedCourseParam,
    setCourseProgress,
    setSelectedCourse,
    setSelectedCourseObject,
    setTopUsers,
  ]);

  useEffect(() => {
    const controller = new AbortController();
    if (!selectedCourse) {
      setTopUsers([]);
      return () => controller.abort();
    }

    setTopUsers([]);
    axiosInstance
      .get(`/courses/courseDetails/${selectedCourse}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      .then((response) =>
        setTopUsers((response.data.data.users || []).slice(0, 3)),
      )
      .catch((error) => {
        if (error?.name !== "CanceledError") {
          console.error("Failed to load course leaders", error);
        }
      });

    return () => controller.abort();
  }, [selectedCourse, setTopUsers, token]);

  const children = useMemo(
    () => myChildren.filter((child) => child._id !== myAccount?._id),
    [myAccount, myChildren],
  );

  const filteredUsers = useMemo(() => {
    if (!userSearchTerm) return children;
    const normalizedSearch = userSearchTerm.toLowerCase();
    return children.filter((user) =>
      user.name?.toLowerCase().includes(normalizedSearch),
    );
  }, [children, userSearchTerm]);

  const selectCourse = (courseId: string) => {
    const course = categoryCourses.find((item) => item._id === courseId);
    if (!course) return;
    setSelectedCourse(courseId);
    setSelectedCourseObject(course);
    setCourseProgress(null);
    setTopUsers([]);
  };

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedCourse("");
    setSelectedCourseObject(null);
    setCourseProgress(null);
    setTopUsers([]);
  };

  const selectUser = (userId: string) => {
    const user =
      userId === myAccount?._id
        ? myAccount
        : myChildren.find((item) => item._id === userId);
    setSelectedUserObject(user || null);
    setSelectedUser(userId);
    setSelectedCategory("");
    setSelectedCourse("");
    setSelectedCourseObject(null);
    setCourseProgress(null);
    setTopUsers([]);
  };

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
            <div className="rounded-2xl border border-primary/10 bg-clear-ground p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BookOpenCheck className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-black text-text-1">
                    {text("selectCourse")}
                  </p>
                  <p className="text-xs text-text-3">
                    {text("selectCourseDescription")}
                  </p>
                </div>
              </div>
              <Select
                value={selectedCourse}
                name="course"
                disabled={categoryCourses.length === 0}
                onValueChange={selectCourse}
              >
                <SelectTrigger className={selectorTriggerClassName}>
                  <SelectValue placeholder={text("selectCourse")} />
                </SelectTrigger>
                <SelectContent>
                  {categoryCourses.map((course) => (
                    <SelectItem value={course._id} key={course._id}>
                      {getDynamicString(course.title)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CourseProgress />
            <ExamsChart />
            <PracticeChart />
          </div>

          <aside className="w-full space-y-5">
            <div className="w-full space-y-4 rounded-2xl border border-primary/10 bg-clear-ground p-4 shadow-sm">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.16em] text-text-3">
                  {inputs("user")}
                </label>
                <UserFilter
                  value={selectedUser}
                  onChange={selectUser}
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

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-text-3">
                  <FolderTree className="size-3.5" />
                  {text("category")}
                </label>
                <Select
                  value={selectedCategoryId}
                  disabled={availableCategories.length === 0}
                  onValueChange={selectCategory}
                >
                  <SelectTrigger className={selectorTriggerClassName}>
                    <SelectValue placeholder={text("selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem value={category._id} key={category._id}>
                        {getDynamicString(category.title)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <StudyTimeline
                courses={timeline?.courses || []}
                hasCategory={Boolean(selectedCategoryId)}
                isLoading={isTimelineLoading}
                isError={isTimelineError}
                selectedCourse={selectedCourse}
                onRetry={() => void refetchTimeline()}
                onSelectCourse={selectCourse}
              />
            </div>

            <LeaderBoardCard
              users={topUsers}
              isLoading={Boolean(selectedCourse) && topUsers.length === 0}
              title={text("outTopStudentsInThisCourse")}
            />
            <CertificateCard />
          </aside>
        </div>
      </DashboardContainer>
    </main>
  );
};

export default AnalyticsDashboard;
