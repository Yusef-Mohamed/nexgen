import { cn } from "@/lib/utils";
import { MdOutlineAttachment } from "react-icons/md";
import { Textarea } from "./ui/textarea";
import { SendHorizontal } from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";
import React, { useRef, useCallback } from "react";

interface TextWithEmojiBoxProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  handleSend?: () => void;
  isLoading: boolean;
  media?: File | null | File[];
  setMedia?:
    | React.Dispatch<React.SetStateAction<File | null>>
    | React.Dispatch<React.SetStateAction<File[] | null>>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  className?: string;
  placeholder?: string;
  multiMedia?: boolean;
  textClassName?: string;
  toolsPosition?: "split" | "end";
  mediaIcon?: React.ReactNode;
}

const TextWithEmojiBox: React.FC<TextWithEmojiBoxProps> = ({
  text,
  setText,
  handleSend,
  isLoading,
  media,
  setMedia,
  inputRef,
  className,
  placeholder,
  multiMedia = false,
  textClassName,
  toolsPosition = "split",
  mediaIcon,
}) => {
  const mediaRef = useRef<HTMLInputElement>(null);

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto"; // Reset height to calculate full scroll height
    element.style.height = `${element.scrollHeight}px`; // Set to full scroll height
  };

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.target.value);
      adjustTextareaHeight(event.target);
    },
    [setText],
  );

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (event.shiftKey) {
          setText((prev) => prev + "\n");
        } else {
          if (handleSend) handleSend();
        }
      }
    },
    [handleSend, setText],
  );

  const handleMediaClick = useCallback(() => {
    mediaRef.current?.click();
  }, []);

  const handleEmojiSelect = useCallback(
    (value: string) => {
      setText((prev) => prev + value);
      inputRef.current?.focus();
      if (inputRef.current) {
        adjustTextareaHeight(inputRef.current);
      }
    },
    [setText, inputRef],
  );

  const handleMediaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (multiMedia) {
        const files = e.target.files;
        if (files) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setMedia((prev: File[]) => {
            if (prev) {
              return [...(prev as File[]), ...Array.from(files)];
            } else {
              return [...Array.from(files)];
            }
          });
        }
      } else {
        const file = e.target.files?.[0]; // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (file) setMedia(file);
      }
    },
    [setMedia, multiMedia],
  );

  const hasSelectedMedia = Array.isArray(media)
    ? media.length > 0
    : Boolean(media);

  return (
    <div
      className={cn(
        "flex justify-between w-full items-center gap-2 border-t",
        className,
      )}
    >
      <div className="relative w-full">
        <Textarea
          disabled={isLoading}
          autoComplete="off"
          value={text}
          ref={inputRef}
          onKeyDown={handleKeyPress}
          onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
          onChange={handleInputChange}
          name="text"
          placeholder={placeholder || "Aa"}
          className={cn(
            "flex items-center w-full py-2 pb-8 overflow-hidden border resize-none rounded-lg bg-background",
            textClassName,
          )}
          style={{ height: "auto" }} // Set initial height to auto for dynamic resizing
        />

        <div
          className={cn(
            "absolute bottom-2 flex items-center gap-2",
            toolsPosition === "end"
              ? "end-2 rounded-full border border-primary/10 bg-clear-ground/95 p-1 backdrop-blur-sm"
              : "w-full justify-between px-2",
          )}
        >
          <div className="flex items-center gap-2">
            <EmojiPicker
              onChange={handleEmojiSelect}
              triggerClassName="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-text-3 transition hover:bg-primary/10 hover:text-primary"
              className="text-current"
            />
            {setMedia && (
              <div className="flex">
                <button
                  type="button"
                  onClick={handleMediaClick}
                  className={cn(
                    "inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-text-3 transition hover:bg-primary/10 hover:text-primary",
                    {
                      "bg-primary/10 text-primary": hasSelectedMedia,
                    },
                  )}
                >
                  {mediaIcon ?? (
                    <MdOutlineAttachment className="text-xl text-current" />
                  )}
                </button>
                <input
                  disabled={isLoading}
                  type="file"
                  id="mediaFile"
                  className="hidden"
                  ref={mediaRef}
                  onChange={handleMediaChange}
                  multiple={multiMedia}
                />
              </div>
            )}
          </div>
          {handleSend && (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSend}
              className={cn(
                "inline-flex size-8 cursor-pointer items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-60",
                toolsPosition === "end"
                  ? "bg-primary text-primary-foreground hover:scale-105"
                  : "text-text-3 hover:bg-primary/10 hover:text-primary",
              )}
            >
              <SendHorizontal size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextWithEmojiBox;
