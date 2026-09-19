# Nudge — Smart Commuter Companion

A mobile-first web app for Problem Statement 2 (Smart Commuter Companion).

---

## The Persona

**Bryan — the fixed-schedule commuter.**
- Tampines → Raffles Place, East-West Line
- Departs 07:40, must be at his desk by 08:45

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Expo (SDK 52+) with React Native for Web |
| Routing | Expo Router (file-based) |
| State | Zustand (client) + React Query (server) |
| Backend | Firebase (Firestore) on Google Cloud |
| Hosting | Firebase Hosting |
| Auth | Google Sign-In via `expo-auth-session` |
| Maps | Leaflet + OpenStreetMap tiles |
| Routing API | OneMap |
| Transit data | LTA DataMall (`TrainServiceAlerts`, `PCDRealTime`, `PCDForecast`, `BusArrival`) |
| Weather | data.gov.sg 2-hour nowcast |

---

## Running Locally

### Prerequisites
- Node.js 18+
- npm or yarn
- A Firebase project linked to a Google Cloud project
- API keys (see Environment Variables below)

### Install
```bash
git clone <your-repo-url>
cd TransitTogether
npm install


https://deepseekhtml2026091925a050.vercel.app/
