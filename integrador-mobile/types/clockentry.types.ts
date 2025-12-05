/**
 * Tipos relacionados ao registro de ponto (Clock Entry)
 */

export type ClockEntryType = 'ENTRY' | 'EXIT' | 'LUNCH_START' | 'LUNCH_END';
export type FonteType = 'MOBILE_ANDROID' | 'MOBILE_IOS' | 'WEB';

export interface ClockEntryRequest {
  tipo: ClockEntryType;
  timestamp: string;
  latitude: number;
  longitude: number;
  precisao: number;
  fonte: FonteType;
  deviceId: string;
  ip?: string;
}

export interface ClockEntryResponse {
  id: number;
  userId: number;
  tipo: ClockEntryType;
  timestamp: string;
  latitude: number;
  longitude: number;
  precisao: number;
  fonte: FonteType;
  deviceId: string;
  ip: string;
  createdAt: string;
}

export interface ClockEntryStats {
  totalEntries: number;
  totalExits: number;
  lunchBreaks: number;
  averageWorkHours: number;
  presenceDays: number;
  absenceDays: number;
}
