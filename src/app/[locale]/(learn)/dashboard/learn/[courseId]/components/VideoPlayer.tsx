import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  otp: string;
  playbackInfo: string;
  onVideoNearEnd?: () => void;
  onVideoEnd?: () => void;
  title?: string;
}

interface VdoPlayerVideo {
  currentTime: number;
  duration: number;
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
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

const VIEWED_THRESHOLD_SECONDS = 60;

const VideoPlayer = ({
  otp,
  playbackInfo,
  onVideoNearEnd,
  onVideoEnd,
  title,
}: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasReportedNearEndRef = useRef(false);
  const hasReportedEndRef = useRef(false);
  const onVideoNearEndRef = useRef(onVideoNearEnd);
  const onVideoEndRef = useRef(onVideoEnd);

  useEffect(() => {
    onVideoNearEndRef.current = onVideoNearEnd;
    onVideoEndRef.current = onVideoEnd;
  }, [onVideoEnd, onVideoNearEnd]);

  useEffect(() => {
    hasReportedNearEndRef.current = false;
    hasReportedEndRef.current = false;

    const script = document.createElement("script");
    script.src = "https://player.vdocipher.com/v2/api.js";
    script.async = true;
    document.body.appendChild(script);
    let playerVideo: VdoPlayerVideo | null = null;
    let isDisposed = false;

    const handleTimeUpdate = () => {
      if (hasReportedNearEndRef.current || !playerVideo) return;

      const { currentTime, duration } = playerVideo;
      if (
        Number.isFinite(currentTime) &&
        Number.isFinite(duration) &&
        duration > VIEWED_THRESHOLD_SECONDS &&
        currentTime >= duration - VIEWED_THRESHOLD_SECONDS
      ) {
        hasReportedNearEndRef.current = true;
        onVideoNearEndRef.current?.();
      }
    };

    const handleEnded = () => {
      if (hasReportedEndRef.current) return;

      hasReportedEndRef.current = true;
      if (!hasReportedNearEndRef.current) {
        hasReportedNearEndRef.current = true;
        onVideoNearEndRef.current?.();
      }
      onVideoEndRef.current?.();
    };

    const handleError = () => {
      console.error("Video player encountered an error.");
    };

    script.onload = () => {
      if (!isDisposed && iframeRef.current && window.VdoPlayer) {
        const player = window.VdoPlayer.getInstance(iframeRef.current);
        playerVideo = player.video;
        playerVideo.addEventListener("timeupdate", handleTimeUpdate);
        playerVideo.addEventListener("ended", handleEnded);
        playerVideo.addEventListener("error", handleError);
      }
    };

    return () => {
      isDisposed = true;
      playerVideo?.removeEventListener("timeupdate", handleTimeUpdate);
      playerVideo?.removeEventListener("ended", handleEnded);
      playerVideo?.removeEventListener("error", handleError);

      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [otp, playbackInfo]);

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
