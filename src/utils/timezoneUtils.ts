import { TimeZoneData } from '../services/localTimeApi';
import { 
  TIMEZONE_TO_COUNTRY_MAP, 
  TIMEZONE_FIX_MAP, 
  FALLBACK_OFFSETS, 
  FALLBACK_TIMEZONE_OFFSETS 
} from '../constants/timezones';
import { logger } from '../services/secureLogger';

export function getRealTimeForTimezone(timezone: string, preserveCountry?: string): TimeZoneData | undefined {
  try {
    const now = new Date();
    
    // Corriger le timezone s'il est dans la liste des problématiques
    const correctedTimezone = TIMEZONE_FIX_MAP[timezone] || timezone;
    
    // Obtenir l'heure locale dans le timezone spécifique
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: correctedTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(now);
    const timeInTimezone = new Date(
      parseInt(parts.find(part => part.type === 'year')!.value),
      parseInt(parts.find(part => part.type === 'month')!.value) - 1,
      parseInt(parts.find(part => part.type === 'day')!.value),
      parseInt(parts.find(part => part.type === 'hour')!.value),
      parseInt(parts.find(part => part.type === 'minute')!.value),
      parseInt(parts.find(part => part.type === 'second')!.value)
    );

    // Utiliser directement les valeurs pré-calculées des offsets corrects pour juillet 2025
    // C'est plus fiable que le calcul automatique qui peut être imprécis
    const utcOffsetString = FALLBACK_OFFSETS[correctedTimezone] || FALLBACK_OFFSETS[timezone] || 'UTC+0:00';
    
    const city = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
    
    // Utiliser le pays préservé s'il existe, sinon chercher dans le mapping, sinon fallback
    const country = preserveCountry || TIMEZONE_TO_COUNTRY_MAP[correctedTimezone] || TIMEZONE_TO_COUNTRY_MAP[timezone] || 'Unknown';
    
    return {
      city,
      country,
      timezone: timezone, // Garder le timezone original dans la réponse
      datetime: timeInTimezone.toISOString(),
      utc_offset: utcOffsetString.replace('UTC', ''), // Retirer 'UTC' pour avoir juste '+2:00' 
      utc_datetime: now.toISOString(),
      abbreviation: getTimezoneAbbreviation(correctedTimezone),
      dst: false
    };
  } catch (error) {
    logger.error(`Error generating real-time data for ${timezone}:`, error, 'timezoneUtils');
    
    // Fallback avec des données manuelles pour les timezones problématiques
    if (FALLBACK_TIMEZONE_OFFSETS[timezone] !== undefined) {
      logger.info(`Using fallback data for ${timezone}`, undefined, 'timezoneUtils');
      const now = new Date();
      const utcTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
      const offsetInMs = FALLBACK_TIMEZONE_OFFSETS[timezone] * 60 * 60 * 1000;
      const localTime = new Date(utcTime.getTime() + offsetInMs);
      
      const offsetHours = Math.floor(Math.abs(FALLBACK_TIMEZONE_OFFSETS[timezone]));
      const offsetMinutes = Math.round(Math.abs((FALLBACK_TIMEZONE_OFFSETS[timezone] % 1) * 60));
      const offsetSign = FALLBACK_TIMEZONE_OFFSETS[timezone] >= 0 ? '+' : '-';
      const utcOffsetString = `${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
      
      const city = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
      const country = preserveCountry || TIMEZONE_TO_COUNTRY_MAP[timezone] || 'Unknown';
      
      return {
        city,
        country,
        timezone,
        datetime: localTime.toISOString(),
        utc_offset: utcOffsetString,
        utc_datetime: utcTime.toISOString(),
        abbreviation: getTimezoneAbbreviation(timezone),
        dst: false
      };
    }
    
    return undefined;
  }
}

export function getTimezoneOffset(timezone: string): string {
  return FALLBACK_OFFSETS[timezone] || 'UTC+0';
}

export function formatDate(data: TimeZoneData | undefined): string {
  if (!data) return 'Loading...';
  const date = new Date(data.datetime);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getCityFromTimezone(timezone: string): string {
  return timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
}

export function getCountryFromTimezone(timezone: string): string {
  return TIMEZONE_TO_COUNTRY_MAP[timezone] || 'Unknown';
}

export function getTimezoneAbbreviation(timezone: string): string {
  // Mapping des timezones vers leurs abréviations pour juillet 2025
  const abbreviationMap: { [key: string]: string } = {
    // Americas (DST actif en juillet)
    'America/New_York': 'EDT',
    'America/Los_Angeles': 'PDT',
    'America/Chicago': 'CDT',
    'America/Denver': 'MDT',
    'America/Phoenix': 'MST',
    'America/Toronto': 'EDT',
    'America/Vancouver': 'PDT',
    'America/Mexico_City': 'CDT',
    'America/Sao_Paulo': 'BRT',
    'America/Argentina/Buenos_Aires': 'ART',
    'America/Lima': 'PET',
    'America/Bogota': 'COT',
    'America/Santiago': 'CLT',
    
    // Europe (DST actif en juillet)
    'Europe/London': 'BST',
    'Europe/Paris': 'CEST',
    'Europe/Berlin': 'CEST',
    'Europe/Rome': 'CEST',
    'Europe/Madrid': 'CEST',
    'Europe/Amsterdam': 'CEST',
    'Europe/Stockholm': 'CEST',
    'Europe/Zurich': 'CEST',
    'Europe/Vienna': 'CEST',
    'Europe/Brussels': 'CEST',
    'Europe/Copenhagen': 'CEST',
    'Europe/Helsinki': 'EEST',
    'Europe/Oslo': 'CEST',
    'Europe/Warsaw': 'CEST',
    'Europe/Prague': 'CEST',
    'Europe/Budapest': 'CEST',
    'Europe/Athens': 'EEST',
    'Europe/Istanbul': 'TRT',
    'Europe/Moscow': 'MSK',
    'Europe/Lisbon': 'WEST',
    
    // Asia (pas de DST pour la plupart)
    'Asia/Tokyo': 'JST',
    'Asia/Shanghai': 'CST',
    'Asia/Hong_Kong': 'HKT',
    'Asia/Kolkata': 'IST',
    'Asia/Singapore': 'SGT',
    'Asia/Dubai': 'GST',
    'Asia/Bangkok': 'ICT',
    'Asia/Jakarta': 'WIB',
    'Asia/Manila': 'PHT',
    'Asia/Seoul': 'KST',
    'Asia/Kuala_Lumpur': 'MYT',
    'Asia/Jerusalem': 'IDT',
    'Asia/Riyadh': 'AST',
    'Asia/Qatar': 'AST',
    
    // Africa
    'Africa/Cairo': 'EET',
    'Africa/Lagos': 'WAT',
    'Africa/Johannesburg': 'SAST',
    'Africa/Nairobi': 'EAT',
    'Africa/Casablanca': 'WEST',
    
    // Oceania (Hiver en juillet)
    'Australia/Sydney': 'AEST',
    'Australia/Melbourne': 'AEST',
    'Australia/Brisbane': 'AEST',
    'Australia/Perth': 'AWST',
    'Pacific/Auckland': 'NZST'
  };
  
  return abbreviationMap[timezone] || 'UTC';
}