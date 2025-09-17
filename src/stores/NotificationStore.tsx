import { create } from "zustand";
import { axiosInstance } from "@/app/lib/utils";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/constants";
import { INotification, IPagination } from "@/types";
import { getCookie } from "cookies-next";
type NotificationStore = {
  unReadCount: number;
  gotUnReadCount: boolean;
  notifications: INotification[];
  page: number;
  socket: Socket | null;
  isLoading: boolean;
  fetchNotifications: (isFirst?: boolean) => void;
  setupSocket: ({ userId }: { userId: string }) => void;
  readNotification: ({ id }: { id: string }) => void;
  paginationData: IPagination | null;
  setPaginationData: (data: IPagination) => void;
  getUnReadCount: () => void;
  haveError: boolean;
  clearAllUnread: () => void;
};
export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unReadCount: 0,
  page: 1,
  socket: null,
  isLoading: false,
  paginationData: null,
  gotUnReadCount: false,
  haveError: false,
  setPaginationData: (data) => {
    set({ paginationData: data });
  },
  fetchNotifications: async (isFirst) => {
    const { isLoading, paginationData, notifications, haveError } = get();
    if (haveError) return;
    if (isFirst && notifications.length > 0) return;
    if (
      isLoading ||
      (paginationData &&
        paginationData.numberOfPages <= paginationData.currentPage)
    )
      return;
    const token = getCookie("token");
    set({ isLoading: true });

    try {
      const nextPage = (paginationData?.currentPage || 0) + 1 || 1;
      const res = await axiosInstance(
        `/notifications?limit=5&page=${nextPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (nextPage === 1)
        set({
          notifications: res.data.data,
          paginationData: res.data.paginationResult,
          isLoading: false,
        });
      else
        set({
          notifications: [...notifications, ...res.data.data],
          paginationData: res.data.paginationResult,
          isLoading: false,
        });
    } catch (error) {
      console.error(error);
      set({ isLoading: false, haveError: true });
    }
  },
  setupSocket: ({ userId }: { userId: string }) => {
    const socket = io(SOCKET_URL);
    socket.emit("addUser", { userId });
    set({ socket });
    socket.on("notification", (notification) => {
      const sound = new Audio("/notificationSound.wav");
      sound.play();
      set((state) => ({
        notifications: [notification, ...state.notifications],
        unReadCount: state.unReadCount + 1,
      }));
    });
  },
  readNotification: async ({ id }: { id: string }) => {
    const token = getCookie("token");

    await axiosInstance.put(`/notifications/${id}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n
      ),
      unReadCount: state.unReadCount - 1,
    }));
  },
  getUnReadCount: async () => {
    if (get().gotUnReadCount) return;

    const token = getCookie("token");
    try {
      const res = await axiosInstance("/notifications/unreadCount", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ unReadCount: res.data.count, gotUnReadCount: true });
    } catch (error) {
      console.error(error);
      set({ gotUnReadCount: true, unReadCount: 0 });
    }
  },
  clearAllUnread: async () => {
    const token = getCookie("token");
    try {
      await axiosInstance.put("/notifications", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ unReadCount: 0 });
    } catch (error) {
      console.error(error);
    }
  },
}));
