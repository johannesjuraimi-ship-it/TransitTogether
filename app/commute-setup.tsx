// app/commute-setup.tsx
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView, Platform,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Commute, RACHEL_DEFAULT } from '../src/services/commute';
import { useAuthStore } from '../src/stores/authStore';
import { useUserStore } from '../src/stores/userStore';

export default function CommuteSetupScreen() {
  const user = useAuthStore((s) => s.user);
  const { commute, fetchCommute, saveCommute } = useUserStore();
  const [form, setForm] = useState<Commute>(RACHEL_DEFAULT);

  useEffect(() => {
    if (user) fetchCommute(user.id);
  }, [user?.id]);

  useEffect(() => {
    if (commute) setForm(commute);
  }, [commute]);

  if (!user) return null;

  const handleSave = async () => {
    await saveCommute(user.id, form);
    router.back();
  };

  const num = (v: string, fallback = 0) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : fallback;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your commute</Text>

        <Text style={styles.label}>From</Text>
        <TextInput
          style={styles.input}
          value={form.origin}
          onChangeText={(v) => setForm({ ...form, origin: v })}
        />

        <Text style={styles.label}>Origin station code (e.g. EW2)</Text>
        <TextInput
          style={styles.input}
          value={form.originStation}
          onChangeText={(v) => setForm({ ...form, originStation: v.toUpperCase() })}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>To</Text>
        <TextInput
          style={styles.input}
          value={form.destination}
          onChangeText={(v) => setForm({ ...form, destination: v })}
        />

        <Text style={styles.label}>Destination station code (e.g. EW14)</Text>
        <TextInput
          style={styles.input}
          value={form.destinationStation}
          onChangeText={(v) => setForm({ ...form, destinationStation: v.toUpperCase() })}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Line (e.g. EWL)</Text>
        <TextInput
          style={styles.input}
          value={form.line}
          onChangeText={(v) => setForm({ ...form, line: v.toUpperCase() })}
          autoCapitalize="characters"
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Depart hour (24h)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(form.departHour)}
              onChangeText={(v) => setForm({ ...form, departHour: num(v) })}
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Depart minute</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(form.departMinute)}
              onChangeText={(v) => setForm({ ...form, departMinute: num(v) })}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Arrive by hour</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(form.arriveByHour)}
              onChangeText={(v) => setForm({ ...form, arriveByHour: num(v) })}
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Arrive by minute</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(form.arriveByMinute)}
              onChangeText={(v) => setForm({ ...form, arriveByMinute: num(v) })}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save commute</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 13, color: '#666', marginTop: 12, marginBottom: 4, fontWeight: '600' },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 12, fontSize: 16, backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  saveButton: {
    marginTop: 28, backgroundColor: '#4285F4', padding: 14,
    borderRadius: 10, alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});