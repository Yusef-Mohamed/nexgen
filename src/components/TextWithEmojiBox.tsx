import { cn } from "@/lib/utils";
import { MdOutlineAttachment } from "react-icons/md";
import { Textarea } from "./ui/textarea";
import { SendHorizontal } from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";
import React, { useRef, useCallback } from "react";
import { useLocale } from "next-intl";

interface TextWithEmojiBoxProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  handleSend?: () => void;
  isLoading: boolean;
  media?: File | null | File[];
  setMedia?:
    | React.Dispatch<React.SetStateAction<File | null>>
    | React.Dispatch<React.SetStateAction<File[] | null>>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  className?: string;
  placeholder?: string;
  multiMedia?: boolean;
  textClassName?: string;
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
}) => {
  const mediaRef = useRef<HTMLInputElement>(null);
  const locale = useLocale();

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.target.value);
      adjustTextareaHeight(event.target);
    },
    [setText]
  );

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto"; // Reset height to calculate full scroll height
    element.style.height = `${element.scrollHeight}px`; // Set to full scroll height
  };

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
    [handleSend, setText]
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
    [setText, inputRef]
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
    [setMedia, multiMedia]
  );

  return (
    <div
      className={cn(
        "flex justify-between w-full items-center gap-2 border-t",
        className
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
            "flex items-center w-full py-2 pb-8 overflow-hidden border resize-none rounded-LG ps-8 bg-background",
            textClassName
          )}
          style={{ height: "auto" }} // Set initial height to auto for dynamic resizing
        />
        <div
          key="input"
          className={cn("absolute top-2", {
            "right-2": locale === "ar",
            "left-2": locale === "en",
          })}
        >
          <EmojiPicker onChange={handleEmojiSelect} />
        </div>
        <div
          className={cn("absolute bottom-2 flex items-center gap-2", {
            "right-2": locale === "ar",
            "left-2": locale === "en",
          })}
        >
          {" "}
          {handleSend && (
            <button disabled={isLoading} onClick={handleSend}>
              <SendHorizontal className="text-text-3" size={18} />
            </button>
          )}
          {setMedia && (
            <div className="flex">
              <button
                onClick={handleMediaClick}
                className={cn({
                  "text-primary": media !== null,
                })}
              >
                <MdOutlineAttachment className="text-xl text-text-3" />
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
      </div>
    </div>
  );
};

export default TextWithEmojiBox;
