"use client";
import ProgressCircle from "@/components/ProgressCircle";
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
import CircleChart from "./CircleChart";
const Charts = () => {
  const inputs = useTranslations("Forms");
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
  } = useAnalyticsStore();
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
    setSelectedUser(myAccount._id);
    const axiosInstance = createClientAxiosInstance();
    axiosInstance
      .get(`/marketing/getMarketerChildren/${myAccount._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setMyChildren(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [myAccount]);
  useEffect(() => {
    getCourses();
  }, [selectedUser]);

  useEffect(() => {
    if (courses.length && selectedCourse === "") {
      setSelectedCourse(courses[0]._id);
      setSelectedCourseObject(courses[0]);
    }
  }, [courses]);

  return (
    <>
      <main
        style={{
          maxHeight: "calc(100vh - 76px)",
          height: "calc(100vh - 76px)",
        }}
        className="flex flex-col h-screen px-2 py-6 lg:px-6 sm:px-4"
      >
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2 ">
            <div className="w-full p-4 mb-8 space-y-4 rounded-xl bg-background">
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
              </Select>{" "}
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
                    className="flex items-center gap-4"
                    value={myAccount?._id || ""}
                  >
                    <UserAvatar user={myAccount || undefined} />
                    {inputs("me")}
                  </SelectItem>
                  {myChildren.map((user) => {
                    return (
                      <SelectItem
                        className="flex items-center gap-4"
                        value={user._id}
                        key={user._id}
                      >
                        <UserAvatar user={user} />
                        {user.name} - {user.email}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <ProgressCircle />
            <PracticeChart />
          </div>
          <div className="space-y-8 lg:col-span-1 ">
            <CircleChart />
          </div>
        </div>
      </main>
    </>
  );
};

export default Charts;
