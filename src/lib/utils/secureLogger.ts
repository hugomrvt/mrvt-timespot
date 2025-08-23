/**
 * Service de logging sécurisé
 * - Ne logge que dans l'environnement de développement
 * - Filtre les informations sensibles (mots de passe, tokens, clés API)
 * - Fournit différents niveaux de log (info, warn, error, debug)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  component?: string;
}

class SecureLogger {
  private isDevelopment: boolean;
  private sensitiveKeys: string[];

  constructor() {
    this.isDevelopment = import.meta.env.DEV || import.meta.env.NODE_ENV === 'development';
    this.sensitiveKeys = [
      'password',
      'token',
      'apikey',
      'api_key',
      'secret',
      'auth',
      'authorization',
      'bearer',
      'key',
      'credential',
      'session'
    ];
  }

  /**
   * Filtre les données sensibles d'un objet
   */
  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = this.sensitiveKeys.some(sensitiveKey => 
        lowerKey.includes(sensitiveKey)
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Crée une entrée de log formatée
   */
  private createLogEntry(level: LogLevel, message: string, data?: any, component?: string): LogEntry {
    return {
      level,
      message,
      data: data ? this.sanitizeData(data) : undefined,
      timestamp: new Date().toISOString(),
      component
    };
  }

  /**
   * Méthode générique de logging
   */
  private log(level: LogLevel, message: string, data?: any, component?: string): void {
    if (!this.isDevelopment) {
      return;
    }

    const logEntry = this.createLogEntry(level, message, data, component);
    const prefix = component ? `[${component}]` : '';
    const logMessage = `${prefix} ${message}`;

    switch (level) {
      case 'error':
        console.error(logMessage, logEntry.data || '');
        break;
      case 'warn':
        console.warn(logMessage, logEntry.data || '');
        break;
      case 'debug':
        console.debug(logMessage, logEntry.data || '');
        break;
      case 'info':
      default:
        console.info(logMessage, logEntry.data || '');
        break;
    }
  }

  /**
   * Log d'information
   */
  info(message: string, data?: any, component?: string): void {
    this.log('info', message, data, component);
  }

  /**
   * Log d'avertissement
   */
  warn(message: string, data?: any, component?: string): void {
    this.log('warn', message, data, component);
  }

  /**
   * Log d'erreur
   */
  error(message: string, data?: any, component?: string): void {
    this.log('error', message, data, component);
  }

  /**
   * Log de debug
   */
  debug(message: string, data?: any, component?: string): void {
    this.log('debug', message, data, component);
  }

  /**
   * Log pour les performances
   */
  performance(operation: string, startTime: number, component?: string): void {
    const duration = performance.now() - startTime;
    this.debug(`Performance: ${operation} completed in ${duration.toFixed(2)}ms`, undefined, component);
  }

  /**
   * Log pour les erreurs réseau
   */
  networkError(url: string, error: any, component?: string): void {
    this.error(`Network error for ${url}`, { error: error.message || error }, component);
  }

  /**
   * Vérifie si le logging est activé
   */
  isEnabled(): boolean {
    return this.isDevelopment;
  }
}

// Instance singleton
export const logger = new SecureLogger();
export default logger;