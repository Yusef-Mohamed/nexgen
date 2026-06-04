/** Normalize YouTube URLs to a clean embed URL (video id only, no ?si= etc.). */
export function getYouTubeEmbedUrl(input: string | undefined | null): string | null {
  if (!input?.trim()) return null;

  let videoId: string | null = null;

  const embedMatch = input.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch) {
    videoId = embedMatch[1];
  } else {
    const watchMatch = input.match(
      /(?:youtube\.com\/watch\?.*v=|youtube\.com\/v\/)([a-zA-Z0-9_-]+)/,
    );
    if (watchMatch) {
      videoId = watchMatch[1];
    } else {
      const shortMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (shortMatch) videoId = shortMatch[1];
    }
  }

  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}`;
}

export const YOUTUBE_IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

export const YOUTUBE_IFRAME_REFERRER_POLICY =
  "strict-origin-when-cross-origin" as const;
