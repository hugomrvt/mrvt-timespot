import { TimeZoneData, FormattedTime } from '../../lib/api/localTimeApi';
import { TimeFormatToggle } from './TimeFormatToggle';
import { formatDate } from '../../lib/utils/timezoneUtils';
import { LocalTimeApiService } from '../../lib/api/localTimeApi';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useAdaptiveTextSize } from '../../hooks/useAdaptiveTextSize';
import { useSunData } from '../../hooks/useSunData';
import { logger } from '../../lib/utils/secureLogger';

interface ResponsivePrimaryTimeDisplayProps {
  primaryTimeData: TimeZoneData | undefined;
  primaryLoading: boolean;
  timeFormat: '12h' | '24h';
  onTimeFormatChange: (format: '12h' | '24h') => void;
  serverConnected?: boolean;
}

export function ResponsivePrimaryTimeDisplay({ 
  primaryTimeData, 
  primaryLoading, 
  timeFormat, 
  onTimeFormatChange,
  serverConnected = false 
}: ResponsivePrimaryTimeDisplayProps) {
  const { isMobile, isTablet, isVerySmall } = useBreakpoint();
  
  // Charger les données d'astronomie
  const { sunData, loading: sunLoading } = useSunData(
    primaryTimeData?.timezone,
    serverConnected
  );

  const getDisplayTime = (data: TimeZoneData | undefined): FormattedTime => {
    if (!data) return { time: '--:--:--' };
    return LocalTimeApiService.formatTimeWithPeriod(data.datetime, timeFormat);
  };

  const isDaytime = (data: TimeZoneData | undefined) => {
    if (!data) return true;
    return LocalTimeApiService.isDaytimeFromISO(data.datetime);
  };

  const getSunInfo = () => {
    if (!sunData || sunLoading) {
      return '';
    }
    
    try {
      logger.debug('getSunInfo - sunData:', sunData, 'ResponsivePrimaryTimeDisplay');
      const dayLengthFormatted = LocalTimeApiService.formatDayLength(sunData.day_length);
      logger.debug('getSunInfo - dayLengthFormatted:', { dayLengthFormatted }, 'ResponsivePrimaryTimeDisplay');
      
      // Vérifier que les données de lever/coucher sont valides
      if (sunData.sunrise && sunData.sunset) {
        const result = `: ${sunData.sunrise} - ${sunData.sunset} (${dayLengthFormatted})`;
        logger.debug('getSunInfo - returning:', result, 'ResponsivePrimaryTimeDisplay');
        return result;
      }
      
      logger.warn('getSunInfo - no valid sunrise/sunset data', undefined, 'ResponsivePrimaryTimeDisplay');
      return '';
    } catch (error) {
      logger.error('Error formatting sun info:', error, 'ResponsivePrimaryTimeDisplay');
      return '';
    }
  };

  const displayTime = getDisplayTime(primaryTimeData);
  const timeText = primaryLoading ? 'Loading...' : displayTime.time;

  // Hook adaptatif pour la taille du texte
  const {
    getAdaptiveStyle,
    /* getAdaptiveClasses, */
    measureRef,
    fontSize
  } = useAdaptiveTextSize({
    text: timeText,
    timeFormat,
    containerPadding: isVerySmall ? 16 : isMobile ? 24 : isTablet ? 32 : 48,
    minFontSize: isVerySmall ? 27.2 : 40.8, // 85% des valeurs précédentes
    maxFontSize: isVerySmall ? 72.25 : isMobile ? 102 : isTablet ? 153 : 238 // 85% des valeurs précédentes
  });

  const getPeriodStyle = () => {
    const baseFontSize = fontSize * 0.90 * 0.5; // 50% de la taille principale réduite à 90%
    return {
      fontSize: `${baseFontSize}px`,
      verticalAlign: 'super' as const,
      marginLeft: isVerySmall ? '0.25rem' : isMobile ? '0.5rem' : '0.75rem'
    };
  };

  const getContainerClasses = () => {
    if (isVerySmall) {
      return "text-center mb-4 px-2";
    }
    if (isMobile) {
      return "text-center mb-6 px-2";
    }
    return "text-center mb-6 md:mb-8 px-2";
  };

  // Design mobile/tablette selon Figma
  if (isMobile || isTablet) {
    return (
      <div className="text-center space-y-5">
        {/* Conteneur de mesure invisible pour ajustements */}
        <div 
          ref={measureRef} 
          className="sr-only" 
          aria-hidden="true"
          style={{ position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap' }}
        />
        
        {/* Toggle 12h/24h */}
        <div className="flex justify-center">
          <TimeFormatToggle
            value={timeFormat}
            onChange={onTimeFormatChange}
          />
        </div>

        {/* Grande horloge */}
        <div className="time-display text-black font-[Space_Grotesk] overflow-hidden">
          {primaryLoading ? (
            <span 
              className="text-gray-400 font-[Space_Grotesk]"
              style={{
                fontSize: `${Math.min(fontSize * 0.3, 64)}px`,
                lineHeight: 1
              }}
            >
              Loading...
            </span>
          ) : (
            <div className="inline-flex items-baseline justify-center flex-wrap w-full">
              <span 
                className="font-[Space_Grotesk] leading-none"
                style={{
                  ...getAdaptiveStyle(),
                  fontSize: `${fontSize * 0.90}px`, // 90% de la taille adaptative
                  fontWeight: 500,
                  letterSpacing: '-0.02em'
                }}
              >
                {displayTime.time}
              </span>
              {displayTime.period && (
                <span 
                  className="font-[Space_Grotesk]"
                  style={getPeriodStyle()}
                >
                  {displayTime.period}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="text-center">
          <p className={`font-[Space_Grotesk] text-gray-600 ${isVerySmall ? 'text-xl' : 'text-2xl'} text-left`}>
            {formatDate(primaryTimeData)}
          </p>
        </div>

        {/* Information solaire */}
        <div className="text-center">
          <p className={`font-[Space_Grotesk] text-gray-600 ${isVerySmall ? 'text-sm' : 'text-base'} break-words text-left leading-relaxed`}>
            {isDaytime(primaryTimeData) ? 'Sun ☀️' : 'Moon 🌙'} {getSunInfo()}
          </p>
        </div>
      </div>
    );
  }

  // Layout desktop (inchangé)
  return (
    <div className={getContainerClasses()}>
      {/* Conteneur de mesure invisible pour ajustements */}
      <div 
        ref={measureRef} 
        className="sr-only" 
        aria-hidden="true"
        style={{ position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap' }}
      />
      
      <div className="time-display text-black font-[Space_Grotesk] overflow-hidden">
        {primaryLoading ? (
          <span 
            className="text-gray-400 font-[Space_Grotesk]"
            style={{
              fontSize: `${Math.min(fontSize * 0.3, 64)}px`,
              lineHeight: 1
            }}
          >
            Loading...
          </span>
        ) : (
          <div className="inline-flex items-baseline justify-center flex-nowrap w-full">
            <span 
              className="font-[Space_Grotesk] leading-none"
              style={{
                ...getAdaptiveStyle(),
                fontSize: `${fontSize * 0.90}px`, // 90% de la taille adaptative
                fontWeight: 500,
                letterSpacing: '-0.02em'
              }}
            >
              {displayTime.time}
            </span>
            {displayTime.period && (
              <span 
                className="font-[Space_Grotesk]"
                style={getPeriodStyle()}
              >
                {displayTime.period}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Tablet & Desktop Layout */}
      <div className="flex justify-between items-center text-gray-500 text-sm mt-4 px-2">
        <p className="text-left text-gray-400 text-sm md:text-base">Current</p>
        <div className="text-center">
          <p className="font-[Space_Grotesk] text-left text-sm md:text-base leading-relaxed">
            {isDaytime(primaryTimeData) ? 'Sun ☀️' : 'Moon 🌙'} {getSunInfo()}
          </p>
          <p className="font-[Space_Grotesk] text-sm md:text-base text-left">
            {formatDate(primaryTimeData)}
          </p>
        </div>
        <TimeFormatToggle
          value={timeFormat}
          onChange={onTimeFormatChange}
        />
      </div>
    </div>
  );
}