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

function getMockBusArrivals(busStopCode: string, serviceNo?: string): BusArrival[] {
  const now = Date.now();
  const allServices = ['14', '65', '106', '166', '502'];
  const servicesToReturn = serviceNo ? [serviceNo] : allServices.slice(0, 3);

  return servicesToReturn.map((no, idx) => ({
    ServiceNo: no,
    Operator: 'SBST',
    NextBus: {
      EstimatedArrival: new Date(now + (2 + idx * 3) * 60 * 1000).toISOString(),
      Load: idx === 0 ? 'Seats Available' : idx === 1 ? 'Standing Available' : 'Limited Standing',
      Feature: 'Wheelchair Accessible',
    },
    SubsequentBus: {
      EstimatedArrival: new Date(now + (10 + idx * 4) * 60 * 1000).toISOString(),
      Load: 'Seats Available',
    },
    SubsequentBus3: {
      EstimatedArrival: new Date(now + (20 + idx * 5) * 60 * 1000).toISOString(),
      Load: 'Seats Available',
    },
  }));
}

function getMockStationCrowd(stationCode?: string): StationCrowd[] {
  const now = new Date();
  const startTime = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
  const endTime = new Date(now.getTime() + 25 * 60 * 1000).toISOString();

  const stations = [
    { Station: 'EW1', CrowdLevel: 'Low' },
    { Station: 'EW2', CrowdLevel: 'Medium' },
    { Station: 'EW14', CrowdLevel: 'High' },
    { Station: 'NS1', CrowdLevel: 'Low' },
    { Station: 'DT19', CrowdLevel: 'Medium' },
    { Station: 'NE7', CrowdLevel: 'Low' },
  ];

  if (stationCode) {
    const code = stationCode.toUpperCase();
    const existing = stations.find((s) => s.Station === code);
    return [
      {
        Station: code,
        CrowdLevel: existing ? existing.CrowdLevel : 'Medium',
        StartTime: startTime,
        EndTime: endTime,
      },
    ];
  }

  return stations.map((s) => ({
    ...s,
    StartTime: startTime,
    EndTime: endTime,
  }));
}

export async function getBusArrival(busStopCode: string, serviceNo?: string): Promise<BusArrival[]> {
  let url = `${LTA_BASE_URL}/BusArrivalv2?BusStopCode=${busStopCode}`;
  if (serviceNo) url += `&ServiceNo=${serviceNo}`;

  try {
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error(`LTA Bus Arrival error: ${response.status}`);
    const data = await response.json();
    return data.Services || [];
  } catch (err) {
    console.warn('LTA Bus Arrival API request failed (using localhost fallback):', err);
    return getMockBusArrivals(busStopCode, serviceNo);
  }
}

// --- MRT Station Crowd ---
export interface StationCrowd {
  Station: string;            // "EW1", "NS1", etc.
  CrowdLevel: string;         // "Low", "Medium", "High"
  StartTime: string;          // ISO 8601
  EndTime: string;
}

export async function getStationCrowd(stationCode?: string): Promise<StationCrowd[]> {
  const url = `${LTA_BASE_URL}/PCDRealTimeCrowd`;
  try {
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error(`LTA Station Crowd error: ${response.status}`);
    const data = await response.json();
    const allStations: StationCrowd[] = data.value || [];
    if (stationCode) {
      return allStations.filter(s => s.Station === stationCode.toUpperCase());
    }
    return allStations;
  } catch (err) {
    console.warn('LTA Station Crowd API request failed (using localhost fallback):', err);
    return getMockStationCrowd(stationCode);
  }
}