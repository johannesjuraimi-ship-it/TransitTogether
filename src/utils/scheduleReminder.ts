// src/utils/scheduleReminder.ts (web)
export async function requestNotificationPermission(): Promise<boolean> {
  // Web doesn't support local push; we'll rely on the in‑app fallback
  return false;
}

export async function scheduleLeaveReminder(eventTitle: string, leaveTime: Date): Promise<string | null> {
  if (leaveTime.getTime() <= Date.now()) return null;

  const delayMs = leaveTime.getTime() - Date.now();
  setTimeout(() => {
    // Since web can't show a background notification, we'll just alert if the app is still open.
    alert(`⏰ Time to leave for "${eventTitle}"!`);
  }, delayMs);

  return 'web-reminder'; // dummy identifier
}