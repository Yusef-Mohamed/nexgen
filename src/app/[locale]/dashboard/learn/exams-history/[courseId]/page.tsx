import { getMetadataCoursePage } from "@/getMetaData";
import { Metadata } from "next";

import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import {
  createServerAxiosInstance,
  getServerCookie,
} from "@/app/lib/serverUtils";
import { ICourse, IUser } from "@/types";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CalendarIcon, ClipboardList } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
export async function generateMetadata({
  params,
}: {
  params: { locale: string; courseId: string };
}): Promise<Metadata> {
  const axiosInstance = createServerAxiosInstance();
  const courseRes = await axiosInstance.get("/courses/" + params.courseId);
  const courseData = courseRes.data.data as ICourse;
  return getMetadataCoursePage({
    params,
    course: courseData,
  });
}
const getData = async (courseId: string, token: string, userId: string) => {
  try {
    const axiosInstance = await createServerAxiosInstance();
    const data = await axiosInstance.get(
      `/exams/userScore/${courseId}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.data.data;
  } catch (error) {
    console.error(error);
  }
};

const CoursesPage = async ({
  params,
}: {
  params: { locale: string; courseId: string };
}) => {
  unstable_setRequestLocale(params.locale);
  try {
    const axiosInstance = createServerAxiosInstance();
    const token = getServerCookie("token");
    const user = getServerCookie("user", true) as IUser;
    const data = (await getData(params.courseId, token, user._id)) as {
      lessonsScores: {
        lessonId: string;
        lessonTitle: string;
        percentage: number;
        attemptDate: string;
        modelExam: string;
      }[];
    };
    const courseRes = await axiosInstance.get("/courses/" + params.courseId);
    const courseData = courseRes.data.data as ICourse;
    const text = await getTranslations("learn");
    return (
      <main
        style={{
          maxHeight: "calc(100vh - 76px)",
          height: "calc(100vh - 76px)",
        }}
        className="flex flex-col h-screen px-2 py-6 lg:px-6 sm:px-4 "
      >
        <h1>
          {text("courseExamsHistory")} | {courseData.title}
        </h1>{" "}
        <div className="grid grid-cols-1 gap-4 pb-6 mt-8 overflow-y-auto lg:grid-cols-2">
          {data.lessonsScores.map((progress) => {
            return (
              <Card key={progress.lessonId} className="w-full">
                <CardHeader>
                  <CardTitle className="mb-2 h2">
                    {text("lesson_type")} | {progress.lessonTitle}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={"default"}>{text("completed")}</Badge>
                    <Badge variant="outline">
                      {progress.modelExam === "A"
                        ? text("modelA")
                        : text("modelB")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>
                        {text("score")}: {progress.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {new Date(progress.attemptDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>{" "}
                <CardFooter>
                  <Button className="w-full" variant="secondary" asChild>
                    <Link
                      href={`/dashboard/learn/exams-history/${params.courseId}/${progress.lessonId}`}
                      className="w-full"
                    >
                      {text("viewExamDetails")}
                      <ClipboardList className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
    );
  } catch (e) {
    console.log(e);
    return notFound();
  }
};
export default CoursesPage;
