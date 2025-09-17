import React, { useMemo, useRef } from "react";
import ChatBottombar from "./ChatBottomBar";
import { IMessage } from "@/types";
import MessageCard from "@/components/cards/MessageCard";
import { useChatStore } from "@/stores/ChatStore";
import { FaSpinner } from "react-icons/fa";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
export function ChatList() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user, token } = useAuth();
  const {
    messages,
    isFetchingMessages,
    setMessages,
    messagesPagination,
    setMessagesPagination,
    setMessageCurrentPage,
    messageCurrentPage,
    setIsFetchingMessages,
    selectedChatId,
  } = useChatStore();
  React.useEffect(() => {
    if (messagesContainerRef.current && messages.length <= 10) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current?.scrollHeight || 0;
    }
  }, [messages]);
  const getNextMessages = async () => {
    if (!messagesPagination) return;
    if (messageCurrentPage >= messagesPagination?.numberOfPages) return;
    if (isFetchingMessages) return;
    setIsFetchingMessages(true);
    try {
      const res = await axiosInstance(
        `/messages/${selectedChatId}?limit=10&sort=-createdAt&page=${
          messageCurrentPage + 1
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessagesPagination(res.data.paginationResult);
      setMessageCurrentPage(messageCurrentPage + 1);
      const sortedMessages = res.data.data.reverse();
      setMessages([...sortedMessages, ...messages]);
      setIsFetchingMessages(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetchingMessages(false);
    }
  };
  const handleScroll = async () => {
    if (messagesContainerRef.current)
      if (messagesContainerRef.current.scrollTop === 0) {
        const currentHeight = messagesContainerRef.current?.scrollHeight || 0;
        await getNextMessages();
        const newHeight = messagesContainerRef.current?.scrollHeight || 0;
        messagesContainerRef.current.scrollTop = newHeight - currentHeight;
      }
  };
  const groupedMessages = useMemo(() => {
    return messages.reduce((acc, message, index) => {
      if (index === 0) {
        acc.push([message]);
        return acc;
      }
      const lastGroup = acc[acc.length - 1];
      const lastMessage = lastGroup[lastGroup.length - 1];
      if (lastMessage.sender._id === message.sender._id) {
        lastGroup.push(message);
      } else {
        acc.push([message]);
      }
      return acc;
    }, [] as IMessage[][]);
  }, [messages]);
  return (
    <div className="flex flex-col w-full h-full overflow-x-hidden overflow-y-auto">
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex flex-col w-full h-full pt-6 overflow-x-hidden overflow-y-auto"
      >
        {isFetchingMessages && (
          <div className="flex p-2 mx-auto mt-4 border rounded-full w-fit border-primary text-primary">
            <FaSpinner className="animate-spin" />
          </div>
        )}
        {/* {isFetchingMessages &&
          Array.from({ length: 4 }).map((_, index) => (
            <MessageCardSkeleton key={index} isMine={index % 2 === 0} />
          ))} */}
        {groupedMessages.map((group, index) => (
          <div key={`group-${index}`} className="py-2">
            {group.map((message, ind) => (
              <MessageCard
                key={message._id}
                message={message}
                isMine={message.sender._id === user?._id}
                isFirst={ind === 0}
              />
            ))}
          </div>
        ))}
      </div>
      <ChatBottombar />
    </div>
  );
}
