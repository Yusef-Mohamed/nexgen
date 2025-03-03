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
import { useEffect, useState } from "react";
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
import { createClientAxiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import UserAvatar from "@/components/UserAvatar";
import ProgressCircle from "@/components/ProgressCircle";
import LeaderBoardCard from "@/components/LeaderBoardCard";
import CourseProgress from "./CourseProgress";
import ExamsChart from "./ExamsChart";
import VideoChart from "./VideoChart";
import { useSearchParams } from "next/navigation";
const Charts = () => {
  const inputs = useTranslations("Forms");
  const text = useTranslations("analytics");
  const { user: myAccount, token } = useAuth();
  const [myChildren, setMyChildren] = useState<IUser[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
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
  const getCourses = async () => {
    if (selectedUser) {
      try {
        const axiosInstance = createClientAxiosInstance();
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
    }
  };
  useEffect(() => {
    if (!myAccount) return;
    const accountId = selectedUserParam || myAccount._id;
    setSelectedUser(accountId);
    const axiosInstance = createClientAxiosInstance();
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
    getCourses();
  }, [selectedUser]);

  useEffect(() => {
    if (courses.length && selectedCourse === "") {
      if (selectedCourseParam) setSelectedCourse(selectedCourseParam);
      else setSelectedCourse(courses[0]._id);

      setSelectedCourseObject(courses[0]);
    }
  }, [courses, selectedCourseParam]);
  const getCourseDetails = async (courseId: string) => {
    try {
      const axiosInstance = createClientAxiosInstance();
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
  return (
    <>
      <main className="flex w-full min-h-screen px-2 py-6 lg:px-6 sm:px-4">
        <div className="grid w-full gap-8 xl:grid-cols-3">
          <div className="w-full space-y-8 max-lg:order-2 xl:col-span-2 ">
            <CourseProgress />
            <ExamsChart />
            <PracticeChart />
          </div>
          <div className="w-full space-y-8 lg:col-span-1 ">
            <div className="w-full p-4 mb-8 space-y-4 rounded-xl bg-clear-ground">
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
                      <SelectItem value={course._id} key={course._id}>
                        {course.title}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Select
                value={selectedUser}
                name="user"
                onValueChange={(value) => {
                  const user = myChildren.find((user) => user._id === value);
                  if (user) {
                    setSelectedUserObject(user);
                  }
                  setSelectedUser(value);
                }}
              >
                <SelectTrigger className="w-full border-2 border-transparent border-s-primary">
                  <SelectValue className="" placeholder={inputs("user")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    className="flex items-center gap-4 text-sm"
                    value={myAccount?._id || "me"}
                  >
                    <UserAvatar
                      className="max-sm:w-8 max-sm:h-8"
                      user={myAccount || undefined}
                    />
                    {inputs("me")}
                  </SelectItem>
                  {myChildren?.map((user) => {
                    return (
                      <SelectItem
                        className="flex items-center gap-4 text-sm"
                        value={user._id}
                        key={user._id}
                      >
                        <UserAvatar
                          className="max-sm:w-8 max-sm:h-8"
                          user={user}
                        />
                        {user.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
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
