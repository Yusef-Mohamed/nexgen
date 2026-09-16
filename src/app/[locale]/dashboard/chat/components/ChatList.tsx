import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocale } from "next-intl";

import ChatBottombar from "./ChatBottomBar";
import { IMessage } from "@/types";
import MessageCard, {
  MessageCardSkeleton,
} from "@/components/cards/MessageCard";
import { useChatStore, isCurrentChatRequest } from "@/stores/ChatStore";
import { useAuth } from "@/components/auth-provider";
import { axiosInstance } from "@/app/lib/utils";

const GROUPING_WINDOW_MS = 2 * 60 * 1000;
const MESSAGE_PAGE_SIZE = 20;

type MessageCluster = {
  id: string;
  messages: IMessage[];
};

type DaySection = {
  key: string;
  label: string;
  clusters: MessageCluster[];
};

type ScrollSnapshot = {
  scrollHeight: number;
  scrollTop: number;
};

const getDayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatDayLabel = (date: Date, locale: string) => {
  if (locale.startsWith("en")) {
    const month = new Intl.DateTimeFormat("en", { month: "long" }).format(date);
    const day = date.getDate();
    return `${day}${getOrdinalSuffix(day)} of ${month}`;
  }

  return new Intl.DateTimeFormat(locale.startsWith("ar") ? "ar-EG" : locale, {
    day: "numeric",
    month: "long",
  }).format(date);
};

const buildDaySections = (messages: IMessage[], locale: string) => {
  const sections: DaySection[] = [];

  messages
    .slice()
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .forEach((message) => {
      const messageDate = new Date(message.createdAt);
      const dayKey = getDayKey(messageDate);
      let section = sections[sections.length - 1];

      if (!section || section.key !== dayKey) {
        section = {
          key: dayKey,
          label: formatDayLabel(messageDate, locale),
          clusters: [],
        };
        sections.push(section);
      }

      const lastCluster = section.clusters[section.clusters.length - 1];
      const lastMessage =
        lastCluster?.messages[lastCluster.messages.length - 1];
      const lastMessageTime = lastMessage
        ? new Date(lastMessage.createdAt).getTime()
        : 0;
      const currentMessageTime = messageDate.getTime();
      const shouldJoinCluster =
        lastMessage?.sender?._id === message.sender?._id &&
        currentMessageTime - lastMessageTime <= GROUPING_WINDOW_MS;

      if (lastCluster && shouldJoinCluster) {
        lastCluster.messages.push(message);
        return;
      }

      section.clusters.push({
        id: message._id,
        messages: [message],
      });
    });

  return sections;
};

const mergeMessagesById = (
  olderMessages: IMessage[],
  currentMessages: IMessage[],
) => {
  const messageIds = new Set<string>();
  return [...olderMessages, ...currentMessages].filter((message) => {
    if (messageIds.has(message._id)) return false;
    messageIds.add(message._id);
    return true;
  });
};

export function ChatList() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const preserveScrollRef = useRef<ScrollSnapshot | null>(null);
  const shouldScrollToBottomRef = useRef(true);
  const isNearBottomRef = useRef(true);
  const lastMessageIdRef = useRef<string | null>(null);
  const isFetchingOlderRef = useRef(false);
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);
  const locale = useLocale();
  const { user, token } = useAuth();
  const currentUserId = user?._id;
  const {
    messages,
    setMessages,
    selectedChatId,
    isFetchingMessages,
    setIsFetchingMessages,
    messagesPagination,
    setMessagesPagination,
    messageCurrentPage,
    setMessageCurrentPage,
  } = useChatStore();

  const hasOlderMessages =
    !!messagesPagination &&
    messageCurrentPage < messagesPagination.numberOfPages;

  const fetchMessages = useCallback(
    async (page: number, mode: "initial" | "older") => {
      if (!selectedChatId || !token) {
        setIsFetchingMessages(false);
        return;
      }

      const epoch = useChatStore.getState().safetyEpoch;
      const activeChatId = selectedChatId;
      const isActiveChat = () =>
        isCurrentChatRequest(epoch, activeChatId);

      if (mode === "older") {
        if (isFetchingOlderRef.current) return;

        isFetchingOlderRef.current = true;
        const container = messagesContainerRef.current;
        if (container) {
          preserveScrollRef.current = {
            scrollHeight: container.scrollHeight,
            scrollTop: container.scrollTop,
          };
        }
        setIsFetchingOlder(true);
      } else {
        shouldScrollToBottomRef.current = true;
        setIsFetchingMessages(true);
      }

      try {
        const res = await axiosInstance(
          `/messages/${activeChatId}?limit=${MESSAGE_PAGE_SIZE}&page=${page}&sort=-createdAt`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!isActiveChat()) return;

        const pageMessages = ((res.data.data ?? []) as IMessage[])
          .slice()
          .reverse();

        if (mode === "older") {
          const currentMessages = useChatStore.getState().messages;
          setMessages(mergeMessagesById(pageMessages, currentMessages));
        } else {
          setMessages(pageMessages);
        }

        setMessagesPagination(res.data.paginationResult ?? null);
        setMessageCurrentPage(page);
      } catch {
        preserveScrollRef.current = null;
        if (isActiveChat()) setMessages([]);
      } finally {
        if (mode === "older") {
          isFetchingOlderRef.current = false;
          setIsFetchingOlder(false);
        } else if (isActiveChat()) {
          setIsFetchingMessages(false);
        }
      }
    },
    [
      selectedChatId,
      token,
      setIsFetchingMessages,
      setMessageCurrentPage,
      setMessages,
      setMessagesPagination,
    ],
  );

  useEffect(() => {
    preserveScrollRef.current = null;
    shouldScrollToBottomRef.current = true;
    isNearBottomRef.current = true;
    lastMessageIdRef.current = null;
    isFetchingOlderRef.current = false;
    setIsFetchingOlder(false);
    setMessages([]);
    setMessagesPagination(null);
    setMessageCurrentPage(1);

    if (!selectedChatId || !token) {
      setIsFetchingMessages(false);
      return;
    }

    fetchMessages(1, "initial");
  }, [
    selectedChatId,
    token,
    fetchMessages,
    setIsFetchingMessages,
    setMessageCurrentPage,
    setMessages,
    setMessagesPagination,
  ]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const preserveScroll = preserveScrollRef.current;
    if (preserveScroll) {
      requestAnimationFrame(() => {
        container.scrollTop =
          container.scrollHeight -
          preserveScroll.scrollHeight +
          preserveScroll.scrollTop;
        preserveScrollRef.current = null;
      });
      return;
    }

    if (shouldScrollToBottomRef.current) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
        shouldScrollToBottomRef.current = false;
        lastMessageIdRef.current = messages[messages.length - 1]?._id ?? null;
        isNearBottomRef.current = true;
      });
      return;
    }

    const latestMessage = messages[messages.length - 1];
    const latestMessageId = latestMessage?._id ?? null;

    if (latestMessageId && latestMessageId !== lastMessageIdRef.current) {
      if (
        isNearBottomRef.current ||
        latestMessage?.sender?._id === currentUserId
      ) {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
          isNearBottomRef.current = true;
        });
      }
      lastMessageIdRef.current = latestMessageId;
    }
  }, [currentUserId, messages]);

  const handleMessagesScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      const distanceFromBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight;
      isNearBottomRef.current = distanceFromBottom < 240;

      if (
        target.scrollTop <= 96 &&
        hasOlderMessages &&
        !isFetchingMessages &&
        !isFetchingOlderRef.current &&
        !isFetchingOlder
      ) {
        fetchMessages(messageCurrentPage + 1, "older");
      }
    },
    [
      fetchMessages,
      hasOlderMessages,
      isFetchingMessages,
      isFetchingOlder,
      messageCurrentPage,
    ],
  );

  const daySections = useMemo(
    () => buildDaySections(messages, locale),
    [locale, messages],
  );

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div
        ref={messagesContainerRef}
        className="relative flex h-full w-full flex-col overflow-x-hidden overflow-y-auto px-2 py-5 sm:px-4 lg:px-6"
        onScroll={handleMessagesScroll}
      >
        {isFetchingOlder && (
          <div className="flex justify-center py-2">
            <span className="size-2 animate-pulse rounded-full bg-primary/60" />
          </div>
        )}

        {isFetchingMessages && messages.length === 0 && (
          <div className="space-y-1.5">
            {Array.from({ length: 6 }).map((_, index) => (
              <MessageCardSkeleton key={index} isMine={index % 3 === 0} />
            ))}
          </div>
        )}

        {daySections.map((section) => (
          <section key={section.key} className="py-2">
            <div className="my-3 flex items-center justify-center gap-3">
              <span className="h-px flex-1 bg-primary/10" />
              <span className="sticky top-2 z-20 rounded-full border border-primary/10 bg-clear-ground/95 px-3 py-1 text-xs font-bold text-text-3 shadow-sm backdrop-blur-sm">
                {section.label}
              </span>
              <span className="h-px flex-1 bg-primary/10" />
            </div>
            <div className="space-y-1.5">
              {section.clusters.map((cluster) => (
                <div key={cluster.id} className="space-y-0.5">
                  {cluster.messages.map((message, index) => (
                    <MessageCard
                      key={message._id}
                      message={message}
                      isMine={message.sender?._id === currentUserId}
                      isFirst={index === 0}
                      isLast={index === cluster.messages.length - 1}
                    />
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <ChatBottombar />
    </div>
  );
}
