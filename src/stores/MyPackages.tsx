import { axiosInstance } from "@/app/lib/utils";
import { IPackage } from "@/types";
import { create } from "zustand";

const FIVE_MINUTES = 5 * 60 * 1000;

type PackagesStore = {
  packages: { package: IPackage }[];
  isLoading: boolean;
  lastFetched: number | null;
  setPackages: (packages: { package: IPackage }[]) => void;
  getPackages: (token: string) => Promise<void>;
};

export const usePackagesStore = create<PackagesStore>((set, get) => ({
  packages: [],
  isLoading: false,
  lastFetched: null,

  setPackages: (packages) => set({ packages }),

  getPackages: async (token) => {
    const { isLoading, lastFetched } = get();
    if (!token || isLoading) return;

    const now = Date.now();
    const isFresh = lastFetched && now - lastFetched < FIVE_MINUTES;
    if (isFresh) return;

    try {
      set({ isLoading: true });

      const res = await axiosInstance.get("/userSubscriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const uniquePackages = res.data.data.reduce(
        (acc: { package: IPackage }[], item: { package: IPackage }) => {
          const isDuplicate = acc.some(
            (existingItem) => existingItem.package._id === item.package._id
          );
          if (!isDuplicate) {
            acc.push(item);
          }
          return acc;
        },
        []
      );

      set({ packages: uniquePackages, lastFetched: now });
    } catch (err) {
      console.log(err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
