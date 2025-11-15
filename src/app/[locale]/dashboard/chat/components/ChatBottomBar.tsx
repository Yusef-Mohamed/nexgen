import React, { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useChatStore } from "@/stores/ChatStore";
import { IMessage } from "@/types";
import { useTranslations } from "next-intl";
import { IoMdClose } from "react-icons/io";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { MdOutlineAttachment } from "react-icons/md";
import { SendHorizontal } from "lucide-react";
import { EmojiPicker } from "@/components/EmojiPicker";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function ChatBottombar() {
  const text = useTranslations("chat");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState<File | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);
  const { token, user } = useAuth();
  const {
    setActionOnMessage,
    selectedChatId,
    socket,
    addMessage,
    actionOnMessage,
    updateMessage,
  } = useChatStore();

  const sendMessageToSocket = useCallback(
    (payload: IMessage, type: "new" | "edit") => {
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
    },
    [socket, user?._id, selectedChatId]
  );

  const handleSend = useCallback(async () => {
    if (message.trim() || media) {
      setIsLoading(true);
      const data = new FormData();
      if (message) data.append("text", message);
      if (media) data.append("media", media);
      try {
        if (!actionOnMessage) {
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
  }, [
    message,
    media,
    actionOnMessage,
    selectedChatId,
    token,
    sendMessageToSocket,
    addMessage,
    updateMessage,
    setActionOnMessage,
  ]);

  useEffect(() => {
    if (actionOnMessage?.action === "edit") {
      setMessage(actionOnMessage.message.text);
    }
  }, [actionOnMessage]);

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleMediaClick = useCallback(() => {
    mediaRef.current?.click();
  }, []);

  const handleEmojiSelect = useCallback((value: string) => {
    setMessage((prev) => prev + value);
    inputRef.current?.focus();
    if (inputRef.current) {
      adjustTextareaHeight(inputRef.current);
    }
  }, []);

  const handleMediaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setMedia(file);
    },
    []
  );
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
      <div className="flex justify-between w-full items-center gap-2 border-t p-4">
        <div className="relative flex items-center gap-4 w-full">
          <EmojiPicker
            onChange={handleEmojiSelect}
            triggerClassName="w-11 h-11 flex items-center justify-center rounded-full text-primary bg-primary-faded"
            className="text-primary size-6"
          />

          <div className="flex">
            <button
              onClick={handleMediaClick}
              className={cn(
                "h-11 w-11",
                "flex items-center justify-center rounded-full text-primary bg-primary-faded",
                {
                  "text-primary": media !== null,
                }
              )}
            >
              <MdOutlineAttachment className="text-primary size-6" />
            </button>
            <input
              disabled={isLoading}
              type="file"
              id="mediaFile"
              className="hidden"
              ref={mediaRef}
              onChange={handleMediaChange}
            />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative w-full"
          >
            <Input
              disabled={isLoading}
              autoComplete="off"
              value={message}
              onInput={(e) =>
                adjustTextareaHeight(e.target as HTMLTextAreaElement)
              }
              onChange={(e) => setMessage(e.target.value)}
              name="text"
              placeholder="Aa"
              className="flex items-center w-full py-2 pb-8 overflow-hidden border resize-none rounded-lg ps-8 bg-background"
              style={{ height: "auto" }}
            />{" "}
            <button
              disabled={isLoading}
              onClick={handleSend}
              className="absolute top-1/2 -translate-y-1/2 end-2"
            >
              <SendHorizontal className="text-primary size-6" size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
