import React, { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useChatStore, isCurrentChatRequest } from "@/stores/ChatStore";
import type { WireMessage } from '@/lib/chat-timeline-cache';
import { useLocale, useTranslations } from "next-intl";
import { safetyCopy } from "@/lib/safety-contract";
import { IoMdClose } from "react-icons/io";
import { axiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { MdOutlineAttachment } from "react-icons/md";
import { SendHorizontal } from "lucide-react";
import { EmojiPicker } from "@/components/EmojiPicker";
import { cn } from "@/lib/utils";

export default function ChatBottombar({ onSent, onEdited, disabled = false }: { onSent: (message: WireMessage) => void; onEdited: (id: string) => void; disabled?: boolean }) {
  const text = useTranslations("chat");
  const locale = useLocale();
  const common = safetyCopy[locale === "ar" ? "ar" : "en"];
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState<File | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();
  const retry = useRef<{ key: string; text: string; media: File | null; reply?: string } | null>(null);
  const {
    setActionOnMessage,
    selectedChatId,
    addMessage,
    actionOnMessage,
    updateMessage,
  } = useChatStore();

  const adjustTextareaHeight = useCallback((element: HTMLDivElement) => {
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;
  }, []);

  const resetComposer = useCallback(() => {
    setMessage("");
    setMedia(null);
    if (mediaRef.current) mediaRef.current.value = "";
    if (inputRef.current) {
      inputRef.current.innerText = "";
      inputRef.current.style.height = "auto";
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, []);

  const handleSend = useCallback(async () => {
    const epoch = useChatStore.getState().safetyEpoch;
    if (disabled || !useChatStore.getState().thisChat || !selectedChatId || isLoading) return;
    const current = () => isCurrentChatRequest(epoch, selectedChatId);
    if (message.trim() || media) {
      setIsLoading(true);
      const data = new FormData();
      if (message) data.append("text", message);
      if (media) data.append("media", media);
      try {
        if (actionOnMessage?.action !== 'edit') {
          const reply = actionOnMessage?.message._id;
          if (!retry.current || retry.current.text !== message || retry.current.media !== media || retry.current.reply !== reply) {
            retry.current = { key: crypto.randomUUID(), text: message, media, reply };
          }
          data.append('clientMessageId', retry.current.key);
          if (reply) data.append('repliedTo', reply);
          const res = await axiosInstance.post(
            "/messages/mobile/" + selectedChatId,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Idempotency-Key': retry.current.key,
              },
            },
          );
          if (!current()) return;
          addMessage(res.data);
          onSent(res.data);
          retry.current = null;
        } else if (actionOnMessage.action === "edit") {
          const res = await axiosInstance.put(
            "/messages/" + actionOnMessage.message._id,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (!current()) return;
          updateMessage(res.data);
          onEdited(actionOnMessage.message._id);
        }
        setActionOnMessage(null);
        resetComposer();
      } catch (e) {
        const typedError = e as AxiosError<{
          message: string;
        }>;
        if (current()) toast.error(typedError.response?.data?.message || common.error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [
    disabled,
    isLoading,
    message,
    media,
    actionOnMessage,
    selectedChatId,
    token,
    onSent,
    onEdited,
    addMessage,
    updateMessage,
    setActionOnMessage,
    resetComposer,
    common.error,
  ]);

  useEffect(() => {
    if (actionOnMessage?.action === "edit") {
      const nextMessage = actionOnMessage.message.text;
      setMessage(nextMessage);
      if (inputRef.current) {
        inputRef.current.innerText = nextMessage;
        adjustTextareaHeight(inputRef.current);
      }
    }
  }, [actionOnMessage, adjustTextareaHeight]);

  const handleMediaClick = useCallback(() => {
    mediaRef.current?.click();
  }, []);

  const handleEmojiSelect = useCallback(
    (value: string) => {
      setMessage((prev) => {
        const nextMessage = `${prev}${value}`;
        if (inputRef.current) {
          inputRef.current.innerText = nextMessage;
          adjustTextareaHeight(inputRef.current);
        }
        return nextMessage;
      });
      inputRef.current?.focus();
    },
    [adjustTextareaHeight],
  );

  const handleMediaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setMedia(file);
    },
    [],
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
            className="border-t border-primary/10 bg-clear-ground/90 px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-3">
              <div className="min-w-0 border-s-2 border-primary ps-3">
                <h4 className="text-sm font-semibold text-text-1">
                  {actionOnMessage.message.sender.name}
                </h4>
                <p className="line-clamp-2 text-xs leading-5 text-text-3">
                  {actionOnMessage.message.text.trim()}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <button
                  onClick={() => setActionOnMessage(null)}
                  aria-label={common.cancel}
                  className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-primary/10 bg-clear-ground text-text-3 transition-colors hover:text-primary"
                  type="button"
                >
                  <IoMdClose />
                </button>
                <span className="text-xs font-semibold text-primary">
                  {text(actionOnMessage.action)}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      <div className="border-t border-primary/10 bg-clear-ground/95 p-3 backdrop-blur-sm sm:p-4">
        {media && (
          <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-secondary/15 bg-secondary/10 px-3 py-2 text-sm text-secondary">
            <span className="line-clamp-1 font-semibold">{media.name}</span>
            <button
              type="button"
              onClick={() => {
                setMedia(null);
                if (mediaRef.current) mediaRef.current.value = "";
              }}
              className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-clear-ground text-text-3 transition-colors hover:text-secondary"
            >
              <IoMdClose />
            </button>
          </div>
        )}{" "}
        <input
          disabled={isLoading}
          type="file"
          id="mediaFile"
          className="hidden"
          ref={mediaRef}
          onChange={handleMediaChange}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative min-w-0 flex-1"
        >
          {" "}
          <EmojiPicker
            onChange={handleEmojiSelect}
            triggerClassName="size-9 shrink-0 flex items-center justify-center rounded-full border border-primary/15 text-primary bg-clear-ground hover:bg-primary/10 transition-colors cursor-pointer absolute start-1 top-1 z-10"
            className="size-4 text-primary"
          />
          <button
            onClick={handleMediaClick}
            aria-label={locale === "ar" ? "إرفاق ملف" : "Attach a file"}
            className={cn(
              "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary/15 bg-clear-ground text-primary transition-colors hover:bg-primary/10 absolute start-11 top-1 z-10",
              {
                "border-secondary/25 bg-secondary/10 text-secondary":
                  media !== null,
              },
            )}
            type="button"
          >
            <MdOutlineAttachment className="size-4" />
          </button>
          <div className="relative overflow-hidden rounded-[1.5rem]">
            {!message && (
              <span className="pointer-events-none absolute start-22 top-3 text-sm text-text-3">
                Aa
              </span>
            )}
            <div
              ref={inputRef}
              aria-label="Aa"
              aria-multiline="true"
              contentEditable={!isLoading}
              onInput={(e) => {
                setMessage(e.currentTarget.innerText);
                adjustTextareaHeight(e.currentTarget);
              }}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain");
                document.execCommand("insertText", false, text);
              }}
              role="textbox"
              suppressContentEditableWarning
              className="max-h-40 min-h-11 overflow-y-auto whitespace-pre-wrap break-words rounded-[1.5rem] border border-primary/10 bg-clear-ground py-3 pe-12 text-sm shadow-none outline-none focus-visible:ring-1 focus-visible:ring-primary/30 ps-22!"
            />
          </div>
          <button
            disabled={disabled || isLoading || (!message.trim() && !media)}
            aria-label={locale === "ar" ? "إرسال الرسالة" : "Send message"}
            type="submit"
            className="absolute end-1 bottom-1 inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal className="size-4 rtl:rotate-180" />
          </button>
        </form>
      </div>
    </>
  );
}
