import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  otp: string;
  playbackInfo: string;
  onVideoEnd?: () => void;
}

const VideoPlayer = ({ otp, playbackInfo, onVideoEnd }: VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Load Vdocipher API script
    const script = document.createElement("script");
    script.src = "https://player.vdocipher.com/v2/api.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-expect-error - Vdocipher types are not available
      if (window.VdoPlayer && iframeRef.current) {
        // @ts-expect-error - Vdocipher types are not available
        const player = window.VdoPlayer.getInstance(iframeRef.current);

        // Add event listener for video end
        player.video.addEventListener("ended", () => {
          console.log("Video ended through VdoPlayer API");
          onVideoEnd?.();
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [onVideoEnd]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full aspect-video"
      src={`https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`}
      allow="encrypted-media"
      allowFullScreen
    />
  );
};

export default VideoPlayer;
