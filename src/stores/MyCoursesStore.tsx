import { axiosInstance } from "@/app/lib/utils";
import { ICourse, IProgress, IUserScore } from "@/types";
import { create } from "zustand";

const FIVE_MINUTES = 5 * 60 * 1000;

type MyCoursesStore = {
  courses: ICourse[];
  isLoading: boolean;
  lastFetched: number | null;
  setCourses: (courses: ICourse[]) => void;
  getCourses: (
    token: string,
    selectedUser: string,
    skipValidation?: boolean
  ) => Promise<void>;
};

export const useMyCoursesStore = create<MyCoursesStore>((set, get) => ({
  courses: [],
  isLoading: false,
  lastFetched: null,

  setCourses: (courses) => set({ courses }),
  getCourses: async (token, selectedUser, skipValidation = false) => {
    const { isLoading, lastFetched } = get();
    if (!token || isLoading || !selectedUser) return;
    const now = Date.now();
    const isFresh = lastFetched && now - lastFetched < FIVE_MINUTES;
    if (isFresh && !skipValidation) return;
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get("/courses/MyCourses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const courses = await Promise.all(
        res.data.data.map(async (course: ICourse) => {
          try {
            const userScoreRes = await axiosInstance.get(
              `/exams/userScore/${course._id}/${selectedUser}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const courseProgressRes = await axiosInstance.get(
              `/exams/courseProgress/${course._id}/${selectedUser}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const userScore = userScoreRes.data.data as IUserScore;
            const courseProgress = courseProgressRes.data.data as IProgress;
            return {
              ...course,
              userScore,
              courseProgress,
              users: [],
            };
          } catch (err) {
            console.log(err);
            return {
              ...course,
            };
          }
        })
      );

      set({ courses: courses, lastFetched: now });
    } catch (err) {
      console.log(err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
