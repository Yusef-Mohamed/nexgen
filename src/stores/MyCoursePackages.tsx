import { createClientAxiosInstance } from "@/app/lib/utils";
import { ICoursePackage } from "@/types";
import { create } from "zustand";

type MyCoursePackagesStore = {
  coursePackages: ICoursePackage[];
  setCoursePackages: (course: ICoursePackage[]) => void;
  getCoursePackages: (token: string) => void;
  isLoading: boolean;
};

export const useMyCoursePackagesStore = create<MyCoursePackagesStore>(
  (set) => ({
    coursePackages: [],
    setCoursePackages: (coursePackages) => set({ coursePackages }),
    getCoursePackages: async (token) => {
      try {
        set({ isLoading: true });
        const axiosInstance = await createClientAxiosInstance();
        const res = await axiosInstance.get(
          "/coursePackages/MyCoursePackages",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        set({ coursePackages: res.data.data });
      } catch (err) {
        console.log(err);
      } finally {
        set({ isLoading: false });
      }
    },
    isLoading: false,
  })
);
