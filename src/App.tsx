import { useState, useEffect, useRef } from 'react';
import { CitySearchResult } from './lib/api/localTimeApi';
import { LocalTimeApiService } from './lib/api/localTimeApi';

// Hooks
import { useServerConnection } from './hooks/useServerConnection';
import { useUserPreferences } from './hooks/useUserPreferences';
import { useTimeZoneData } from './hooks/useTimeZoneData';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';
import { useBreakpoint } from './hooks/useBreakpoint';

// Components
import { Header } from './components/layout/Header';
import { ResponsiveAppHeader } from './components/layout/ResponsiveAppHeader';
import { StatusNotification } from './components/common/StatusNotification';
import { ResponsivePrimaryTimeDisplay } from './components/time/ResponsivePrimaryTimeDisplay';
import { ResponsiveCityInfoSection } from './components/city/ResponsiveCityInfoSection';
import { ResponsiveTimeZoneGrid } from './components/time/ResponsiveTimeZoneGrid';
import { Credits } from './components/common/Credits';
import { logger } from './lib/utils/secureLogger';


export default function App() {
  // État local
  const [selectedTimezone, setSelectedTimezone] = useState('London');
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('24h');
  const [showSearch, setShowSearch] = useState(false);
  const [userId] = useState(() => LocalTimeApiService.generateUserId());

  // Hooks personnalisés
  const serverConnection = useServerConnection();
  const { isMobile, isTablet, isVerySmall } = useBreakpoint();
  const { preferences, savePreferences } = useUserPreferences(userId, serverConnection.connected);
  const {
    timeZones,
    primaryTimeData,
    primaryLoading,
    loadTimeZoneDataFromServer,
    loadPrimaryTimeDataFromServer,
    updateRealTimeData,
    addCity
  } = useTimeZoneData(
    serverConnection.connected,
    userId,
    preferences?.favoriteCities
  );

  // Initialiser les préférences quand elles sont chargées
  useEffect(() => {
    if (preferences) {
      setSelectedTimezone(preferences.selectedCity);
      setTimeFormat(preferences.timeFormat);
    }
  }, [preferences]);

  // Charger les données initiales du serveur - utiliser un ref pour éviter les boucles
  const hasLoadedInitialData = useRef(new Set<string>());
  
  useEffect(() => {
    if (timeZones.length > 0 && serverConnection.connected) {
      timeZones.forEach((timezone, index) => {
        const key = `${timezone.timezone}-${index}`;
        if (timezone.loading && !hasLoadedInitialData.current.has(key)) {
          hasLoadedInitialData.current.add(key);
          loadTimeZoneDataFromServer(timezone, index);
        }
      });
    }
  }, [timeZones, serverConnection.connected, loadTimeZoneDataFromServer]);

  // Fonction de rafraîchissement des données serveur
  const refreshServerData = () => {
    const selectedTz = timeZones.find(tz => tz.city === selectedTimezone);
    if (selectedTz) {
      loadPrimaryTimeDataFromServer(selectedTz.timezone);
    }
    
    timeZones.forEach((timezone, index) => {
      loadTimeZoneDataFromServer(timezone, index);
    });
  };

  // Mises à jour en temps réel
  useRealTimeUpdates(
    () => updateRealTimeData(selectedTimezone),
    refreshServerData,
    serverConnection.connected
  );

  // Gestionnaire d'événements clavier pour fermer la modal avec Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSearch) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSearch]);

  // Gestionnaires d'événements
  const handleTimeFormatChange = (format: '12h' | '24h') => {
    setTimeFormat(format);
    savePreferences({ timeFormat: format });
  };

  const handleTimezoneSelection = (city: string) => {
    logger.info(`Selecting timezone: ${city}`, { city }, 'App');
    setSelectedTimezone(city);
    savePreferences({ selectedCity: city });
  };

  const handleCitySearch = async (city: CitySearchResult) => {
    const wasAdded = await addCity(city);
    
    if (wasAdded && preferences) {
      const updatedPreferences = {
        ...preferences,
        favoriteCities: [...preferences.favoriteCities, city.timezone]
      };
      savePreferences(updatedPreferences);
    }
    
    handleTimezoneSelection(city.name);
    setShowSearch(false);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
  };

  const selectedTimezoneData = timeZones.find(tz => tz.city === selectedTimezone);

  // Responsive container classes
  const getContainerClasses = () => {
    if (isVerySmall) {
      return "min-h-screen px-1 py-2";
    }
    if (isMobile) {
      return "min-h-screen px-2 py-4";
    }
    if (isTablet) {
      return "min-h-screen px-4 py-6";
    }
    return "min-h-screen px-4 py-8";
  };

  const getMainContainerClasses = () => {
    if (isVerySmall) {
      return "rounded-lg shadow-lg w-full p-3";
    }
    if (isMobile) {
      return "rounded-xl shadow-lg w-full p-4";
    }
    if (isTablet) {
      return "rounded-2xl shadow-lg w-full max-w-4xl p-6";
    }
    return "rounded-3xl shadow-lg w-full max-w-7xl p-8";
  };

  const getContentPadding = () => {
    if (isVerySmall) {
      return "p-3 rounded-lg";
    }
    if (isMobile) {
      return "p-4 rounded-xl";
    }
    if (isTablet) {
      return "p-6 rounded-xl";
    }
    return "p-8 rounded-2xl";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E64002' }}>
      {/* Header Search */}
      {showSearch && (
        <div className="relative z-50">
          <Header onCitySelect={handleCitySearch} onClose={handleCloseSearch} />
        </div>
      )}

      <div className={`${getContainerClasses()} flex items-center justify-center`}>
        <div className={getMainContainerClasses()} style={{ backgroundColor: '#e8e8e8' }}>
          
          {/* Header */}
          <ResponsiveAppHeader onSearchClick={() => setShowSearch(!showSearch)} />

          {/* Main Content */}
          <main>
            {/* Server Status */}
            <StatusNotification serverConnected={serverConnection.connected} />

            {/* Primary Time Display */}
            <ResponsivePrimaryTimeDisplay
              primaryTimeData={primaryTimeData}
              primaryLoading={primaryLoading}
              timeFormat={timeFormat}
              onTimeFormatChange={handleTimeFormatChange}
              serverConnected={serverConnection.connected}
            />

            {/* City Info Section */}
            <div className={`bg-[rgba(232,232,232,1)] ${getContentPadding()}`}>
              <ResponsiveCityInfoSection
                selectedTimezone={selectedTimezoneData}
                onAddCityClick={() => setShowSearch(true)}
              />

              {/* Time Zone Grid - Only show on desktop */}
              {!isMobile && !isTablet && (
                <ResponsiveTimeZoneGrid
                  timeZones={timeZones}
                  selectedTimezone={selectedTimezone}
                  timeFormat={timeFormat}
                  onTimezoneSelect={handleTimezoneSelection}
                />
              )}
            </div>
            
            {/* Credits Section */}
            <Credits />
          </main>
        </div>
      </div>
    </div>
  );
}