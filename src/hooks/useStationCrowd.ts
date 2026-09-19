// src/hooks/useStationCrowd.ts
import { useQuery } from '@tanstack/react-query';
import { getStationCrowd, StationCrowd } from '../services/lta';

export function useStationCrowd(stationCode?: string) {
  return useQuery<StationCrowd[], Error>({
    queryKey: ['stationCrowd', stationCode],
    queryFn: () => getStationCrowd(stationCode),
    staleTime: 5 * 60 * 1000,   // 5 minutes (API updates ~10 min)
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}