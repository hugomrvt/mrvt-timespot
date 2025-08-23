import { useState, useEffect } from 'react';
import { LocalTimeApiService } from '../services/localTimeApi';
import { ServerConnectionState } from '../types';
import { logger } from '../services/secureLogger';

export function useServerConnection() {
  const [state, setState] = useState<ServerConnectionState>({
    connected: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        logger.info('Checking server connection...', undefined, 'useServerConnection');
        const isHealthy = await LocalTimeApiService.healthCheck();
        logger.info('Server health check:', { isHealthy }, 'useServerConnection');
        
        setState({
          connected: isHealthy,
          loading: false,
          error: isHealthy ? null : 'Server is offline'
        });
      } catch (error) {
        logger.error('Server connection error:', error, 'useServerConnection');
        setState({
          connected: false,
          loading: false,
          error: error instanceof Error ? error.message : 'Connection failed'
        });
      }
    };

    checkConnection();
  }, []);

  return state;
}