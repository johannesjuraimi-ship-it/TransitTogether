// app/(tabs)/profile.tsx
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { useUserStore } from '../../src/stores/userStore';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const { profile, commute, fetchProfile, fetchCommute, updateProfileName } = useUserStore();

  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
      fetchCommute(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (profile?.displayName) setNewName(profile.displayName);
  }, [profile?.displayName]);

  if (!user) return null;

  const handleSave = async () => {
    if (newName.trim()) {
      await updateProfileName(user.id, newName.trim());
      setEditMode(false);
    }
  };

  return (
    <View style={styles.container}>
      {user.photoUrl && <Image source={{ uri: user.photoUrl }} style={styles.avatar} />}

      {editMode ? (
        <View style={styles.editRow}>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            autoFocus
          />
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.name}>{profile?.displayName || user.name}</Text>
          <TouchableOpacity onPress={() => setEditMode(true)}>
            <Text style={styles.editHint}>Edit name</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.commuteBox}>
        <Text style={styles.commuteTitle}>Your commute</Text>
        {commute ? (
          <Text style={styles.commuteText}>
            {commute.origin} → {commute.destination}{'\n'}
            {commute.line} · depart {pad(commute.departHour)}:{pad(commute.departMinute)}{'\n'}
            arrive by {pad(commute.arriveByHour)}:{pad(commute.arriveByMinute)}
          </Text>
        ) : (
          <Text style={styles.commuteEmpty}>No commute saved yet.</Text>
        )}
        <TouchableOpacity
          style={styles.commuteButton}
          onPress={() => router.push('/commute-setup' as any)}
        >
          <Text style={styles.commuteButtonText}>
            {commute ? 'Edit commute' : 'Set up commute'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 20 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 16, color: '#666', marginBottom: 24 },
  editRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', fontSize: 20, minWidth: 150, marginRight: 10 },
  saveButton: { backgroundColor: '#4285F4', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 5 },
  saveText: { color: '#fff', fontWeight: '600' },
  editHint: { color: '#4285F4', fontSize: 14, marginBottom: 12 },
  commuteBox: {
    width: '100%', backgroundColor: '#F7F7F7', borderRadius: 10,
    padding: 16, marginBottom: 20,
  },
  commuteTitle: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 8, textTransform: 'uppercase' },
  commuteText: { fontSize: 15, color: '#333', lineHeight: 22 },
  commuteEmpty: { fontSize: 14, color: '#999', marginBottom: 10 },
  commuteButton: {
    marginTop: 12, backgroundColor: '#4285F4', paddingVertical: 10,
    borderRadius: 8, alignItems: 'center',
  },
  commuteButtonText: { color: '#fff', fontWeight: '600' },
  logoutButton: { backgroundColor: '#e0e0e0', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 8 },
  logoutText: { fontSize: 16, color: '#333' },
});