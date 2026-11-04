import React from 'react';

export interface BallpitProps {
  count?: number;
  colors?: (string | number)[];
  material?: 'satin' | 'matte' | 'gloss' | 'frosted' | 'metal';
  minSize?: number;
  maxSize?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  bounce?: number;
  depth?: number;
  drift?: number;
  followCursor?: boolean;
  cursorSize?: number;
  grab?: boolean;
  clickEffect?: 'burst' | 'none' | string;
  lightColor?: string | number;
  lightIntensity?: number;
  exposure?: number;
  shadows?: number;
  intro?: boolean;
  dpr?: number;
  className?: string;
  style?: React.CSSProperties;
}

declare const Ballpit: React.FC<BallpitProps>;
export default Ballpit;
