import { create } from "zustand";
import { axiosInstance } from "@/app/lib/utils";

type FollowingApiEntry =
  | string
  | {
      _id?: string;
      user?: string | { _id?: string };
    };

const normalizeFollowingUsers = (value: unknown): { user: string }[] => {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry: FollowingApiEntry) => {
    if (typeof entry === "string") return [{ user: entry }];

    const followedUser = entry?.user;
    if (typeof followedUser === "string") return [{ user: followedUser }];
    if (followedUser?._id) return [{ user: followedUser._id }];
    if (entry?._id) return [{ user: entry._id }];

    return [];
  });
};

interface FollowingState {
  followingUsers: { user: string }[];
  isLoading: boolean;
  fetchFollowingUsers: (token: string | undefined) => Promise<void>;
  addFollowingUser: (userId: string) => void;
  removeFollowingUser: (userId: string) => void;
}

export const useFollowingStore = create<FollowingState>((set, get) => ({
  followingUsers: [],
  isLoading: false,

  fetchFollowingUsers: async (token) => {
    if (!token) return;
    const { isLoading } = get();
    if (isLoading) {
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
        followingUsers: normalizeFollowingUsers(
          response.data?.data?.following,
        ),
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
