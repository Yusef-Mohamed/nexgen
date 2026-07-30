import { useCallback, useEffect, useRef } from "react";

interface VideoPlayerProps {
  otp: string;
  playbackInfo: string;
  onVideoEnd?: () => void;
  title?: string;
}

interface VdoPlayerVideo {
  currentTime: number;
  duration: number;
  addEventListener: (event: string, callback: () => void) => void;
}

interface VdoPlayerInstance {
  video: VdoPlayerVideo;
}

interface VdoPlayerAPI {
  getInstance: (iframe: HTMLIFrameElement) => VdoPlayerInstance;
}

declare global {
  interface Window {
    VdoPlayer?: VdoPlayerAPI;
  }
}

const VideoPlayer = ({
  otp,
  playbackInfo,
  onVideoEnd,
  title,
}: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Using a ref to track completion status across different events
  const isMarkedDone = useRef(false);

  // Helper function to ensure we only fire the callback once
  const handleVideoComplete = useCallback(() => {
    if (!isMarkedDone.current) {
      isMarkedDone.current = true;
      onVideoEnd?.();
    }
  }, [onVideoEnd]);

  useEffect(() => {
    // 1. Load the VdoCipher API script
    const script = document.createElement("script");
    script.src = "https://player.vdocipher.com/v2/api.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (iframeRef.current && window.VdoPlayer) {
        const player = window.VdoPlayer.getInstance(iframeRef.current);

        // A. THE BUFFER FALLBACK (1 minute before end)
        player.video.addEventListener("timeupdate", () => {
          const currentTime = player.video.currentTime;
          const duration = player.video.duration;
          const bufferInSeconds = 60;

          // Logic: Mark done if current time is within the last minute
          // but only if the video is actually longer than the buffer.
          if (
            duration > bufferInSeconds &&
            currentTime >= duration - bufferInSeconds
          ) {
            handleVideoComplete();
          }
        });

        // B. THE NATIVE ENDED FALLBACK
        // This catches cases where a user skips to the absolute end
        // or if the buffer logic is bypassed.
        player.video.addEventListener("ended", () => {
          handleVideoComplete();
        });

        // C. ERROR FALLBACK
        // If the video fails to load or errors out near the end, we still try to capture state
        player.video.addEventListener("error", () => {
          console.error("Video player encountered an error.");
        });
      }
    };

    return () => {
      // Cleanup: Remove script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [handleVideoComplete]);

  if (!otp || !playbackInfo) return null;

  return (
    <iframe
      ref={iframeRef}
      title={title}
      className="aspect-video w-full rounded-2xl border border-primary/10 bg-black shadow-sm"
      src={`https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`}
      allow="encrypted-media"
      allowFullScreen
    />
  );
};

export default VideoPlayer;
