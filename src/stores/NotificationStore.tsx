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
  disconnectSocket: () => void;
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
    if (haveError && !isFirst) return;
    if (isFirst && notifications.length > 0) return;
    if (
      isLoading ||
      (paginationData &&
        paginationData.numberOfPages <= paginationData.currentPage)
    )
      return;
    const token = getCookie("token");
    set({ isLoading: true, haveError: false });

    try {
      const nextPage = (paginationData?.currentPage || 0) + 1 || 1;
      const res = await axiosInstance(
        `/notifications?limit=5&page=${nextPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (getCookie("token") !== token) return;
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
    } catch {
      if (getCookie("token") !== token) return;
      set({ isLoading: false, haveError: true });
    }
  },
  setupSocket: ({ userId }: { userId: string }) => {
    if (!userId) return;
    const existingSocket = get().socket;
    if (existingSocket) {
      if (!existingSocket.connected) existingSocket.connect();
      return;
    }

    const token = getCookie("token");
    const socket = io(SOCKET_URL, { auth: { token, timeline: true } });
    set({ socket });
    socket.on("notification:changed", async ({ notificationId }: { notificationId?: string }) => {
      if (!notificationId || !/^[a-f\d]{24}$/i.test(notificationId)) return;
      try {
        const response = await axiosInstance.get(`/notifications/${notificationId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (get().socket !== socket || getCookie("token") !== token) return;
        const notification = response.data.data as INotification;
        if (!notification?._id) return;
        set((state) => ({
          notifications: [notification, ...state.notifications.filter(n => n._id !== notification._id)],
          gotUnReadCount: false,
        }));
        get().getUnReadCount();
        void new Audio("/notificationSound.wav").play().catch(() => {});
      } catch { /* Removed/inaccessible notifications must not enter the inbox. */ }
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
    }
    set({ socket: null, notifications: [], unReadCount: 0, gotUnReadCount: false, paginationData: null, isLoading: false, haveError: false });
  },
  readNotification: async ({ id }: { id: string }) => {
    const token = getCookie("token");

    await axiosInstance.put(`/notifications/${id}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (getCookie("token") !== token) return;
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n
      ),
      unReadCount: Math.max(0, state.unReadCount - (state.notifications.some(n => n._id === id && !n.read) ? 1 : 0)),
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
      if (getCookie("token") === token) set({ unReadCount: res.data.count, gotUnReadCount: true });
    } catch {
      if (getCookie("token") !== token) return;
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
      if (getCookie("token") === token) set({ unReadCount: 0 });
    } catch { /* Retain the unread count until acknowledgement succeeds. */ }
  },
}));
