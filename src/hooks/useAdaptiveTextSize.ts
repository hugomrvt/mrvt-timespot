import { useState, useEffect, useRef, useCallback } from 'react';
import { useBreakpoint } from './useBreakpoint';

interface UseAdaptiveTextSizeOptions {
  text: string;
  timeFormat: '12h' | '24h';
  containerPadding?: number;
  minFontSize?: number;
  maxFontSize?: number;
}

export function useAdaptiveTextSize({
  text,
  timeFormat,
  containerPadding = 32,
  minFontSize = 48,
  maxFontSize = 280
}: UseAdaptiveTextSizeOptions) {
  const [fontSize, setFontSize] = useState(maxFontSize);
  const [containerWidth, setContainerWidth] = useState(0);
  const { width, isVerySmall, isMobile, isTablet } = useBreakpoint();
  const measureRef = useRef<HTMLDivElement>(null);

  // Fonction pour estimer la largeur du texte
  const estimateTextWidth = (text: string, fontSize: number): number => {
    // Facteur approximatif pour Space Grotesk (caractères monospace-like)
    const charWidth = fontSize * 0.6; // Space Grotesk a environ 0.6 ratio
    
    // Ajustement pour les différents caractères
    let estimatedWidth = 0;
    for (const char of text) {
      if (char === ':') {
        estimatedWidth += charWidth * 0.3; // Les deux-points sont plus étroits
      } else if (/\d/.test(char)) {
        estimatedWidth += charWidth * 0.55; // Les chiffres dans Space Grotesk
      } else {
        estimatedWidth += charWidth * 0.5; // Autres caractères
      }
    }
    
    return estimatedWidth;
  };

  // Fonction pour calculer la taille de police optimale
  const calculateOptimalFontSize = useCallback((
    text: string,
    availableWidth: number,
    timeFormat: '12h' | '24h'
  ): number => {
    if (!text || availableWidth <= 0) return minFontSize;

    // Calcul de la taille de police par largeur disponible
    let testFontSize = maxFontSize;
    let textWidth = estimateTextWidth(text, testFontSize);
    
    // Ajouter l'espace pour AM/PM en format 12h
    if (timeFormat === '12h') {
      const periodWidth = estimateTextWidth('AM', testFontSize * 0.5); // AM/PM à 50% de la taille
      const marginWidth = (isMobile || isTablet) ? testFontSize * 0.5 : testFontSize * 0.75; // Marge entre temps et AM/PM
      textWidth += periodWidth + marginWidth;
    }
    
    // Réduction progressive jusqu'à ce que le texte tienne
    while (textWidth > availableWidth && testFontSize > minFontSize) {
      testFontSize -= 2;
      textWidth = estimateTextWidth(text, testFontSize);
      
      // Recalculer l'espace pour AM/PM avec la nouvelle taille
      if (timeFormat === '12h') {
        const periodWidth = estimateTextWidth('AM', testFontSize * 0.5);
        const marginWidth = (isMobile || isTablet) ? testFontSize * 0.5 : testFontSize * 0.75;
        textWidth += periodWidth + marginWidth;
      }
    }
    
    // Ajustements spécifiques par breakpoint - 85% scale (réduction de 15%)
    if (isVerySmall) {
      testFontSize = Math.min(testFontSize, 68.64); // 85% de 80.75
    } else if (isMobile) {
      testFontSize = Math.min(testFontSize, 96.9); // 85% de 114
    } else if (isTablet) {
      testFontSize = Math.min(testFontSize, 145.35); // 85% de 171
    } else {
      testFontSize = testFontSize * 0.85; // 85% pour desktop
    }
    
    return Math.max(testFontSize, minFontSize);
  }, [minFontSize, maxFontSize, isVerySmall, isMobile, isTablet]);

  // Mise à jour de la taille de police
  useEffect(() => {
    const updateFontSize = () => {
      const availableWidth = width - containerPadding * 2;
      const optimalSize = calculateOptimalFontSize(text, availableWidth, timeFormat);
      setFontSize(optimalSize);
      setContainerWidth(availableWidth);
    };

    // Délai pour s'assurer que le DOM est prêt
    const timeoutId = setTimeout(updateFontSize, 50);
    
    return () => clearTimeout(timeoutId);
  }, [text, timeFormat, width, containerPadding, isVerySmall, isMobile, isTablet, calculateOptimalFontSize]);

  // Fonction pour obtenir le style CSS
  const getAdaptiveStyle = () => ({
    fontSize: `${fontSize}px`,
    lineHeight: 1,
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap' as const,
  });

  // Fonction pour obtenir les classes Tailwind adaptatives - 85% scale (réduction de 15%)
  const getAdaptiveClasses = () => {
    // Utilisation de clamp() CSS pour une adaptation fluide
    if (isVerySmall) {
      return 'text-[clamp(38.76px,9.69vw,68.64px)]'; // 85% des valeurs 95%
    } else if (isMobile) {
      return 'text-[clamp(48.45px,12.11vw,96.9px)]'; // 85% des valeurs 95%
    } else if (isTablet) {
      return 'text-[clamp(80.75px,14.54vw,145.35px)]'; // 85% des valeurs 95%
    }
    return 'text-[clamp(113.05px,16.15vw,226.1px)]'; // 85% des valeurs 95%
  };

  return {
    fontSize,
    containerWidth,
    getAdaptiveStyle,
    getAdaptiveClasses,
    measureRef,
    estimatedTextWidth: estimateTextWidth(text, fontSize)
  };
}