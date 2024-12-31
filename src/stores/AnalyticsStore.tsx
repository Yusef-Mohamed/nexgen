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
      isTake: boolean;
      isDeserve: boolean;
      file?: string;
    };
    progress: {
      attemptDate: string;
      examScore: number;
      lesson: { title: string };
    }[];
  };
  setCourseProgress: (courseProgress: {
    certificate: {
      isTake: boolean;
      isDeserve: boolean;
      file?: string;
    };
    progress: {
      attemptDate: string;
      examScore: number;
      lesson: { title: string };
    }[];
  }) => void;
  topUsers: IUser[];
  setTopUsers: (topUsers: IUser[]) => void;
  isCourseProgressLoading: boolean;
  setIsCourseProgressLoading: (isCourseProgressLoading: boolean) => void;
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
      isTake: false,
      isDeserve: false,
    },
    progress: [],
  },
  setCourseProgress: (courseProgress) => set({ courseProgress }),
  topUsers: [],
  setTopUsers: (topUsers) => set({ topUsers }),
  isCourseProgressLoading: false,
  setIsCourseProgressLoading: (isCourseProgressLoading) =>
    set({ isCourseProgressLoading }),
}));
