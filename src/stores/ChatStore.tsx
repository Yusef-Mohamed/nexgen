import { IChat, IMessage, IPagination } from "@/types";
import { Socket } from "socket.io-client";
import { create } from "zustand";

type ChatStore = {
  chats: IChat[];
  setChats: (chat: IChat[]) => void;
  isFetchingChats: boolean;
  setIsFetchingChats: (isFetching: boolean) => void;
  chatsPagination: IPagination | null;
  setChatsPagination: (pagination: IPagination | null) => void;
  chatCurrentPage: number;
  setChatCurrentPage: (page: number) => void;
  selectedChatId: string;
  setSelectedChatId: (selectedChatId: string) => void;
  messages: IMessage[];
  setMessages: (messages: IMessage[]) => void;
  isFetchingMessages: boolean;
  setIsFetchingMessages: (isFetching: boolean) => void;
  thisChat: IChat | null;
  setThisChat: (thisChat: IChat | null) => void;
  isFetchingThisChat: boolean;
  setIsFetchingThisChat: (isFetching: boolean) => void;
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
  addMessage: (message: IMessage) => void;
  updateMessage: (message: IMessage) => void;
  deleteMessage: (messageId: string) => void;
  actionOnMessage: { action: "edit" | "reply"; message: IMessage } | null;
  setActionOnMessage: (
    actionOnMessage: { action: "edit" | "reply"; message: IMessage } | null,
  ) => void;
  messagesPagination: IPagination | null;
  setMessagesPagination: (pagination: IPagination | null) => void;
  messageCurrentPage: number;
  setMessageCurrentPage: (page: number) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  setChats: (chats) => set({ chats }),
  isFetchingChats: true,
  setIsFetchingChats: (isFetchingChats) => set({ isFetchingChats }),
  chatsPagination: null,
  setChatsPagination: (chatsPagination) => set({ chatsPagination }),
  chatCurrentPage: 1,
  setChatCurrentPage: (chatCurrentPage) => set({ chatCurrentPage }),
  selectedChatId: "",
  setSelectedChatId: (selectedChatId) => set({ selectedChatId }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  isFetchingMessages: true,
  setIsFetchingMessages: (isFetchingMessages) => set({ isFetchingMessages }),
  thisChat: null,
  setThisChat: (thisChat) => set({ thisChat }),
  isFetchingThisChat: true,
  setIsFetchingThisChat: (isFetchingThisChat) => set({ isFetchingThisChat }),
  socket: null,
  setSocket: (socket) => set({ socket }),
  addMessage: (message) =>
    set((state) => {
      const messageExists = state.messages.some(
        (existingMessage) => existingMessage._id === message._id,
      );
      const messages = messageExists
        ? state.messages
        : [...state.messages, message];
      const chats = state.chats
        .map((chat) => {
          if (chat._id === message.chat) {
            return {
              ...chat,
              lastMessage: [message],
            };
          }
          return chat;
        })
        .sort((a, b) => {
          if (a._id === message.chat) return -1;
          if (b._id === message.chat) return 1;
          return 0;
        });

      return { messages, chats };
    }),
  updateMessage: (message) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === message._id ? message : msg,
      ),
      chats: state.chats.map((chat) => {
        const lastMessage = chat.lastMessage?.[0];
        if (lastMessage?._id === message._id) {
          return { ...chat, lastMessage: [message] };
        }
        return chat;
      }),
    })),
  deleteMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== messageId),
      chats: state.chats.map((chat) => {
        const lastMessage = chat.lastMessage?.[0];
        if (lastMessage?._id === messageId) {
          return { ...chat, lastMessage: [] };
        }
        return chat;
      }),
    })),
  actionOnMessage: null,
  setActionOnMessage: (actionOnMessage) => set({ actionOnMessage }),
  messagesPagination: null,
  setMessagesPagination: (messagesPagination) => set({ messagesPagination }),
  messageCurrentPage: 1,
  setMessageCurrentPage: (messageCurrentPage) => set({ messageCurrentPage }),
}));
