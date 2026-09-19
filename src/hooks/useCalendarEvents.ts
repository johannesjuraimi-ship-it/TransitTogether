// src/hooks/useCalendarEvents.ts
import { useQuery } from '@tanstack/react-query';
import { listUpcomingEvents } from '../services/calendar';
import { useAuthStore } from '../stores/authStore';

export function useCalendarEvents() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ['calendarEvents', accessToken],
    queryFn: () => listUpcomingEvents(accessToken!),
    enabled: !!accessToken,            // only run if we have a token
    staleTime: 60 * 1000,              // 1 minute
    refetchInterval: 5 * 60 * 1000,    // auto‑refresh every 5 minutes
  });
}