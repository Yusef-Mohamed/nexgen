import { createClientAxiosInstance } from "@/app/lib/utils";
import { IPackage } from "@/types";
import { create } from "zustand";

type MyPackagesStore = {
  Packages: IPackage[];
  setPackages: (course: IPackage[]) => void;
  getPackages: (token: string) => void;
  isLoading: boolean;
};

export const useMyPackagesStore = create<MyPackagesStore>((set) => ({
  Packages: [],
  setPackages: (Packages) => set({ Packages }),
  getPackages: async (token) => {
    try {
      set({ isLoading: true });
      const axiosInstance = await createClientAxiosInstance();
      const res = await axiosInstance.get("/Packages/MyPackages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ Packages: res.data.data });
    } catch (err) {
      console.log(err);
    } finally {
      set({ isLoading: false });
    }
  },
  isLoading: false,
}));
