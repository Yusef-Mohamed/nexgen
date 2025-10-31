"use client";

import { SmileIcon } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";

interface EmojiPickerProps {
  onChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
}

export const EmojiPicker = ({
  onChange,
  className,
  triggerClassName,
}: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger className={triggerClassName}>
        <SmileIcon
          className={cn(
            "w-5 h-5 transition text-muted-foreground hover:text-foreground",
            className
          )}
        />
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Picker
          emojiSize={18}
          theme="light"
          data={data}
          maxFrequentRows={1}
          onEmojiSelect={(emoji: { native: string }) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
