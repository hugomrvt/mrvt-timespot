export const TIMEZONE_TO_COUNTRY_MAP: { [key: string]: string } = {
  'America/New_York': 'United States',
  'America/Los_Angeles': 'United States',
  'America/Chicago': 'United States',
  'America/Denver': 'United States',
  'America/Phoenix': 'United States',
  'America/Toronto': 'Canada',
  'America/Vancouver': 'Canada',
  'America/Mexico_City': 'Mexico',
  'America/Sao_Paulo': 'Brazil',
  'America/Argentina/Buenos_Aires': 'Argentina',
  'America/Lima': 'Peru',
  'America/Bogota': 'Colombia',
  'America/Santiago': 'Chile',
  'Europe/London': 'United Kingdom',
  'Europe/Paris': 'France',
  'Europe/Berlin': 'Germany',
  'Europe/Rome': 'Italy',
  'Europe/Madrid': 'Spain',
  'Europe/Amsterdam': 'Netherlands',
  'Europe/Stockholm': 'Sweden',
  'Europe/Zurich': 'Switzerland',
  'Europe/Vienna': 'Austria',
  'Europe/Brussels': 'Belgium',
  'Europe/Copenhagen': 'Denmark',
  'Europe/Helsinki': 'Finland',
  'Europe/Oslo': 'Norway',
  'Europe/Warsaw': 'Poland',
  'Europe/Prague': 'Czech Republic',
  'Europe/Budapest': 'Hungary',
  'Europe/Athens': 'Greece',
  'Europe/Istanbul': 'Turkey',
  'Europe/Moscow': 'Russia',
  'Europe/Lisbon': 'Portugal',
  'Asia/Tokyo': 'Japan',
  'Asia/Shanghai': 'China',
  'Asia/Hong_Kong': 'Hong Kong',
  'Asia/Kolkata': 'India',
  'Asia/Singapore': 'Singapore',
  'Asia/Dubai': 'United Arab Emirates',
  'Asia/Bangkok': 'Thailand',
  'Asia/Jakarta': 'Indonesia',
  'Asia/Manila': 'Philippines',
  'Asia/Seoul': 'South Korea',
  'Asia/Kuala_Lumpur': 'Malaysia',
  'Asia/Jerusalem': 'Israel',
  'Asia/Riyadh': 'Saudi Arabia',
  'Asia/Qatar': 'Qatar',
  'Australia/Sydney': 'Australia',
  'Australia/Melbourne': 'Australia',
  'Australia/Brisbane': 'Australia',
  'Australia/Perth': 'Australia',
  'Africa/Cairo': 'Egypt',
  'Africa/Lagos': 'Nigeria',
  'Africa/Johannesburg': 'South Africa',
  'Africa/Nairobi': 'Kenya',
  'Africa/Casablanca': 'Morocco',
  'Pacific/Auckland': 'New Zealand'
};

export const TIMEZONE_FIX_MAP: { [key: string]: string } = {
  'Asia/Mumbai': 'Asia/Kolkata',
  'Asia/Delhi': 'Asia/Kolkata',
  'Asia/Calcutta': 'Asia/Kolkata',
};

export const FALLBACK_OFFSETS: { [key: string]: string } = {
  // Americas (DST actif en juillet 2025)
  'America/New_York': 'UTC-4',        // EDT (Été)
  'America/Los_Angeles': 'UTC-7',     // PDT (Été)
  'America/Chicago': 'UTC-5',         // CDT (Été)
  'America/Denver': 'UTC-6',          // MDT (Été)
  'America/Phoenix': 'UTC-7',         // MST (Pas de DST)
  'America/Toronto': 'UTC-4',         // EDT (Été)
  'America/Vancouver': 'UTC-7',       // PDT (Été)
  'America/Mexico_City': 'UTC-5',     // CDT (Été)
  'America/Sao_Paulo': 'UTC-3',       // BRT (Pas de DST)
  'America/Argentina/Buenos_Aires': 'UTC-3', // ART (Pas de DST)
  'America/Lima': 'UTC-5',            // PET (Pas de DST)
  'America/Bogota': 'UTC-5',          // COT (Pas de DST)
  'America/Santiago': 'UTC-4',        // CLT (Hiver austral)
  
  // Europe (DST actif en juillet 2025)
  'Europe/London': 'UTC+1',           // BST (Été)
  'Europe/Paris': 'UTC+2',            // CEST (Été)
  'Europe/Berlin': 'UTC+2',           // CEST (Été)
  'Europe/Rome': 'UTC+2',             // CEST (Été)
  'Europe/Madrid': 'UTC+2',           // CEST (Été)
  'Europe/Amsterdam': 'UTC+2',        // CEST (Été)
  'Europe/Stockholm': 'UTC+2',        // CEST (Été)
  'Europe/Zurich': 'UTC+2',           // CEST (Été)
  'Europe/Vienna': 'UTC+2',           // CEST (Été)
  'Europe/Brussels': 'UTC+2',         // CEST (Été)
  'Europe/Copenhagen': 'UTC+2',       // CEST (Été)
  'Europe/Helsinki': 'UTC+3',         // EEST (Été)
  'Europe/Oslo': 'UTC+2',             // CEST (Été)
  'Europe/Warsaw': 'UTC+2',           // CEST (Été)
  'Europe/Prague': 'UTC+2',           // CEST (Été)
  'Europe/Budapest': 'UTC+2',         // CEST (Été)
  'Europe/Athens': 'UTC+3',           // EEST (Été)
  'Europe/Istanbul': 'UTC+3',         // TRT (Pas de DST)
  'Europe/Moscow': 'UTC+3',           // MSK (Pas de DST)
  'Europe/Lisbon': 'UTC+1',           // WEST (Été)
  
  // Asia (Pas de DST pour la plupart)
  'Asia/Tokyo': 'UTC+9',              // JST
  'Asia/Shanghai': 'UTC+8',           // CST
  'Asia/Hong_Kong': 'UTC+8',          // HKT
  'Asia/Kolkata': 'UTC+5:30',         // IST
  'Asia/Mumbai': 'UTC+5:30',          // IST
  'Asia/Delhi': 'UTC+5:30',           // IST
  'Asia/Singapore': 'UTC+8',          // SGT
  'Asia/Dubai': 'UTC+4',              // GST
  'Asia/Bangkok': 'UTC+7',            // ICT
  'Asia/Jakarta': 'UTC+7',            // WIB
  'Asia/Manila': 'UTC+8',             // PHT
  'Asia/Seoul': 'UTC+9',              // KST
  'Asia/Kuala_Lumpur': 'UTC+8',       // MYT
  'Asia/Jerusalem': 'UTC+3',          // IDT (Été)
  'Asia/Riyadh': 'UTC+3',             // AST
  'Asia/Qatar': 'UTC+3',              // AST
  
  // Oceania (Hiver austral en juillet 2025)
  'Australia/Sydney': 'UTC+10',       // AEST (Hiver)
  'Australia/Melbourne': 'UTC+10',    // AEST (Hiver)
  'Australia/Brisbane': 'UTC+10',     // AEST (Pas de DST)
  'Australia/Perth': 'UTC+8',         // AWST (Pas de DST)
  'Pacific/Auckland': 'UTC+12',       // NZST (Hiver)
  
  // Africa (Pas de DST pour la plupart)
  'Africa/Cairo': 'UTC+2',            // EET
  'Africa/Lagos': 'UTC+1',            // WAT
  'Africa/Johannesburg': 'UTC+2',     // SAST
  'Africa/Nairobi': 'UTC+3',          // EAT
  'Africa/Casablanca': 'UTC+1'        // WEST (Été)
};

export const FALLBACK_TIMEZONE_OFFSETS: { [key: string]: number } = {
  'Asia/Mumbai': 5.5,
  'Asia/Delhi': 5.5,
  'Asia/Kolkata': 5.5,
  'Asia/Calcutta': 5.5
};

export const DEFAULT_TIMEZONES = [
  { city: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles' },
  { city: 'New York', country: 'United States', timezone: 'America/New_York' },
  { city: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris' }
];