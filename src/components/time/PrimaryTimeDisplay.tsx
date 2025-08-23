import { TimeZoneData, FormattedTime } from '../../lib/api/localTimeApi';
import { TimeFormatToggle } from './TimeFormatToggle';
import { formatDate } from '../../lib/utils/timezoneUtils';
import { LocalTimeApiService } from '../../lib/api/localTimeApi';

interface PrimaryTimeDisplayProps {
  primaryTimeData: TimeZoneData | undefined;
  primaryLoading: boolean;
  timeFormat: '12h' | '24h';
  onTimeFormatChange: (format: '12h' | '24h') => void;
}

export function PrimaryTimeDisplay({ 
  primaryTimeData, 
  primaryLoading, 
  timeFormat, 
  onTimeFormatChange 
}: PrimaryTimeDisplayProps) {
  const getDisplayTime = (data: TimeZoneData | undefined): FormattedTime => {
    if (!data) return { time: '--:--:--' };
    return LocalTimeApiService.formatTimeWithPeriod(data.datetime, timeFormat);
  };

  const isDaytime = (data: TimeZoneData | undefined) => {
    if (!data) return true;
    return LocalTimeApiService.isDaytimeFromISO(data.datetime);
  };

  return (
    <div className="text-center mb-8">
      <div className="time-display text-black font-[Space_Grotesk]">
        {primaryLoading ? (
          <span className="text-gray-400">Loading...</span>
        ) : (
          <div className="inline-flex items-baseline">
            <span className={timeFormat === '12h' ? 'text-[190px]' : 'text-[247px]'}>
              {getDisplayTime(primaryTimeData).time}
            </span>
            {getDisplayTime(primaryTimeData).period && (
              <span className="text-[50%] align-super ml-2">
                {getDisplayTime(primaryTimeData).period}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center text-gray-500 text-sm mt-4">
        <p className="text-left text-gray-400 text-[16px]">Current</p>
        <div className="text-center">
          <p className="font-[Space_Grotesk] text-left">
            {isDaytime(primaryTimeData) ? 'Sun ☀️' : 'Moon 🌙'} 
            {primaryTimeData && ` ${primaryTimeData.abbreviation}`}
            {primaryTimeData?.dst ? ' (DST)' : ''}
          </p>
          <p className="font-[Space_Grotesk] text-left">{formatDate(primaryTimeData)}</p>
        </div>
        <TimeFormatToggle
          value={timeFormat}
          onChange={onTimeFormatChange}
        />
      </div>
    </div>
  );
}