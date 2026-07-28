import { ICourse, IUser } from "@/types";
import { create } from "zustand";

export type AnalyticsCertificate = {
  file?: string | null;
  _id?: string;
  isdeserve?: boolean;
  istake?: boolean;
  isDeserve?: boolean;
  isTake?: boolean;
} | null;

type AnalyticsCourseProgress = {
  certificate?: AnalyticsCertificate;
  progress: {
    attemptDate: string;
    examScore: number;
    status: string;
    lesson: { title: string };
  }[];
};

type AnalyticsStore = {
  selectedUser: string;
  setSelectedUser: (selectedUser: string) => void;
  selectedCourse: string;
  setSelectedCourse: (selectedCourse: string) => void;
  selectedCourseObject: ICourse | null;
  setSelectedCourseObject: (selectedCourseObject: ICourse) => void;
  selectedUserObject: IUser | null;
  setSelectedUserObject: (selectedUserObject: IUser) => void;
  courseProgress: AnalyticsCourseProgress | null;
  setCourseProgress: (courseProgress: AnalyticsCourseProgress | null) => void;
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
  courseProgress: null,
  setCourseProgress: (courseProgress) => set({ courseProgress }),
  topUsers: [],
  setTopUsers: (topUsers) => set({ topUsers }),
  isCourseProgressLoading: false,
  setIsCourseProgressLoading: (isCourseProgressLoading) =>
    set({ isCourseProgressLoading }),
}));
