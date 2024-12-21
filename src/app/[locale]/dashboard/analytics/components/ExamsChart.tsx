// import { useAnalyticsStore } from "@/stores/AnalyticsStore";
// import { getCookie } from "cookies-next";
// import { useEffect, useMemo, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   addDays,
//   eachDayOfInterval,
//   endOfMonth,
//   format,
//   startOfMonth,
// } from "date-fns";
// import { useTranslations } from "next-intl";
// import { ar, enUS } from "date-fns/locale";
// import { useParams } from "next/navigation";
// import { createClientAxiosInstance } from "@/app/lib/utils";
// const ExamsChart = () => {
//   const token = getCookie("token");
//   const {
//     selectedUser,
//     selectedCourse,
//     selectedCourseObject,
//     setCourseProgress,
//     selectedUserObject,
//   } = useAnalyticsStore();

//   const [exams, setExams] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedMonth, setSelectedMonth] = useState<string>("");
//   const text = useTranslations("table");
//   const { locale: language } = useParams();
//   useEffect(() => {
//     const getExams = async () => {
//       try {
//         const axiosInstance = createClientAxiosInstance();

//         const res = await axiosInstance.get(
//           `/exams/courseProgress/${selectedCourse}/${selectedUser}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setCourseProgress(res.data.data);
//         setExams(
//           res.data.data.progress.map(
//             (exam: { attemptDate: string }) => exam.attemptDate
//           )
//         );
//       } catch (err) {
//         console.log("err", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (selectedCourse && selectedUser) getExams();
//   }, [selectedCourse, selectedUser]);

//   const examsByDate = useMemo(() => {
//     return exams.reduce((acc: { [key: string]: string[] }, exam) => {
//       const dateKey = format(new Date(exam), "yyyy-MM-dd");
//       if (!acc[dateKey]) {
//         acc[dateKey] = [];
//       }
//       acc[dateKey].push(exam as string);
//       return acc;
//     }, {});
//   }, [exams]);

//   const months = useMemo(() => {
//     if (!selectedUserObject) return [];
//     const currentDate = new Date();
//     console.log(selectedUserObject);
//     const startDate = startOfMonth(new Date(selectedUserObject?.createdAt));
//     console.log("startDate", startDate);
//     console.log("currentDate", currentDate);
//     const monthsList = [];
//     let monthStartDate = startDate;

//     while (monthStartDate <= currentDate) {
//       const monthEndDate = endOfMonth(monthStartDate);
//       monthsList.push({ start: monthStartDate, end: monthEndDate });
//       monthStartDate = startOfMonth(addDays(monthEndDate, 1));
//     }

//     return monthsList.reverse();
//   }, [selectedUserObject]);
//   useEffect(() => {
//     if (months.length) {
//       setSelectedMonth(format(months[0].start, "MMMM yyyy"));
//     }
//   }, [months]);
//   const monthLabels = useMemo(() => {
//     const locale = language === "ar" ? ar : enUS; // Use Arabic locale if the state is 'ar'
//     return months.map((month) => {
//       return {
//         value: format(month.start, "MMMM yyyy"),
//         label: format(month.start, "MMMM yyyy", { locale }),
//       };
//     });
//   }, [months, language]);

//   useEffect(() => {
//     if (monthLabels.length && !selectedMonth) {
//       setSelectedMonth(monthLabels[0].value);
//     }
//   }, [monthLabels]);
//   const filteredExams = useMemo<number[]>(() => {
//     if (!selectedMonth) return [];
//     const month = months.find(
//       (m) => format(m.start, "MMMM yyyy") === selectedMonth
//     );
//     if (!month) return [];
//     return eachDayOfInterval({ start: month.start, end: month.end }).map(
//       (day) => {
//         const dateKey = format(day, "yyyy-MM-dd");
//         return examsByDate[dateKey]?.length || 0;
//       }
//     );
//   }, [selectedMonth, months, examsByDate]);
//   return (
//     <div className="p-4 bg-background rounded-xl">
//       {isLoading ? (
//         <div className="w-full aspect-video bg-muted animate-pulse" />
//       ) : (
//         <>
//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value)}
//             className="p-2 mb-4 border rounded"
//           >
//             <option value="" disabled>
//               {text("selectMonth")}
//             </option>
//             {monthLabels.map((label) => (
//               <option key={label.value} value={label.value}>
//                 {label.label}
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
//               labels: filteredExams.map((_, index) => `${index + 1}`),
//               datasets: [
//                 {
//                   label: text("examAttemptsCount"),
//                   data: filteredExams,
//                   backgroundColor:
//                     localStorage.getItem("theme") === "dark"
//                       ? selectedCourseObject?.colors.bgDarkMode
//                       : selectedCourseObject?.colors.bgColor,
//                   borderColor:
//                     localStorage.getItem("theme") === "dark"
//                       ? selectedCourseObject?.colors.bgDarkMode
//                       : selectedCourseObject?.colors.bgColor,
//                   borderWidth: 1,
//                 },
//               ],
//             }}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default ExamsChart;
const Test = () => {
  return <></>;
};

export default Test;
