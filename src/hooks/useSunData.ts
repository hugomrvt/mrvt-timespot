import { useState, useEffect, useRef, useCallback } from 'react';
import { LocalTimeApiService, SunData } from '../services/localTimeApi';
import { logger } from '../services/secureLogger';

interface UseSunDataReturn {
  sunData: SunData | null;
  loading: boolean;
  error: string | null;
  refreshSunData: () => void;
}

export function useSunData(
  timezone: string | undefined,
  serverConnected: boolean
): UseSunDataReturn {
  const [sunData, setSunData] = useState<SunData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastTimezone = useRef<string | undefined>(undefined);

  const fetchSunData = useCallback(async (tz: string) => {
    if (!serverConnected) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      logger.info(`Fetching sun data for timezone: ${tz}`, undefined, 'useSunData');
      const data = await LocalTimeApiService.getSunData(tz);
      
      // Valider que les données sont utilisables
      if (data && (data.sunrise || data.sunset || data.day_length)) {
        setSunData(data);
        logger.debug(`Sun data fetched successfully:`, data, 'useSunData');
      } else {
        logger.warn('Invalid sun data received:', data, 'useSunData');
        setError('Invalid sun data received');
        setSunData(null);
      }
    } catch (error) {
      logger.error('Error fetching sun data:', error, 'useSunData');
      setError(error instanceof Error ? error.message : 'Unknown error');
      setSunData(null);
    } finally {
      setLoading(false);
    }
  }, [serverConnected]);

  const refreshSunData = () => {
    if (timezone) {
      fetchSunData(timezone);
    }
  };

  // Fetch sun data when timezone changes or server connects
  useEffect(() => {
    if (timezone && serverConnected && timezone !== lastTimezone.current) {
      lastTimezone.current = timezone;
      fetchSunData(timezone);
    }
  }, [timezone, serverConnected, fetchSunData]);

  return {
    sunData,
    loading,
    error,
    refreshSunData
  };
}