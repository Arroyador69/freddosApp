import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { BrandMark, Card, Pill, PrimaryButton, SectionTitle } from '@/components/FreddosUI';
import { REWARDS } from '@/lib/data';
import { useAppStore } from '@/lib/store';
import { router } from 'expo-router';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const c = Colors[scheme ?? 'light'];
  const user = useAppStore((s) => s.user);
  const points = useAppStore((s) => s.points);

  const nextReward = useMemo(() => {
    const sorted = [...REWARDS].sort((a, b) => a.cost - b.cost);
    return sorted.find((r) => r.cost > points) ?? sorted[0];
  }, [points]);

  const remaining = Math.max(0, (nextReward?.cost ?? 0) - points);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={styles.header}>
        <BrandMark compact />
        <Text style={[styles.kicker, { color: c.text }]}>Not the typical.</Text>
        <Text style={[styles.title, { color: c.text }]}>Hola, {user?.name}</Text>
      </View>

      <Card style={styles.heroCard}>
        <SectionTitle>Tu saldo</SectionTitle>
        <Text style={[styles.points, { color: c.text }]}>{points} pts</Text>
        <View style={styles.row}>
          <Pill label={`Te faltan ${remaining} pts`} tone="neutral" />
          <View style={{ width: 10 }} />
          <Pill label={nextReward ? `Próximo: ${nextReward.name}` : 'Próximo: —'} tone="success" />
        </View>
        <View style={{ height: 14 }} />
        <PrimaryButton label="Ver mi QR" onPress={() => router.push('/qr')} />
      </Card>

      <Card style={styles.secondaryCard}>
        <SectionTitle>Modo staff</SectionTitle>
        <Text style={[styles.body, { color: c.text }]}>
          Para el MVP, el personal suma puntos escaneando el QR del cliente y seleccionando un producto.
        </Text>
        <View style={{ height: 12 }} />
        <PrimaryButton label="Abrir escáner (staff)" onPress={() => router.push('/staff')} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, gap: 14 },
  header: { paddingTop: 8 },
  kicker: { fontSize: 12, fontWeight: '700', opacity: 0.7, letterSpacing: 0.6 },
  title: { fontSize: 26, fontWeight: '900', marginTop: 4 },
  heroCard: {},
  secondaryCard: {},
  points: { fontSize: 34, fontWeight: '900', marginTop: 2, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  body: { fontSize: 14, lineHeight: 20, opacity: 0.85 },
});
