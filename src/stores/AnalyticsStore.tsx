import { ICourse, IUser } from "@/types";
import { create } from "zustand";

type AnalyticsStore = {
  selectedUser: string;
  setSelectedUser: (selectedUser: string) => void;
  selectedCourse: string;
  setSelectedCourse: (selectedCourse: string) => void;
  selectedCourseObject: ICourse | null;
  setSelectedCourseObject: (selectedCourseObject: ICourse) => void;
  selectedUserObject: IUser | null;
  setSelectedUserObject: (selectedUserObject: IUser) => void;
  courseProgress: {
    certificate: {
      istake: boolean;
      isdeserve: boolean;
      file?: string;
    };
  };
  setCourseProgress: (courseProgress: {
    certificate: {
      istake: boolean;
      isdeserve: boolean;
      file?: string;
    };
  }) => void;
};
export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  selectedUser: "",
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  selectedCourse: "",
  setSelectedCourse: (selectedCourse) => set({ selectedCourse }),
  selectedUserObject: null,
  setSelectedUserObject: (selectedUserObject) => set({ selectedUserObject }),
  selectedCourseObject: null,
  setSelectedCourseObject: (selectedCourseObject) =>
    set({ selectedCourseObject }),
  courseProgress: {
    certificate: {
      istake: false,
      isdeserve: false,
    },
  },
  setCourseProgress: (courseProgress) => set({ courseProgress }),
}));
