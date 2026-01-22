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
  Filler
);
import { ICourse, IUser } from "@/types";
import { useAnalyticsStore } from "@/stores/AnalyticsStore";
import PracticeChart from "./PracticeChart";
import { useAuth } from "@/components/auth-provider";
import ProgressCircle from "@/components/ProgressCircle";
import LeaderBoardCard from "@/components/LeaderBoardCard";
import CourseProgress from "./CourseProgress";
import ExamsChart from "./ExamsChart";
import VideoChart from "./VideoChart";
import { useSearchParams } from "next/navigation";
import { axiosInstance } from "@/app/lib/utils";
import { UserFilter } from "@/components/filters/UserFilter";
import { getDynamicString } from "@/lib/utils";
const Charts = () => {
  const inputs = useTranslations("Forms");
  const text = useTranslations("analytics");
  const { user: myAccount, token } = useAuth();
  const [myChildren, setMyChildren] = useState<IUser[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
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
    if (!selectedUser) return;

    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get(
          `/courses/myCourses/${selectedUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCourses();
  }, [selectedUser, token]);

  useEffect(() => {
    if (courses.length && selectedCourse === "") {
      if (selectedCourseParam) setSelectedCourse(selectedCourseParam);
      else setSelectedCourse(courses[0]._id);

      setSelectedCourseObject(courses[0]);
    }
  }, [courses, selectedCourseParam]);
  const getCourseDetails = async (courseId: string) => {
    try {
      const courseDetails = await axiosInstance.get(
        `/courses/courseDetails/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      user.name?.toLowerCase().includes(userSearchTerm?.toLowerCase())
    );
  }, [children, userSearchTerm]);
  return (
    <>
      <main className="flex w-full px-2 py-6 bg-background lg:px-6 sm:px-4">
        <div className="grid w-full gap-8 xl:grid-cols-3 mx-auto">
          <div className="w-full space-y-8 max-lg:order-2 xl:col-span-2 ">
            <CourseProgress />
            <ExamsChart />
            <PracticeChart />
          </div>
          <div className="w-full space-y-8 lg:col-span-1 ">
            <div className="w-full p-4 mb-8 space-y-4 rounded-xl bg-background cardShadow">
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
                <SelectTrigger className="w-full border-2 border-transparent border-s-primary">
                  <SelectValue placeholder={inputs("course")} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => {
                    return (
                      <SelectItem
                        value={course._id}
                        key={course._id}
                      >
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
            <VideoChart />
          </div>
        </div>
      </main>
    </>
  );
};

export default Charts;
