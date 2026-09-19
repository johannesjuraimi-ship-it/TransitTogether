// src/hooks/useBusArrival.ts
import { useQuery } from '@tanstack/react-query';
import { BusArrival, getBusArrival } from '../services/lta';

export function useBusArrival(busStopCode: string, serviceNo?: string) {
  return useQuery<BusArrival[], Error>({
    queryKey: ['busArrival', busStopCode, serviceNo],
    queryFn: () => getBusArrival(busStopCode, serviceNo),
    enabled: !!busStopCode,   // only fetch when a code is set
    refetchInterval: 30_000,  // 30 seconds
    staleTime: 20_000,
  });
}