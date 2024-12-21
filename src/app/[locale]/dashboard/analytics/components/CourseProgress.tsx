// import { FaStopwatch20 } from "react-icons/fa";
// import { GiProgression } from "react-icons/gi";
// import { PiExamFill } from "react-icons/pi";
// import ProgressUnit from "@/components/ProgressUnit";
// import { useTranslations } from "next-intl";
// import { ICourseProgress } from "@/types";
// import { useEffect, useState } from "react";
// import { getCookie } from "cookies-next";
// import { useAnalyticsStore } from "@/stores/AnalyticsStore";
// import { useParams } from "next/navigation";
// import { createClientAxiosInstance } from "@/app/lib/utils";

// const CourseProgress = () => {
//   const token = getCookie("token");
//   const [isFetching, setIsFetching] = useState(true);
//   const { locale } = useParams();
//   const [selectedCourseProgress, setSelectedCourseProgress] =
//     useState<ICourseProgress | null>(null);
//   const { selectedCourse, selectedUser, courseProgress } = useAnalyticsStore();
//   const getCourseScore = async (course: string) => {
//     setIsFetching(true);
//     try {
//       const axiosInstance = createClientAxiosInstance();
//       const courseScore = await axiosInstance.get(
//         `/exams/userScore/${course}/${selectedUser}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setSelectedCourseProgress(courseScore.data.data as ICourseProgress);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setIsFetching(false);
//     }
//   };
//   useEffect(() => {
//     if (selectedCourse && selectedUser) {
//       getCourseScore(selectedCourse);
//     }
//   }, [selectedCourse, selectedUser]);

//   return (
//     <div>
//       {courseProgress.certificate.istake && (
//         <div className="p-2 mb-2 text-center rounded-md bg-background">
//           <p>
//             {locale === "ar"
//               ? "لقد اجتزت الامتحان وتستحق الشهادة🎉"
//               : "congratulations you have passed the exam and deserve the certificate🎉"}
//           </p>

//           <a
//             href={courseProgress.certificate.file}
//             download
//             className="underline text-primary"
//           >
//             {locale === "ar"
//               ? "اضغط هنا لفتح الشهادة"
//               : "click here to open the certificate"}
//           </a>
//         </div>
//       )}
//       <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//         <CircleCell
//           title="gradesAverage"
//           icon={<PiExamFill />}
//           value={Number(selectedCourseProgress?.averageGradePercentage) || 0}
//           darkColor="#b45309"
//           lightColor="#f59e0b"
//           isFetching={isFetching}
//         />
//         <CircleCell
//           icon={<FaStopwatch20 />}
//           title="watchedPercentage"
//           darkColor="#1d4ed8"
//           lightColor="#3b82f6"
//           value={
//             Number(selectedCourseProgress?.completedLessonsPercentage) || 0
//           }
//           isFetching={isFetching}
//         />
//         <CircleCell
//           icon={<GiProgression />}
//           title="totalProgress"
//           darkColor="#15803d"
//           lightColor="#22c55e"
//           value={Number(selectedCourseProgress?.totalProgress) || 0}
//           isFetching={isFetching}
//         />
//       </div>
//     </div>
//   );
// };

// export default CourseProgress;
// const CircleCell = ({
//   title,
//   value,
//   darkColor,
//   lightColor,
//   isFetching,
//   icon,
// }: {
//   title: string;
//   value: number;
//   darkColor: string;
//   lightColor: string;
//   icon: JSX.Element;
//   isFetching: boolean;
// }) => {
//   const text = useTranslations("analytics");
//   return (
//     <div className="p-4 rounded-md bg-background">
//       <div
//         className="items-center justify-center hidden w-12 h-8 mb-1 text-xl rounded-md dark:flex"
//         style={{
//           color: darkColor,
//           backgroundColor: darkColor + "2a",
//         }}
//       >
//         {icon}
//       </div>
//       <div
//         className="flex items-center justify-center w-12 h-8 mb-1 text-xl rounded-md dark:hidden"
//         style={{
//           color: lightColor,
//           backgroundColor: lightColor + "2a",
//         }}
//       >
//         {icon}
//       </div>
//       <div className="flex items-center justify-between">
//         <div>
//           {!isFetching ? (
//             <h4 className="mb-1 font-semibold">{parseInt(value.toFixed(0))}</h4>
//           ) : (
//             <div className="w-20 h-3 mb-1 font-semibold rounded-md bg-muted animate-pulse" />
//           )}
//           <h3 className="text-xs text-muted-foreground">{text(title)}</h3>
//         </div>
//         <div className="w-fit">
//           {!isFetching ? (
//             <ProgressUnit
//               layers={[
//                 {
//                   progress: value,
//                   darkColor: darkColor,
//                   lightColor: lightColor,
//                 },
//               ]}
//               totalProgress={parseInt(value.toFixed(0))}
//               size="sm"
//             />
//           ) : (
//             <div className="font-semibold w-[90px] aspect-square rounded-full bg-muted animate-pulse" />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
const Test = () => {
  return <></>;
};

export default Test;
