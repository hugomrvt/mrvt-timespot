// Timezone data cache - replaces the problematic JSON import
// This data was previously stored in .docs/timezone.json but needs to be accessible in production

export interface DumpEntry {
  key: string;
  value: any;
}

export const timezoneData: DumpEntry[] = [
  {
    "key": "time_cache_America/New_York",
    "value": {
      "city": "New York",
      "country": "United States",
      "timezone": "America/New_York",
      "datetime": "2024-01-15T10:30:00.000000-05:00",
      "utc_offset": "-05:00",
      "utc_datetime": "2024-01-15T15:30:00.000000+00:00",
      "abbreviation": "EST",
      "dst": false
    }
  },
  {
    "key": "time_cache_Europe/London",
    "value": {
      "city": "London",
      "country": "United Kingdom",
      "timezone": "Europe/London",
      "datetime": "2024-01-15T15:30:00.000000+00:00",
      "utc_offset": "+00:00",
      "utc_datetime": "2024-01-15T15:30:00.000000+00:00",
      "abbreviation": "GMT",
      "dst": false
    }
  },
  {
    "key": "sun_cache_America/New_York",
    "value": {
      "sunrise": "2024-01-15T07:15:00.000000-05:00",
      "sunset": "2024-01-15T17:30:00.000000-05:00",
      "solar_noon": "2024-01-15T12:22:30.000000-05:00",
      "day_length": "10:15:00",
      "civil_twilight_begin": "2024-01-15T06:45:00.000000-05:00",
      "civil_twilight_end": "2024-01-15T18:00:00.000000-05:00"
    }
  },
  {
    "key": "sun_cache_Europe/London",
    "value": {
      "sunrise": "2024-01-15T08:00:00.000000+00:00",
      "sunset": "2024-01-15T16:15:00.000000+00:00",
      "solar_noon": "2024-01-15T12:07:30.000000+00:00",
      "day_length": "08:15:00",
      "civil_twilight_begin": "2024-01-15T07:25:00.000000+00:00",
      "civil_twilight_end": "2024-01-15T16:50:00.000000+00:00"
    }
  },
  {
    "key": "user_preferences_default",
    "value": {
      "selectedCity": "New York",
      "timeFormat": "24h",
      "favoriteCities": ["New York", "London", "Tokyo"]
    }
  }
];