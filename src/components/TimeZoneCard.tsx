import { ExtendedTimeZone } from '../types';
import { LocalTimeApiService, FormattedTime } from '../services/localTimeApi';
import { getTimezoneOffset } from '../utils/timezoneUtils';

interface TimeZoneCardProps {
  timezone: ExtendedTimeZone;
  timeFormat: '12h' | '24h';
  isSelected: boolean;
  onClick: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
}

export function TimeZoneCard({
  timezone,
  timeFormat,
  isSelected,
  onClick,
  isMobile = false,
  isTablet = false
}: TimeZoneCardProps) {
  // Extraire les données de l'API depuis l'objet timezone
  const getDisplayTime = (): FormattedTime => {
    if (timezone.loading) return { time: '--:--' };
    if (timezone.error) return { time: 'Error' };
    if (!timezone.data) {
      return { time: '--:--' };
    }
    
    return LocalTimeApiService.getShortTimeFromISO(timezone.data.datetime, timeFormat);
  };

  const getUtcOffset = (): string => {
    if (timezone.loading) return 'Loading...';
    if (timezone.error) return 'Error';
    if (timezone.data?.utc_offset) {
      return LocalTimeApiService.formatUtcOffset(timezone.data.utc_offset);
    }
    return getTimezoneOffset(timezone.timezone);
  };

  const isDaytime = (): boolean => {
    if (!timezone.data) return true;
    return LocalTimeApiService.isDaytimeFromISO(timezone.data.datetime);
  };

  const getCity = (): string => {
    return timezone.city;
  };

  const displayTime = getDisplayTime();
  const utcOffset = getUtcOffset();
  const dayTime = isDaytime();
  const city = getCity();

  // Responsive spacing and sizing
  const getPadding = () => {
    if (isMobile) return 'p-4';
    if (isTablet) return 'p-5';
    return 'p-4';
  };

  const getTimeSize = () => {
    if (isMobile) return 'text-[clamp(1.25rem,5vw,2rem)]'; // Adaptatif pour mobile
    if (isTablet) return 'text-[clamp(1.5rem,4vw,2.25rem)]'; // Adaptatif pour tablette
    return 'text-[clamp(1.75rem,3vw,2rem)]'; // Adaptatif pour desktop
  };

  const getMarginTop = () => {
    if (isMobile) return 'mt-8';
    if (isTablet) return 'mt-12';
    return 'mt-[64px]';
  };

  // Affichage d'informations de debug pour les données de l'API (en mode développement)
  // const shouldShowDebugInfo = process.env.NODE_ENV === 'development' && timezone.data;

  return (
    <div
      onClick={onClick}
      className={`
        ${getPadding()} rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg min-h-[120px] md:min-h-[140px]
        ${isSelected 
          ? 'bg-black text-white' 
          : 'text-black hover:opacity-90'
        }
      `}
      style={!isSelected ? { 
        backgroundColor: '#E8E8E8', 
        border: '1px solid #ffffff' 
      } : undefined}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <p className={`font-normal font-[Space_Grotesk] ${isMobile ? 'text-sm' : 'text-base'} ${isSelected ? 'text-white' : 'text-[rgba(0,0,0,)]'}`}>
          {city}
        </p>
        <p className={`${isMobile ? 'text-xs' : 'text-xs'} font-[Space_Grotesk] ${
          isSelected 
            ? 'text-gray-300' 
            : 'text-gray-500'
        }`}>
          {utcOffset}
        </p>
      </div>

      {/* Time Display and Day/Night Indicator */}
      <div className={`flex items-center justify-between ${getMarginTop()}`}>
        {/* Time Display */}
        <div className={`${getTimeSize()} font-semibold font-[Space_Grotesk] max-w-full overflow-hidden`}>
          {timezone.loading ? (
            <span className="text-gray-400 animate-pulse">Loading...</span>
          ) : timezone.error ? (
            <span className="text-red-400">Error</span>
          ) : (
            <>
              <span 
                className="font-normal leading-none" 
                style={{ 
                  display: 'inline-block',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {displayTime.time}
              </span>
              {displayTime.period && (
                <span 
                  className="text-[60%] align-super ml-1"
                  style={{ flexShrink: 0 }}
                >
                  {displayTime.period}
                </span>
              )}
            </>
          )}
        </div>

        {/* Day/Night Indicator */}
        <div className="flex items-center">
          {timezone.loading ? (
            <span className="text-gray-400 animate-pulse">⏳</span>
          ) : timezone.error ? (
            <span className="text-red-400">❌</span>
          ) : dayTime ? (
            <>
              <span className="mr-1 text-sm">☀️</span>
              {!isMobile && (
                <p className={`text-xs md:text-sm ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                  Day
                </p>
              )}
            </>
          ) : (
            <>
              <span className="mr-1 text-sm">🌙</span>
              {!isMobile && (
                <p className={`text-xs md:text-sm ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                  Night
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}