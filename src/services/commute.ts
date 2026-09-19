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

export async function saveCommute(userId: string, commute: Commute): Promise<void> {
  await setDoc(doc(db, 'users', userId, 'profile', 'commute'), commute);
}

export async function getCommute(userId: string): Promise<Commute | null> {
  const snap = await getDoc(doc(db, 'users', userId, 'profile', 'commute'));
  return snap.exists() ? (snap.data() as Commute) : null;
}