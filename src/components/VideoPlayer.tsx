import React, { useRef, useEffect, useState } from 'react';
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
  muted = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlaying = () => {
      setIsPlaying(true);
    };

    const handleWaiting = () => {
      setIsPlaying(false);
    };

    // const tryPlay = async () => {
    //   try {
    //     await video.play();
    //   } catch (e) {
    //     console.warn('Video play failed:', e);
    //   }
    // };

    // important : attendre que le pipeline soit prêt
    // video.muted = true;

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('waiting', handleWaiting);

    video.play().catch(() => {});

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('waiting', handleWaiting);
    };
  }, [src]);

  return (
    <div className={cn('absolute inset-0', className)}>
      <video
        ref={videoRef}
        src={src}
        loop={loop}
        onEnded={onEnded}
        onClick={onClick}
        playsInline
        muted={muted}
        preload="auto"
        className={cn(
          'w-full h-full object-fill select-none pointer-events-auto transition-opacity duration-150',
          isPlaying ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
};

export default VideoPlayer;
