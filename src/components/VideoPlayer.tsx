import React, { useRef, useEffect } from 'react';
import { cn } from '../utils/cn';

interface VideoPlayerProps {
  src: string;
  loop?: boolean;
  onEnded?: () => void;
  onClick?: () => void;
  className?: string;
  autoPlay?: boolean;
  playsInline?: boolean;
  muted?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  loop = false,
  onEnded,
  onClick,
  className,
  autoPlay = true,
  playsInline = true,
  muted = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.error("Video play failed:", e));
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      loop={loop}
      onEnded={onEnded}
      onClick={onClick}
      autoPlay={autoPlay}
      playsInline={playsInline}
      muted={muted}
      className={cn(
        "absolute inset-0 w-full h-full object-fill select-none pointer-events-auto",
        className
      )}
    />
  );
};

export default VideoPlayer;
