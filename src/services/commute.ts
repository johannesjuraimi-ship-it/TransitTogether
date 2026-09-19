// src/services/commute.ts
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface Commute {
  origin: string;
  originStation: string;
  destination: string;
  destinationStation: string;
  line: string;
  departHour: number;
  departMinute: number;
  arriveByHour: number;
  arriveByMinute: number;
}

// Rachel's default — used as a seed when the user has no saved commute yet.
export const RACHEL_DEFAULT: Commute = {
  origin: 'Tampines',
  originStation: 'EW2',
  destination: 'Raffles Place',
  destinationStation: 'EW14',
  line: 'EWL',
  departHour: 7,
  departMinute: 40,
  arriveByHour: 8,
  arriveByMinute: 45,
};

// In-memory fallback for local dev
const localCommuteStore = new Map<string, Commute>();

export async function saveCommute(userId: string, commute: Commute): Promise<void> {
  localCommuteStore.set(userId, commute);
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(`commute_${userId}`, JSON.stringify(commute));
    } catch {}
  }

  try {
    await setDoc(doc(db, 'users', userId, 'profile', 'commute'), commute);
  } catch (err) {
    console.warn('Firestore saveCommute unavailable, saved locally:', err);
  }
}

export async function getCommute(userId: string): Promise<Commute | null> {
  try {
    const snap = await getDoc(doc(db, 'users', userId, 'profile', 'commute'));
    if (snap.exists()) {
      return snap.data() as Commute;
    }
  } catch (err) {
    console.warn('Firestore getCommute unavailable, using local commute:', err);
  }

  if (localCommuteStore.has(userId)) {
    return localCommuteStore.get(userId)!;
  }
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(`commute_${userId}`);
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return null;
}