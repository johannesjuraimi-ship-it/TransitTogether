// src/services/user.ts
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  displayName?: string;
}

// Create or update a user document when they sign in.
export async function upsertUser(user: UserProfile): Promise<void> {
  const userRef = doc(db, 'users', user.id);
  const existing = await getDoc(userRef);

  if (existing.exists()) {
    // Update fields from Google; do NOT overwrite displayName if already set.
    await updateDoc(userRef, {
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl || null,
    });
  } else {
    await setDoc(userRef, {
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl || null,
      displayName: user.name, // initial display name = Google name
      createdAt: new Date(),
    });
  }
}

// Get the full user profile from Firestore.
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', userId));
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as UserProfile;
  }
  return null;
}

// Update the user's editable display name.
export async function updateDisplayName(userId: string, displayName: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), { displayName });
}