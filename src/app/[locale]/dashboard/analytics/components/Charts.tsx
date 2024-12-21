// "use client";
// import ProgressCircle from "@/components/ProgressCircle";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   ArcElement,
//   BarElement,
// } from "chart.js";
// import { getCookie } from "cookies-next";
// import { useTranslations } from "next-intl";
// import { useEffect, useState } from "react";
// ChartJS.register(
//   CategoryScale,
//   BarElement,
//   ArcElement,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// import CourseProgress from "./CourseProgress";
// import MyOrders from "./MyOrders";
// import { ICourse, IUser } from "@/types";
// import { useAnalyticsStore } from "@/stores/AnalyticsStore";
// import ExamsChart from "./ExamsChart";
// import PracticeChart from "./PracticeChart";
// import { createClientAxiosInstance } from "@/app/lib/utils";
// const Charts = () => {
//   const token = getCookie("token");
//   const inputs = useTranslations("Forms");

//   const [myChildren, setMyChildren] = useState<IUser[]>([]);
//   const [courses, setCourses] = useState<ICourse[]>([]);
//   const myAccount = JSON.parse(getCookie("user") || "{}") as IUser;
//   const {
//     selectedUser,
//     setSelectedUser,
//     selectedCourse,
//     setSelectedCourse,
//     setSelectedCourseObject,
//     setSelectedUserObject,
//   } = useAnalyticsStore();
//   useEffect(() => {
//     setSelectedUserObject(myAccount);
//   }, []);
//   const getCourses = async () => {
//     if (selectedUser) {
//       try {
//         const axiosInstance = createClientAxiosInstance();
//         const res = await axiosInstance.get(
//           `/courses/myCourses/${selectedUser}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setCourses(res.data.data);
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   };
//   useEffect(() => {
//     setSelectedUser(myAccount._id);
//     const axiosInstance = createClientAxiosInstance();
//     axiosInstance
//       .get(`/marketing/getMarketerChildren/${myAccount._id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         console.log(res.data.data);
//         setMyChildren(res.data.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);
//   useEffect(() => {
//     getCourses();
//   }, [selectedUser]);

//   useEffect(() => {
//     if (courses.length && selectedCourse === "") {
//       setSelectedCourse(courses[0]._id);
//       setSelectedCourseObject(courses[0]);
//     }
//   }, [courses]);

//   return (
//     <>
//       <main>
//         <div className="w-full p-4 mb-8 space-y-4 rounded-xl bg-background">
//           {myChildren.length > 0 && (
//             <div className="flex items-center gap-4">
//               <Label htmlFor={"user"}>{inputs("user")} :</Label>
//               <Select
//                 value={selectedUser}
//                 name="user"
//                 onValueChange={(value) => {
//                   const user = myChildren.find((user) => user._id === value);
//                   if (user) {
//                     setSelectedUserObject(user);
//                   }
//                   setSelectedUser(value);
//                 }}
//               >
//                 <SelectTrigger className="flex-1 w-full">
//                   <SelectValue placeholder={inputs("user")} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={myAccount._id}>{inputs("me")}</SelectItem>
//                   {myChildren.map((user) => {
//                     return (
//                       <SelectItem value={user._id} key={user._id}>
//                         {user.name} - {user.email}
//                       </SelectItem>
//                     );
//                   })}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}
//           <div className="flex items-center gap-4">
//             <Label htmlFor={"course"}>{inputs("course")} :</Label>
//             <Select
//               value={selectedCourse}
//               name="course"
//               onValueChange={(value) => {
//                 setSelectedCourse(value);
//                 const course = courses.find((course) => course._id === value);
//                 if (course) {
//                   setSelectedCourseObject(course);
//                 }
//               }}
//             >
//               <SelectTrigger className="flex-1 w-full">
//                 <SelectValue placeholder={inputs("course")} />
//               </SelectTrigger>
//               <SelectContent>
//                 {courses.map((course) => {
//                   return (
//                     <SelectItem value={course._id} key={course._id}>
//                       {course.title}
//                     </SelectItem>
//                   );
//                 })}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//         <div className="grid gap-8 lg:grid-cols-3">
//           <div className="space-y-8 lg:col-span-2 ">
//             {/*not dynamic*/}
//             <CourseProgress />
//             <ExamsChart />
//             <MyOrders />
//           </div>
//           <div className="space-y-8 lg:col-span-1 ">
//             {/*not dynamic*/}
//             <ProgressCircle />
//             <PracticeChart />
//           </div>
//         </div>
//       </main>
//     </>
//   );
// };

// export default Charts;
const Test = () => {
  return <></>;
};

export default Test;
