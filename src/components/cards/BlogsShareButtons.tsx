"use client";
import { useLocale, useTranslations } from "next-intl";
import {
  FaFacebook,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaLink,
} from "react-icons/fa";
import { toast } from "react-toastify";

interface ShareButtonsProps {
  id: string;
  className?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  id,
  className,
}) => {
  const locale = useLocale();
  const t = useTranslations("blogShareButtons");
  const url = `${window.location.origin}/${locale}/blogs/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success(t("copyLinkAlert")); // Display a translated alert
  };

  return (
    <div className={className}>
      <h6 className="mt-3">{t("shareTheBlog")}</h6>
      <div className="flex items-center justify-center gap-4 mt-4">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("shareFacebook")}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-muted focus:outline"
        >
          <FaFacebook />
        </a>
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("shareWhatsapp")}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-muted focus:outline"
        >
          <FaWhatsapp />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("shareTwitter")}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-muted focus:outline"
        >
          <FaTwitter />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("shareLinkedIn")}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-muted focus:outline"
        >
          <FaLinkedin />
        </a>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full bg-muted focus:outline"
          onClick={handleCopyLink}
          aria-label={t("copyLink")}
        >
          <FaLink />
        </button>
      </div>
    </div>
  );
};
