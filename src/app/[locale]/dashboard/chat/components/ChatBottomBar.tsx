import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useChatStore } from "@/stores/ChatStore";
import { IMessage } from "@/types";
import { useTranslations } from "next-intl";
import { IoMdClose } from "react-icons/io";
import TextWithEmojiBox from "@/components/TextWithEmojiBox";
import { createClientAxiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export default function ChatBottombar() {
  const text = useTranslations("chat");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { token, user } = useAuth();
  const {
    setActionOnMessage,
    selectedChatId,
    socket,
    addMessage,
    actionOnMessage,
    updateMessage,
  } = useChatStore();

  const sendMessageToSocket = (payload: IMessage, type: "new" | "edit") => {
    if (socket) {
      if (type === "new")
        socket.emit("sendMessage", {
          senderId: user?._id,
          roomId: selectedChatId,
          payload: payload,
          action: "sendMessage",
        });
      else if (type === "edit")
        socket.emit("sendMessage", {
          senderId: user?._id,
          roomId: selectedChatId,
          payload: payload,
          action: "editMessage",
        });
    }
  };
  const handleSend = async () => {
    if (message.trim() || media) {
      setIsLoading(true);
      const data = new FormData();
      if (message) data.append("text", message);
      if (media) data.append("media", media);
      try {
        if (!actionOnMessage) {
          const axiosInstance = await createClientAxiosInstance();
          const res = await axiosInstance.post(
            "/messages/" + selectedChatId,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          addMessage(res.data);
          sendMessageToSocket(res.data, "new");
        } else if (actionOnMessage.action === "edit") {
          const axiosInstance = await createClientAxiosInstance();
          const res = await axiosInstance.put(
            "/messages/" + actionOnMessage.message._id,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          updateMessage(res.data);
          sendMessageToSocket(res.data, "edit");
        } else if (actionOnMessage.action === "reply") {
          const axiosInstance = await createClientAxiosInstance();
          const res = await axiosInstance.post(
            "/messages/" + actionOnMessage.message._id + "/reply",
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          addMessage(res.data.data);
          sendMessageToSocket(res.data.data, "new");
        }
        setActionOnMessage(null);
        setMessage("");
        if (inputRef.current) {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 10);
        }
      } catch (e) {
        const typedError = e as AxiosError<{
          message: string;
        }>;
        if (typedError.response?.data?.message)
          toast.error(typedError.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (actionOnMessage?.action === "edit") {
      setMessage(actionOnMessage.message.text);
    }
  }, [actionOnMessage]);
  return (
    <>
      {actionOnMessage && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
            className="p-4 border-t"
          >
            <div className="flex items-start justify-between p-2 bg-muted">
              <div>
                <h4 className="text-sm font-semibold">
                  {actionOnMessage.message.sender.name}
                </h4>
                <p className="text-xs">{actionOnMessage.message.text}</p>
              </div>
              <div className="flex flex-col items-end">
                <button onClick={() => setActionOnMessage(null)}>
                  <IoMdClose />
                </button>
                <span className="text-xs">{text(actionOnMessage.action)}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      <TextWithEmojiBox
        textClassName="border-none rounded-none"
        isLoading={isLoading}
        text={message}
        setText={setMessage}
        inputRef={inputRef}
        handleSend={handleSend}
        media={media}
        setMedia={setMedia}
      />
    </>
  );
}
