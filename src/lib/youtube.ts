/** Normalize YouTube URLs to a clean embed URL (video id only, no ?si= etc.). */
export function getYouTubeEmbedUrl(input: string | undefined | null): string | null {
  const value = input?.trim();
  if (!value) return null;

  let videoId: string | null = null;

  const iframeSrcMatch = value.match(/src=["']([^"']+)["']/i);
  const source = iframeSrcMatch?.[1] || value;

  const embedMatch = source.match(
    /youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]+)/,
  );
  if (embedMatch) {
    videoId = embedMatch[1];
  } else {
    const watchMatch = source.match(
      /(?:youtube(?:-nocookie)?\.com\/watch\?.*v=|youtube(?:-nocookie)?\.com\/v\/|youtube(?:-nocookie)?\.com\/shorts\/)([a-zA-Z0-9_-]+)/,
    );
    if (watchMatch) {
      videoId = watchMatch[1];
    } else {
      const shortMatch = source.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
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
