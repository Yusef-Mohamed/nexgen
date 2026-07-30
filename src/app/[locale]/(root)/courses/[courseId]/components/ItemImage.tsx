"use client";

import Image from "next/image";
import { FiPlayCircle } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getDynamicString } from "@/lib/utils";
import {
  getYouTubeEmbedUrl,
  YOUTUBE_IFRAME_ALLOW,
  YOUTUBE_IFRAME_REFERRER_POLICY,
} from "@/lib/youtube";
import { DynamicString } from "@/types";

interface ItemImageProps {
  image?: string | undefined;
  title: DynamicString;
  promotionVideo?: string | undefined;
}

const ItemImage = ({ image, title, promotionVideo }: ItemImageProps) => {
  const embedUrl = promotionVideo ? getYouTubeEmbedUrl(promotionVideo) : null;

  if (!embedUrl) {
    return (
      <div>
        <Image
          src={image || "/images/default-image.png"}
          width={1000}
          height={1000}
          className="aspect-16/9 object-cover w-full rounded-2xl"
          alt={getDynamicString(title)}
        />
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer group">
          <Image
            src={image || "/images/default-image.png"}
            width={1000}
            height={1000}
            className="aspect-16/9 object-cover w-full rounded-2xl"
            alt={getDynamicString(title)}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl transition-all duration-300 group-hover:bg-black/50">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
              <FiPlayCircle className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden border-none bg-transparent shadow-none">
        <DialogTitle className="sr-only">Promotion Video</DialogTitle>
        <div className="aspect-video w-full bg-black">
          <iframe
            src={embedUrl}
            title="Promotion Video"
            className="w-full h-full"
            allow={YOUTUBE_IFRAME_ALLOW}
            referrerPolicy={YOUTUBE_IFRAME_REFERRER_POLICY}
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemImage;
