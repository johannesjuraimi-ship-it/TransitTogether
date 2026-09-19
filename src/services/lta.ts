// src/services/lta.ts

const LTA_BASE_URL = 'https://datamall2.mytransport.sg/ltaodataservice';

// Helper to add the required AccountKey header
function getHeaders(): HeadersInit {
  return {
    AccountKey: process.env.EXPO_PUBLIC_LTA_ACCOUNT_KEY!,
    Accept: 'application/json',
  };
}

// --- Bus Arrival ---
export interface BusArrival {
  ServiceNo: string;         // e.g., "22"
  Operator: string;
  NextBus: {
    EstimatedArrival: string; // ISO 8601
    Load: string;             // "Seats Available", "Standing Available", "Limited Standing"
    Feature: string;          // "Wheelchair Accessible" etc.
  } | null;
  SubsequentBus: {
    EstimatedArrival: string;
    Load: string;
  } | null;
  SubsequentBus3: {
    EstimatedArrival: string;
    Load: string;
  } | null;
}

export async function getBusArrival(busStopCode: string, serviceNo?: string): Promise<BusArrival[]> {
  let url = `${LTA_BASE_URL}/BusArrivalv2?BusStopCode=${busStopCode}`;
  if (serviceNo) url += `&ServiceNo=${serviceNo}`;

  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) throw new Error(`LTA Bus Arrival error: ${response.status}`);
  const data = await response.json();
  return data.Services || [];
}

// --- MRT Station Crowd ---
export interface StationCrowd {
  Station: string;            // "EW1", "NS1", etc.
  CrowdLevel: string;         // "Low", "Medium", "High"
  StartTime: string;          // ISO 8601
  EndTime: string;
}

export async function getStationCrowd(stationCode?: string): Promise<StationCrowd[]> {
  // Fetch all stations if no stationCode provided
  const url = `${LTA_BASE_URL}/PCDRealTimeCrowd`;
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) throw new Error(`LTA Station Crowd error: ${response.status}`);
  const data = await response.json();
  const allStations: StationCrowd[] = data.value || [];
  if (stationCode) {
    return allStations.filter(s => s.Station === stationCode.toUpperCase());
  }
  return allStations;
}