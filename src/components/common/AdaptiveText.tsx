import { ReactNode, CSSProperties } from 'react';
import { useAdaptiveTextSize } from '../../hooks/useAdaptiveTextSize';

interface AdaptiveTextProps {
  children: ReactNode;
  text: string;
  className?: string;
  style?: CSSProperties;
  timeFormat?: '12h' | '24h';
  containerPadding?: number;
  minFontSize?: number;
  maxFontSize?: number;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';
}

export function AdaptiveText({
  children,
  text,
  className = '',
  style = {},
  timeFormat = '24h',
  containerPadding = 32,
  minFontSize = 16,
  maxFontSize = 64,
  as: Component = 'span'
}: AdaptiveTextProps) {
  const { getAdaptiveStyle, measureRef } = useAdaptiveTextSize({
    text,
    timeFormat,
    containerPadding,
    minFontSize,
    maxFontSize
  });

  return (
    <>
      {/* Élément de mesure invisible */}
      <div 
        ref={measureRef} 
        className="sr-only" 
        aria-hidden="true"
        style={{ position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap' }}
      />
      
      {/* Texte adaptatif */}
      <Component
        className={`adaptive-text ${className}`}
        style={{
          ...getAdaptiveStyle(),
          ...style
        }}
      >
        {children}
      </Component>
    </>
  );
}