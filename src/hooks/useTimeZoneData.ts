import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { LocalTimeApiService, TimeZoneData, CitySearchResult } from '../services/localTimeApi';
import { ExtendedTimeZone } from '../types';
import { getRealTimeForTimezone } from '../utils/timezoneUtils';
import { DEFAULT_TIMEZONES, TIMEZONE_TO_COUNTRY_MAP } from '../constants/timezones';
import { logger } from '../services/secureLogger';

export function useTimeZoneData(
  serverConnected: boolean,
  userId: string,
  favoriteCities: string[] = []
) {
  const [timeZones, setTimeZones] = useState<ExtendedTimeZone[]>([]);
  const [primaryTimeData, setPrimaryTimeData] = useState<TimeZoneData | undefined>(undefined);
  const [primaryLoading, setPrimaryLoading] = useState(true);
  
  // Mémoriser favoriteCities pour éviter les re-renders inutiles
  const stableFavoriteCities = useMemo(() => favoriteCities, [favoriteCities]);
  
  // Ref pour éviter les appels multiples d'initialisation
  const isInitialized = useRef(false);

  // Initialiser les time zones depuis les favoris ou données par défaut
  useEffect(() => {
    // Éviter la réinitialisation si déjà fait
    if (isInitialized.current) return;
    
    if (stableFavoriteCities.length > 0) {
      const initialTimeZones = stableFavoriteCities.map(timezone => {
        const cityName = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
        const countryName = TIMEZONE_TO_COUNTRY_MAP[timezone] || 'Loading...';
        
        // Toujours charger les données temps réel comme fallback
        const realTimeData = getRealTimeForTimezone(timezone, countryName !== 'Loading...' ? countryName : undefined);
        
        return {
          city: cityName,
          country: countryName,
          timezone: timezone,
          loading: serverConnected,
          data: realTimeData // Toujours avoir des données temps réel comme fallback
        };
      });
      setTimeZones(initialTimeZones);
    } else {
      // Utiliser les données par défaut avec temps réel
      const timezonesWithData = DEFAULT_TIMEZONES.map(tz => {
        const realTimeData = getRealTimeForTimezone(tz.timezone, tz.country);
        return {
          ...tz,
          data: realTimeData,
          loading: false
        };
      });
      setTimeZones(timezonesWithData);
      setPrimaryLoading(false);
    }
    
    isInitialized.current = true;
  }, [stableFavoriteCities, serverConnected]);

  // Charger les données d'une timezone depuis le serveur
  const loadTimeZoneDataFromServer = useCallback(async (timezone: ExtendedTimeZone, index: number) => {
    if (!serverConnected) return;

    setTimeZones(prev => prev.map((tz, i) => 
      i === index ? { ...tz, loading: true, error: undefined } : tz
    ));

    try {
      const data = await LocalTimeApiService.getTimeData(timezone.timezone);
      setTimeZones(prev => prev.map((tz, i) => 
        i === index ? { ...tz, data, loading: false } : tz
      ));
    } catch (error) {
      logger.error(`Failed to load time data for ${timezone.timezone}:`, error, 'useTimeZoneData');
      // Fallback vers l'heure temps réel en cas d'erreur
      const preserveCountry = timezone.country !== 'Loading...' ? timezone.country : undefined;
      const realTimeData = getRealTimeForTimezone(timezone.timezone, preserveCountry);
      if (realTimeData) {
        setTimeZones(prev => prev.map((tz, i) => 
          i === index ? { ...tz, data: realTimeData, loading: false } : tz
        ));
      } else {
        setTimeZones(prev => prev.map((tz, i) => 
          i === index ? { ...tz, loading: false, error: 'Failed to load' } : tz
        ));
      }
    }
  }, [serverConnected]);

  // Charger les données de la timezone primaire depuis le serveur
  const loadPrimaryTimeDataFromServer = useCallback(async (timezone: string) => {
    if (!serverConnected) return;

    setPrimaryLoading(true);
    try {
      const data = await LocalTimeApiService.getTimeData(timezone);
      setPrimaryTimeData(data);
    } catch (error) {
      logger.error('Failed to load primary time data:', error, 'useTimeZoneData');
      // Fallback vers l'heure temps réel en préservant le pays
      setTimeZones(currentTimeZones => {
        const selectedTz = currentTimeZones.find(tz => tz.timezone === timezone);
        const preserveCountry = selectedTz?.country !== 'Loading...' ? selectedTz?.country : undefined;
        const realTimeData = getRealTimeForTimezone(timezone, preserveCountry);
        if (realTimeData) {
          setPrimaryTimeData(realTimeData);
        }
        return currentTimeZones; // Pas de changement aux timezones
      });
    } finally {
      setPrimaryLoading(false);
    }
  }, [serverConnected]);

  // Mettre à jour toutes les données temps réel
  const updateRealTimeData = useCallback((selectedTimezone: string) => {
    setTimeZones(currentTimeZones => {
      // Mettre à jour la timezone principale
      const selectedTz = currentTimeZones.find(tz => tz.city === selectedTimezone);
      if (selectedTz) {
        const realTimeData = getRealTimeForTimezone(selectedTz.timezone, selectedTz.country !== 'Loading...' ? selectedTz.country : undefined);
        if (realTimeData) {
          setPrimaryTimeData(realTimeData);
          setPrimaryLoading(false);
        }
      }

      // Mettre à jour toutes les cartes de fuseaux horaires
      if (currentTimeZones.length > 0) {
        return currentTimeZones.map(timezone => {
          if (timezone.loading) return timezone;
          
          const preserveCountry = timezone.country !== 'Loading...' ? timezone.country : undefined;
          const realTimeData = getRealTimeForTimezone(timezone.timezone, preserveCountry);
          if (realTimeData) {
            return { ...timezone, data: realTimeData, loading: false };
          }
          return timezone;
        });
      }
      
      return currentTimeZones;
    });
  }, []);

  // Ajouter une nouvelle ville
  const addCity = useCallback(async (city: CitySearchResult): Promise<boolean> => {
    let wasAdded = false;
    
    setTimeZones(currentTimeZones => {
      // Vérifier si la ville n'existe pas déjà
      const exists = currentTimeZones.some(tz => tz.timezone === city.timezone);
      if (exists) {
        return currentTimeZones;
      }

      const newTimeZone: ExtendedTimeZone = {
        city: city.name,
        country: city.country,
        timezone: city.timezone,
        loading: serverConnected,
        data: getRealTimeForTimezone(city.timezone, city.country) // Toujours avoir des données temps réel
      };

      wasAdded = true;
      const newTimeZones = [...currentTimeZones, newTimeZone];
      
      // Si le serveur est connecté, essayer de charger les données en arrière-plan
      if (serverConnected) {
        const newIndex = currentTimeZones.length;
        LocalTimeApiService.getTimeData(city.timezone)
          .then(data => {
            setTimeZones(prev => prev.map((tz, i) => 
              i === newIndex ? { ...tz, data, loading: false } : tz
            ));
          })
          .catch(error => {
            logger.error('Failed to load city data from server:', error, 'useTimeZoneData');
            setTimeZones(prev => prev.map((tz, i) => 
              i === newIndex ? { ...tz, loading: false } : tz
            ));
          });

        // Ajouter aux favoris
        LocalTimeApiService.addFavoriteCity(userId, city.name, city.timezone)
          .catch(error => {
            logger.warn('Failed to save favorite to server:', error, 'useTimeZoneData');
          });
      }
      
      return newTimeZones;
    });

    return wasAdded;
  }, [serverConnected, userId]);

  return {
    timeZones,
    primaryTimeData,
    primaryLoading,
    setTimeZones,
    setPrimaryTimeData,
    setPrimaryLoading,
    loadTimeZoneDataFromServer,
    loadPrimaryTimeDataFromServer,
    updateRealTimeData,
    addCity
  };
}