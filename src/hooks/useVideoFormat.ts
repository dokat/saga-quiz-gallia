import { useState, useEffect, useCallback } from 'react';

export const useVideoFormat = () => {
  const detectVideoFormat = useCallback((): '16_9' | '16_10' => {
    const ratio = window.innerWidth / window.innerHeight;
    // Midpoint between 16/9 (≈1.778) and 16/10 (1.6) is ≈1.689
    return ratio >= (16 / 9 + 16 / 10) / 2 ? '16_9' : '16_10';
  }, []);

  const [videoFormat, setVideoFormat] = useState<'16_9' | '16_10'>(detectVideoFormat);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  //keep logs
  console.log('Screen', windowSize.width, 'x', windowSize.height, '(', windowSize.width / windowSize.height, ')');
  console.log('Video format detected', videoFormat);

  useEffect(() => {
    const handleResize = () => {
      setVideoFormat(detectVideoFormat());
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [detectVideoFormat]);

  const adjustZone = useCallback(
    (zone: { x: number; y: number; w: number; h: number }) => {
      const baseWidth = 1920;
      const baseHeight = videoFormat === '16_9' ? 1080 : 1200;

      const scaleX = windowSize.width / baseWidth;
      const scaleY = windowSize.height / baseHeight;

      return {
        x: zone.x * scaleX,
        y: zone.y * scaleY,
        w: zone.w * scaleX,
        h: zone.h * scaleY,
      };
    },
    [videoFormat, windowSize]
  );

  return { videoFormat, adjustZone };
};
