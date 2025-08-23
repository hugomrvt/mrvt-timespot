import { z } from 'zod';
import { logger } from './secureLogger';

/**
 * Schémas de validation Zod pour les données de l'application
 */

// Validation pour les coordonnées géographiques
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// Validation pour les fuseaux horaires
export const timezoneSchema = z.string().regex(
  /^[A-Za-z_]+\/[A-Za-z_]+$/,
  'Format de fuseau horaire invalide'
);

// Validation pour les préférences utilisateur
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  timeFormat: z.enum(['12h', '24h']).default('24h'),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']).default('DD/MM/YYYY'),
  language: z.string().min(2).max(5).default('en'),
  showSeconds: z.boolean().default(true),
  autoRefresh: z.boolean().default(true),
  refreshInterval: z.number().min(1000).max(60000).default(1000),
});

// Validation pour les données de localisation
export const locationSchema = z.object({
  city: z.string().min(1).max(100),
  country: z.string().min(1).max(100),
  timezone: timezoneSchema,
  coordinates: coordinatesSchema.optional(),
});

// Validation pour les données météorologiques
export const weatherDataSchema = z.object({
  temperature: z.number().min(-100).max(100),
  humidity: z.number().min(0).max(100),
  description: z.string().max(200),
  icon: z.string().max(50),
});

// Validation pour les données solaires
export const sunDataSchema = z.object({
  sunrise: z.string().datetime(),
  sunset: z.string().datetime(),
  dawn: z.string().datetime().optional(),
  dusk: z.string().datetime().optional(),
});

// Validation pour les paramètres d'API
export const apiParamsSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  timezone: timezoneSchema.optional(),
});

/**
 * Fonction utilitaire pour valider des données avec gestion d'erreurs
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string = 'validation'
): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Validation failed:', {
        context,
        issues: error.issues,
        data: typeof data === 'object' ? JSON.stringify(data) : data,
      }, 'ValidationService');
    } else {
      logger.error('Unexpected validation error:', { error, context }, 'ValidationService');
    }
    return null;
  }
}

/**
 * Fonction pour valider de manière sûre avec des valeurs par défaut
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  defaultValue: T,
  context: string = 'safeValidation'
): T {
  const result = validateData(schema, data, context);
  return result !== null ? result : defaultValue;
}

/**
 * Validation pour les entrées utilisateur (sanitisation)
 */
export const sanitizeUserInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Supprimer les caractères potentiellement dangereux
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Scripts
    .replace(/<[^>]*>/g, '') // Tags HTML
    .replace(/javascript:/gi, '') // URLs JavaScript
    .replace(/on\w+\s*=/gi, '') // Event handlers
    .trim()
    .slice(0, 1000); // Limiter la longueur
};

/**
 * Validation pour les URLs
 */
export const urlSchema = z.string().url('URL invalide');

/**
 * Validation pour les emails
 */
export const emailSchema = z.string().email('Email invalide');

/**
 * Types exportés pour TypeScript
 */
export type Coordinates = z.infer<typeof coordinatesSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type Location = z.infer<typeof locationSchema>;
export type WeatherData = z.infer<typeof weatherDataSchema>;
export type SunData = z.infer<typeof sunDataSchema>;
export type ApiParams = z.infer<typeof apiParamsSchema>;