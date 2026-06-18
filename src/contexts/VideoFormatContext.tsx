import { createContext, useContext } from 'react';

type AdjustZoneFn = (zone: { x: number; y: number; w: number; h: number }) => {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type VideoFormatContextType = {
  videoFormat: '16_9' | '16_10';
  adjustZone: AdjustZoneFn;
  /** Scale a pixel size designed for 1920px wide to the current viewport width. */
  scaleSize: (px: number) => number;
};

const VideoFormatContext = createContext<VideoFormatContextType | null>(null);

export const VideoFormatProvider = VideoFormatContext.Provider;

export function useVideoFormatContext() {
  const ctx = useContext(VideoFormatContext);
  if (!ctx) throw new Error('useVideoFormatContext must be used within a VideoFormatProvider');
  return ctx;
}
