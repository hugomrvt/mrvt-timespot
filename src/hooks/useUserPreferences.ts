import { useState, useEffect, useCallback } from 'react';
import { LocalTimeApiService, UserPreferences } from '../lib/api/localTimeApi';
import { logger } from '../lib/utils/secureLogger';

export function useUserPreferences(userId: string, serverConnected: boolean) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!serverConnected) {
        setLoading(false);
        return;
      }

      try {
        const userPrefs = await LocalTimeApiService.getUserPreferences(userId);
        setPreferences(userPrefs);
      } catch (error) {
        logger.error('Failed to load user preferences:', error, 'useUserPreferences');
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [userId, serverConnected]);

  const savePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    if (!preferences) return;

    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    
    if (serverConnected) {
      try {
        await LocalTimeApiService.saveUserPreferences(userId, updatedPreferences);
      } catch (error) {
        logger.error('Failed to save user preferences:', error, 'useUserPreferences');
      }
    }
  }, [preferences, userId, serverConnected]);

  return {
    preferences,
    loading,
    savePreferences
  };
}