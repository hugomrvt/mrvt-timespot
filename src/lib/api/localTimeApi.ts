import { TIMEZONE_TO_COUNTRY_MAP } from '../../constants/timezones';
import timezoneDumpRaw from '../../../.docs/timezone.json';
import { logger } from '../utils/secureLogger';
import { 
  validateData, 
  timezoneSchema, 
  userPreferencesSchema, 
  sanitizeUserInput,
  coordinatesSchema 
} from '../utils/validation';

// Local data caches built from .docs/timezone.json
// The dump is an array of { key, value } entries like: time_cache_<TZ>, sun_cache_<TZ>, user_preferences_<USERID>
type DumpEntry = { key: string; value: any };

// Safely parse the imported JSON data
const timezoneDump = (() => {
  try {
    // Handle both direct array and default export scenarios
    const data = timezoneDumpRaw && typeof timezoneDumpRaw === 'object' 
      ? (timezoneDumpRaw as any).default || timezoneDumpRaw 
      : timezoneDumpRaw;
    
    if (Array.isArray(data)) {
      return data as DumpEntry[];
    }
    
    logger.warn('Timezone dump is not an array, using empty array as fallback');
    return [];
  } catch (error) {
    logger.error('Failed to parse timezone dump:', error);
    return [];
  }
})();

const DUMP: DumpEntry[] = timezoneDump;
const TIME_CACHE = new Map<string, any>();
const SUN_CACHE = new Map<string, any>();
const PREF_CACHE = new Map<string, any>();
for (const { key, value } of DUMP) {
  if (key.startsWith('time_cache_')) {
    TIME_CACHE.set(key.substring('time_cache_'.length), value);
  } else if (key.startsWith('sun_cache_')) {
    SUN_CACHE.set(key.substring('sun_cache_'.length), value);
  } else if (key.startsWith('user_preferences_')) {
    PREF_CACHE.set(key.substring('user_preferences_'.length), value);
  }
}

export interface TimeZoneData {
  city: string;
  country: string;
  timezone: string;
  datetime: string;
  utc_offset: string;
  utc_datetime: string;
  abbreviation: string;
  dst: boolean;
}

export interface CitySearchResult {
  name: string;
  country: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

export interface UserPreferences {
  selectedCity: string;
  timeFormat: '12h' | '24h';
  favoriteCities: string[];
}

export interface FormattedTime {
  time: string;
  period?: string; // AM/PM pour le format 12h
}

export interface SunData {
  sunrise?: string;
  sunset?: string;
  solar_noon?: string;
  day_length?: string;
  civil_twilight_begin?: string;
  civil_twilight_end?: string;
  nautical_twilight_begin?: string;
  nautical_twilight_end?: string;
  astronomical_twilight_begin?: string;
  astronomical_twilight_end?: string;
}

function toCityNameFromTimezone(tz: string): string {
  return tz.split('/').pop()?.replace(/_/g, ' ') || tz;
}

function normalizeDayLength(val: any): string | undefined {
  if (val === undefined || val === null) return undefined;
  if (typeof val === 'number') {
    const total = Math.max(0, Math.floor(val));
    const h = Math.floor(total / 3600).toString().padStart(2, '0');
    const m = Math.floor((total % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(total % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
  if (typeof val === 'string') return val;
  return undefined;
}

export class LocalTimeApiService {
  // Mapping conservé pour compatibilité avec les noms de villes
  private static readonly cityToTimezoneMap: { [key: string]: string } = {
    'Los Angeles': 'America/Los_Angeles',
    'New York': 'America/New_York',
    'Chicago': 'America/Chicago',
    'Denver': 'America/Denver',
    'London': 'Europe/London',
    'Paris': 'Europe/Paris',
    'Berlin': 'Europe/Berlin',
    'Rome': 'Europe/Rome',
    'Madrid': 'Europe/Madrid',
    'Amsterdam': 'Europe/Amsterdam',
    'Stockholm': 'Europe/Stockholm',
    'Zurich': 'Europe/Zurich',
    'Tokyo': 'Asia/Tokyo',
    'Shanghai': 'Asia/Shanghai',
    'Mumbai': 'Asia/Kolkata',
    'Delhi': 'Asia/Kolkata',
    'Singapore': 'Asia/Singapore',
    'Sydney': 'Australia/Sydney',
    'Dubai': 'Asia/Dubai',
    'Cairo': 'Africa/Cairo',
    'Toronto': 'America/Toronto',
    'Vancouver': 'America/Vancouver',
    'Mexico City': 'America/Mexico_City',
    'São Paulo': 'America/Sao_Paulo',
    'Auckland': 'Pacific/Auckland'
  };

  private static normalizeTimezone(timezone: string): string {
    if (timezone.includes('/')) return timezone;
    return this.cityToTimezoneMap[timezone] || timezone;
  }

  static async getTimeData(timezone: string): Promise<TimeZoneData> {
    // Valider et sanitiser l'entrée timezone
    const sanitizedTimezone = sanitizeUserInput(timezone);
    const validatedTimezone = validateData(timezoneSchema, sanitizedTimezone, 'getTimeData');
    
    if (!validatedTimezone) {
      logger.error('Invalid timezone provided', { timezone }, 'LocalTimeApiService');
      throw new Error(`Invalid timezone format: ${timezone}`);
    }

    const normalized = this.normalizeTimezone(validatedTimezone);
    const cached = TIME_CACHE.get(normalized);
    if (!cached) {
      throw new Error(`No local time data for ${normalized}`);
    }
    return {
      city: cached.city ?? toCityNameFromTimezone(normalized),
      country: cached.country ?? (TIMEZONE_TO_COUNTRY_MAP[normalized] || 'Unknown'),
      timezone: normalized,
      datetime: cached.datetime ?? new Date().toISOString(),
      utc_offset: typeof cached.utc_offset === 'string' ? cached.utc_offset : '+00:00',
      utc_datetime: cached.utc_datetime ?? new Date().toISOString(),
      abbreviation: cached.abbreviation ?? 'UTC',
      dst: Boolean(cached.dst)
    };
  }

  static async searchCities(query: string): Promise<CitySearchResult[]> {
    // Sanitiser la requête de recherche
    const sanitizedQuery = sanitizeUserInput(query);
    const q = sanitizedQuery.trim().toLowerCase();
    
    if (sanitizedQuery.length > 100) {
      logger.warn('Search query too long, truncated', { originalLength: query.length }, 'LocalTimeApiService');
    }
    const results: CitySearchResult[] = Object.keys(TIMEZONE_TO_COUNTRY_MAP).map((tz) => ({
      name: toCityNameFromTimezone(tz),
      country: TIMEZONE_TO_COUNTRY_MAP[tz] || 'Unknown',
      timezone: tz,
      latitude: 0,
      longitude: 0,
    }));
    if (!q) return results.slice(0, 20);
    return results
      .filter((r) => r.name.toLowerCase().includes(q) || r.timezone.toLowerCase().includes(q) || r.country.toLowerCase().includes(q))
      .slice(0, 20);
  }

  static async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const key = `user_preferences_${userId}`;
      const fromLocal = localStorage.getItem(key);
      if (fromLocal) return JSON.parse(fromLocal) as UserPreferences;

      const fromDump = PREF_CACHE.get(userId);
      if (fromDump) return fromDump as UserPreferences;
    } catch (e) {
      // ignore parse errors and fall back to defaults
    }
    return {
      selectedCity: 'London',
      timeFormat: '24h',
      favoriteCities: ['Europe/London', 'America/New_York', 'America/Los_Angeles', 'Europe/Paris']
    };
  }

  static async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<boolean> {
    try {
      // Sanitiser l'userId
      const sanitizedUserId = sanitizeUserInput(userId);
      if (!sanitizedUserId || sanitizedUserId.length > 50) {
        logger.error('Invalid userId provided', { userId }, 'LocalTimeApiService');
        return false;
      }

      // Valider les préférences avec Zod
      const validatedPreferences = validateData(userPreferencesSchema, preferences, 'saveUserPreferences');
      if (!validatedPreferences) {
        logger.error('Invalid user preferences provided', { preferences }, 'LocalTimeApiService');
        return false;
      }

      const key = `user_preferences_${sanitizedUserId}`;
      localStorage.setItem(key, JSON.stringify(validatedPreferences));
      return true;
    } catch (e) {
      logger.error('Error saving preferences to localStorage:', e, 'LocalTimeApiService');
      return false;
    }
  }

  static async addFavoriteCity(userId: string, city: string, timezone: string): Promise<boolean> {
    try {
      const prefs = await this.getUserPreferences(userId);
      const set = new Set(prefs.favoriteCities);
      set.add(timezone);
      const updated: UserPreferences = { ...prefs, favoriteCities: Array.from(set) };
      return await this.saveUserPreferences(userId, updated);
    } catch (e) {
      logger.error('Error adding favorite city:', e, 'LocalTimeApiService');
      return false;
    }
  }

  static async healthCheck(): Promise<boolean> {
    // Plus d'appel réseau : on considère toujours l\'app "connectée" au service local
    return true;
  }

  static formatTimeFromISO(isoString: string, format: '12h' | '24h'): string {
    const date = new Date(isoString);
    if (format === '12h') {
      return date.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } else {
      return date.toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  }

  static formatTimeWithPeriod(isoString: string, format: '12h' | '24h'): FormattedTime {
    const date = new Date(isoString);
    if (format === '12h') {
      const timeString = date.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const parts = timeString.split(' ');
      return { time: parts[0], period: parts[1] };
    } else {
      return {
        time: date.toLocaleTimeString('en-GB', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      };
    }
  }

  static formatUtcOffset(utcOffset: string): string {
    if (!utcOffset) return 'UTC+0:00';
    let cleanOffset = utcOffset.trim();
    if (cleanOffset.startsWith('UTC')) return cleanOffset;
    if (!cleanOffset.startsWith('+') && !cleanOffset.startsWith('-')) cleanOffset = '+' + cleanOffset;
    if (cleanOffset.length === 3) cleanOffset += ':00';
    else if (cleanOffset.length === 4 && !cleanOffset.includes(':')) cleanOffset += ':00';
    return 'UTC' + cleanOffset;
  }

  static getShortTimeFromISO(isoString: string, format: '12h' | '24h' = '24h'): FormattedTime {
    const date = new Date(isoString);
    if (format === '12h') {
      const timeString = date.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      });
      const parts = timeString.split(' ');
      return { time: parts[0], period: parts[1] };
    } else {
      return {
        time: date.toLocaleTimeString('en-GB', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    }
  }

  static isDaytimeFromISO(isoString: string): boolean {
    const hours = new Date(isoString).getHours();
    return hours >= 6 && hours < 18;
  }

  static async getSunData(timezone: string): Promise<SunData> {
    const normalized = this.normalizeTimezone(timezone);
    const cached = SUN_CACHE.get(normalized);
    if (!cached) {
      throw new Error(`No local sun data for ${normalized}`);
    }
    return {
      sunrise: this.formatSunTime(cached.sunrise, normalized),
      sunset: this.formatSunTime(cached.sunset, normalized),
      solar_noon: this.formatSunTime(cached.solar_noon, normalized),
      day_length: normalizeDayLength(cached.day_length),
      civil_twilight_begin: this.formatSunTime(cached.civil_twilight_begin, normalized),
      civil_twilight_end: this.formatSunTime(cached.civil_twilight_end, normalized),
      nautical_twilight_begin: this.formatSunTime(cached.nautical_twilight_begin, normalized),
      nautical_twilight_end: this.formatSunTime(cached.nautical_twilight_end, normalized),
      astronomical_twilight_begin: this.formatSunTime(cached.astronomical_twilight_begin, normalized),
      astronomical_twilight_end: this.formatSunTime(cached.astronomical_twilight_end, normalized),
    };
  }

  static formatDayLength(dayLength: string | undefined | null): string {
    if (!dayLength || typeof dayLength !== 'string' || dayLength.trim() === '') {
      return 'N/A';
    }
    const parts = dayLength.trim().split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && minutes >= 0) {
        return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
      }
    }
    return dayLength.trim();
  }

  static formatSunTime(isoString: string | undefined, timezone: string): string {
    if (!isoString) return 'N/A';
    
    try {
      // Convertir le timestamp UTC vers l'heure locale du fuseau horaire
      const date = new Date(isoString);
      
      // Utiliser Intl.DateTimeFormat pour formater selon le fuseau horaire
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      return formatter.format(date);
    } catch (error) {
      logger.error('Error formatting sun time:', error, 'LocalTimeApiService');
      return 'N/A';
    }
  }

  static generateUserId(): string {
    const stored = localStorage.getItem('timespot_user_id');
    if (stored) return stored;
    const newId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('timespot_user_id', newId);
    return newId;
  }
}