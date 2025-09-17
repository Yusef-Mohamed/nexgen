import { create } from "zustand";
import { axiosInstance } from "@/app/lib/utils";

interface FollowingState {
  followingUsers: { user: string }[];
  lastFetched: number | null;
  isLoading: boolean;
  fetchFollowingUsers: (token: string | undefined) => Promise<void>;
  addFollowingUser: (userId: string) => void;
  removeFollowingUser: (userId: string) => void;
}

export const useFollowingStore = create<FollowingState>((set, get) => ({
  followingUsers: [],
  lastFetched: null,
  isLoading: false,

  fetchFollowingUsers: async (token) => {
    if (!token) return;
    const { followingUsers, lastFetched, isLoading } = get();
    const now = Date.now();
    const shouldRefetch = !lastFetched || now - lastFetched > 5 * 60 * 1000;
    if ((followingUsers.length > 0 && !shouldRefetch) || isLoading) {
      return;
    }
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(
        `/users/follow/followersAndFollowing`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({
        followingUsers: response.data.data.following || [],
        lastFetched: now,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  addFollowingUser: (userId) => {
    const { followingUsers } = get();
    set({ followingUsers: [...followingUsers, { user: userId }] });
  },
  removeFollowingUser: (userId) => {
    const { followingUsers } = get();
    set({
      followingUsers: followingUsers.filter((u) => u.user !== userId),
    });
  },
}));
