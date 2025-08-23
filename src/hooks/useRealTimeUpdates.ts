import { useState, useEffect } from 'react';
import { logger } from '../services/secureLogger';

export function useRealTimeUpdates(
  updateCallback: (currentTime: Date) => void,
  refreshServerData: () => void,
  serverConnected: boolean,
  interval: number = 1000,
  serverRefreshInterval: number = 300000 // 5 minutes
) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mettre à jour l'heure en temps réel
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      updateCallback(now);
    }, interval);

    return () => clearInterval(timer);
  }, [updateCallback, interval]);

  // Rafraîchir les données du serveur périodiquement
  useEffect(() => {
    if (!serverConnected) return;

    const refreshTimer = setInterval(() => {
      logger.info('Refreshing server timezone data...', undefined, 'useRealTimeUpdates');
      refreshServerData();
    }, serverRefreshInterval);

    return () => clearInterval(refreshTimer);
  }, [serverConnected, refreshServerData, serverRefreshInterval]);

  return currentTime;
}