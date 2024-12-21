import { create } from "zustand";
import { createClientAxiosInstance } from "@/app/lib/utils";

interface FollowingState {
  followingUsers: { user: string }[];
  lastFetched: number | null;
  fetchFollowingUsers: (token: string | undefined) => Promise<void>;
  addFollowingUser: (userId: string) => void;
  removeFollowingUser: (userId: string) => void;
}

export const useFollowingStore = create<FollowingState>((set, get) => ({
  followingUsers: [],
  lastFetched: null,

  fetchFollowingUsers: async (token) => {
    if (!token) return;
    const { followingUsers, lastFetched } = get();
    const now = Date.now();
    const shouldRefetch = !lastFetched || now - lastFetched > 5 * 60 * 1000;
    if (followingUsers.length > 0 && !shouldRefetch) {
      return;
    }
    try {
      const response = await createClientAxiosInstance().get(
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
      });
    } catch (error) {
      console.error(error);
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
