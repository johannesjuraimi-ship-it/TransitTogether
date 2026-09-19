// src/services/calendar.ts

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

export interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string }; // dateTime for timed events
  end: { dateTime?: string; date?: string };
  location?: string;
  description?: string;
}

export async function listUpcomingEvents(accessToken: string, maxResults = 10): Promise<CalendarEvent[]> {
  const now = new Date().toISOString();
  const url = `${CALENDAR_API_BASE}/calendars/primary/events?timeMin=${now}&maxResults=${maxResults}&orderBy=startTime&singleEvents=true`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Calendar API error: ${response.status}`);
  }

  const data = await response.json();
  return data.items || [];
}

// Stub for creating a travel‑time block (will be used in later phases)
export async function createCalendarEvent(
  accessToken: string,
  summary: string,
  startISO: string,
  endISO: string,
  description?: string
): Promise<void> {
  const url = `${CALENDAR_API_BASE}/calendars/primary/events`;
  const event = {
    summary,
    start: { dateTime: startISO },
    end: { dateTime: endISO },
    description,
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error(`Failed to create event: ${response.status}`);
  }
}