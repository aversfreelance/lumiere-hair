"use client";

import { useEffect, useRef, useState } from "react";

type HeroVideoOnceProps = {
  src: string;
  className?: string;
  poster?: string;
};

export function HeroVideoOnce({ src, className = "", poster }: HeroVideoOnceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPoster, setShowPoster] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setShowPoster(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => setShowPoster(true));
  }, []);

  if (showPoster && poster) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt="" className={className} />;
  }

  return (
    <video
      ref={videoRef}
      className={`hero-video-bg ${className}`.trim()}
      src={src}
      poster={poster}
      muted
      autoPlay
      playsInline
      preload="auto"
      controls={false}
      controlsList="nodownload nofullscreen noremoteplayback"
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
      aria-hidden
    />
  );
}
