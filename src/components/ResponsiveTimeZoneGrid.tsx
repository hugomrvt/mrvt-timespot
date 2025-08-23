import { TimeZoneCard } from './TimeZoneCard';
import { ExtendedTimeZone } from '../types';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface ResponsiveTimeZoneGridProps {
  timeZones: ExtendedTimeZone[];
  selectedTimezone: string;
  timeFormat: '12h' | '24h';
  onTimezoneSelect: (city: string) => void;
}

export function ResponsiveTimeZoneGrid({ 
  timeZones, 
  selectedTimezone, 
  timeFormat, 
  onTimezoneSelect 
}: ResponsiveTimeZoneGridProps) {
  const { isMobile, isTablet } = useBreakpoint();

  // Responsive grid classes
  const getGridClass = () => {
    if (isMobile) return 'grid grid-cols-1 gap-3';
    if (isTablet) return 'grid grid-cols-2 gap-4';
    return 'grid grid-cols-1 md:grid-cols-4 gap-4';
  };

  return (
    <div className={getGridClass()}>
      {timeZones.map((timezone, index) => {
        return (
          <TimeZoneCard
            key={`${timezone.timezone}-${index}`}
            timezone={timezone}
            timeFormat={timeFormat}
            isSelected={timezone.city === selectedTimezone}
            onClick={() => onTimezoneSelect(timezone.city)}
            isMobile={isMobile}
            isTablet={isTablet}
          />
        );
      })}
    </div>
  );
}