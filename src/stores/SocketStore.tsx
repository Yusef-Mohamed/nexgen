import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/constants";

type SocketStore = {
  socket: Socket | null;
  setupSocket: ({ userId }: { userId: string }) => void;
  emitEvent: (event: string, data: unknown) => void;
  listenToEvent: (event: string, callback: (data: unknown) => void) => void;
  disconnectSocket: () => void;
};

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  setupSocket: ({ userId }: { userId: string }) => {
    const socket = get().socket;
    if (socket) {
      console.warn("Socket already initialized");
      return;
    }

    const newSocket = io(SOCKET_URL);
    newSocket.emit("addUser", { userId });
    set({ socket: newSocket });
  },

  emitEvent: (event, data) => {
    const socket = get().socket;
    if (socket) {
      socket.emit(event, data);
    } else {
      console.error("Socket is not initialized");
    }
  },

  listenToEvent: (event, callback) => {
    const socket = get().socket;
    if (socket) {
      socket.on(event, callback);
    } else {
      console.error("Socket is not initialized");
    }
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
