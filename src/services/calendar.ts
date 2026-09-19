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

function getMockEvents(): CalendarEvent[] {
  const now = new Date();
  const event1Start = new Date(now.getTime() + 45 * 60 * 1000); // 45 min from now
  const event1End = new Date(event1Start.getTime() + 60 * 60 * 1000);

  const event2Start = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now
  const event2End = new Date(event2Start.getTime() + 90 * 60 * 1000);

  const event3Start = new Date(now.getTime() + 24 * 60 * 60 * 1000); // tomorrow
  const event3End = new Date(event3Start.getTime() + 60 * 60 * 1000);

  return [
    {
      id: 'mock-event-1',
      summary: 'Team Standup & Commute Review',
      start: { dateTime: event1Start.toISOString() },
      end: { dateTime: event1End.toISOString() },
      location: 'One Raffles Place, Tower 2',
      description: 'Weekly team sync and project check-in',
    },
    {
      id: 'mock-event-2',
      summary: 'Product Demo with Transit Stakeholders',
      start: { dateTime: event2Start.toISOString() },
      end: { dateTime: event2End.toISOString() },
      location: 'Suntec Tower 4, Level 18',
      description: 'Showcasing TransitTogether MVP',
    },
    {
      id: 'mock-event-3',
      summary: 'Developer Community Meetup',
      start: { dateTime: event3Start.toISOString() },
      end: { dateTime: event3End.toISOString() },
      location: 'Marina Bay Sands Expo & Convention Centre',
      description: 'Networking and lightning talks',
    },
  ];
}

export async function listUpcomingEvents(accessToken: string, maxResults = 10): Promise<CalendarEvent[]> {
  if (accessToken === 'dev-token') {
    return getMockEvents();
  }

  const now = new Date().toISOString();
  const url = `${CALENDAR_API_BASE}/calendars/primary/events?timeMin=${now}&maxResults=${maxResults}&orderBy=startTime&singleEvents=true`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`Calendar API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (err) {
    console.warn('Calendar API fetch failed, falling back to sample events:', err);
    return getMockEvents();
  }
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