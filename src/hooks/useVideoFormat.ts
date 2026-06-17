import { useState, useEffect, useCallback } from 'react';

export const useVideoFormat = () => {
  const detectVideoFormat = useCallback((): '16_9' | '16_10' => {
    const ratio = window.innerWidth / window.innerHeight;
    // Midpoint between 16/9 (≈1.778) and 16/10 (1.6) is ≈1.689
    return ratio >= (16 / 9 + 16 / 10) / 2 ? '16_9' : '16_10';
  }, []);

  const [videoFormat, setVideoFormat] = useState<'16_9' | '16_10'>(detectVideoFormat);

  //keep logs
  console.log('Screen', window.innerWidth, 'x', window.innerHeight, '(', window.innerWidth / window.innerHeight, ')');
  console.log('Video format detected', videoFormat);

  useEffect(() => {
    const handleResize = () => setVideoFormat(detectVideoFormat());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [detectVideoFormat]);

  return videoFormat;
};
