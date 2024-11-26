import { createClientAxiosInstance } from "@/app/lib/utils";
import { ICourse } from "@/types";
import { create } from "zustand";

type MyCoursesStore = {
  courses: ICourse[];
  setCourses: (course: ICourse[]) => void;
  getCourses: (token: string) => void;
  isLoading: boolean;
};

export const useMyCoursesStore = create<MyCoursesStore>((set) => ({
  courses: [],
  setCourses: (courses) => set({ courses }),
  getCourses: async (token) => {
    try {
      set({ isLoading: true });
      const axiosInstance = await createClientAxiosInstance();
      const res = await axiosInstance.get("/courses/MyCourses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ courses: res.data.data });
    } catch (err) {
      console.log(err);
    } finally {
      set({ isLoading: false });
    }
  },
  isLoading: false,
}));
