import { TimeZoneData } from '../services/localTimeApi';

export interface ExtendedTimeZone {
  city: string;
  country: string;
  timezone: string;
  data?: TimeZoneData;
  loading?: boolean;
  error?: string;
}

export interface AppState {
  timeZones: ExtendedTimeZone[];
  selectedTimezone: string;
  timeFormat: '12h' | '24h';
  primaryTimeData: TimeZoneData | undefined;
  primaryLoading: boolean;
  serverConnected: boolean;
  showSearch: boolean;
  currentTime: Date;
}

export interface ServerConnectionState {
  connected: boolean;
  loading: boolean;
  error: string | null;
}