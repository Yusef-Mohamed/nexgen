// import { useAnalyticsStore } from "@/stores/AnalyticsStore";
// import { getCookie } from "cookies-next";
// import { useEffect, useMemo, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import { eachDayOfInterval, format, addDays, endOfWeek } from "date-fns";
// import { useTranslations } from "next-intl";
// import { createClientAxiosInstance } from "@/app/lib/utils";

// interface Post {
//   updatedAt: string;
//   isPassed: boolean;
// }

// interface PostByDate {
//   passedCount: number;
//   notPassedCount: number;
// }

// interface Week {
//   start: Date;
//   end: Date;
// }

// const PracticeChart: React.FC = () => {
//   const token = getCookie("token") as string;
//   const { selectedUser, selectedCourse, selectedUserObject } =
//     useAnalyticsStore();
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [selectedWeek, setSelectedWeek] = useState<string>("");
//   const text = useTranslations("table");
//   useEffect(() => {
//     const getPosts = async () => {
//       try {
//         const axiosInstance = createClientAxiosInstance();
//         const res = await axiosInstance.get(
//           `/analytics/user-analytic/${selectedUser}?limit=500`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         const postsWithMarketerComment = res.data.data.filter(
//           (item: { marketerComment?: string }) => {
//             return item.marketerComment;
//           }
//         );
//         const formattedPosts: Post[] = res.data.data.map((item: Post) => {
//           return {
//             updatedAt: item.updatedAt,
//             isPassed: item.isPassed,
//           };
//         });
//         setPosts(formattedPosts);
//       } catch (err) {
//         console.error("Error fetching posts:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (selectedCourse && selectedUser) getPosts();
//   }, [selectedCourse, selectedUser]);
//   const postsByDate = useMemo(() => {
//     return posts.reduce<{ [key: string]: PostByDate }>((acc, post) => {
//       const dateKey = format(new Date(post.updatedAt), "yyyy-MM-dd");
//       if (!acc[dateKey]) {
//         acc[dateKey] = { passedCount: 0, notPassedCount: 0 };
//       }
//       if (post.isPassed) {
//         acc[dateKey].passedCount += 1;
//       } else {
//         acc[dateKey].notPassedCount += 1;
//       }
//       return acc;
//     }, {});
//   }, [posts]);
//   const filterWeaks = useMemo<Week[]>(() => {
//     if (!selectedUserObject) return [];
//     const currentDate = new Date();
//     const startDate = selectedUserObject?.createdAt
//       ? new Date(selectedUserObject.createdAt)
//       : currentDate;
//     const weeks: Week[] = [];

//     let weekStartDate = startDate;
//     while (weekStartDate <= currentDate) {
//       const weekEndDate = endOfWeek(weekStartDate);
//       weeks.push({ start: weekStartDate, end: weekEndDate });
//       weekStartDate = addDays(weekEndDate, 1);
//     }

//     return weeks.reverse();
//   }, [selectedUserObject?.createdAt]);

//   const weekLabels = useMemo<string[]>(() => {
//     return filterWeaks.map((week) => {
//       return `${format(week.start, "MM/dd")} - ${format(week.end, "MM/dd")}`;
//     });
//   }, [filterWeaks]);

//   useEffect(() => {
//     if (weekLabels.length && !selectedWeek) {
//       setSelectedWeek(weekLabels[0]);
//     }
//   }, [weekLabels]);

//   const filteredPosts = useMemo<number[][]>(() => {
//     if (!selectedWeek) return [];
//     const week = filterWeaks.find(
//       (week) =>
//         `${format(week.start, "MM/dd")} - ${format(week.end, "MM/dd")}` ===
//         selectedWeek
//     );
//     if (!week) return [];
//     return eachDayOfInterval({ start: week.start, end: week.end }).map(
//       (day) => {
//         const dateKey = format(day, "yyyy-MM-dd");
//         const postByDate = postsByDate[dateKey] || {
//           passedCount: 0,
//           notPassedCount: 0,
//         };
//         return [postByDate.passedCount, postByDate.notPassedCount];
//       }
//     );
//   }, [selectedWeek, filterWeaks, postsByDate]);
//   return (
//     <div className="p-4 bg-background rounded-xl">
//       {isLoading ? (
//         <div className="w-full aspect-video bg-muted animate-pulse" />
//       ) : (
//         <>
//           <select
//             value={selectedWeek}
//             onChange={(e) => setSelectedWeek(e.target.value)}
//             className="p-2 mb-4 border rounded"
//           >
//             <option value="" disabled>
//               {text("selectWeek")}
//             </option>
//             {weekLabels.map((label) => (
//               <option key={label} value={label}>
//                 {label}
//               </option>
//             ))}
//           </select>
//           <Bar
//             className="w-full"
//             options={{
//               plugins: {
//                 legend: {
//                   display: false,
//                 },
//               },
//             }}
//             data={{
//               labels: filteredPosts.map((_, index) => `Day ${index + 1}`),
//               datasets: [
//                 {
//                   label: text("passed"),
//                   data: filteredPosts.map((day) => day[0]),
//                   backgroundColor:
//                     localStorage.getItem("theme") === "dark"
//                       ? "#16a34a"
//                       : "#4ade80",
//                 },
//                 {
//                   label: text("notPassed"),
//                   data: filteredPosts.map((day) => day[1]),
//                   backgroundColor:
//                     localStorage.getItem("theme") === "dark"
//                       ? "#dc2626"
//                       : "#f87171",
//                 },
//               ],
//             }}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default PracticeChart;
const Test = () => {
  return <></>;
};

export default Test;
