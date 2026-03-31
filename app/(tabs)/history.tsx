import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Card, Pill, SectionTitle } from '@/components/FreddosUI';
import { Transaction, useAppStore } from '@/lib/store';

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString();
}

export default function HistoryScreen() {
  const scheme = useColorScheme();
  const c = Colors[scheme ?? 'light'];
  const transactions = useAppStore((s) => s.transactions);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Card>
        <SectionTitle>Historial</SectionTitle>
        <Text style={[styles.body, { color: c.text }]}>
          Aquí verás todos los puntos ganados y canjeados.
        </Text>
      </Card>

      <FlatList
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        data={transactions}
        keyExtractor={(t) => t.id}
        ListEmptyComponent={
          <Card>
            <Text style={[styles.body, { color: c.text }]}>
              Aún no hay movimientos. Pide tu primer café y escanea tu QR en caja.
            </Text>
          </Card>
        }
        renderItem={({ item }: { item: Transaction }) => {
          const isEarn = item.type === 'earn';
          return (
            <Card>
              <View style={styles.row}>
                <Text style={[styles.name, { color: c.text }]}>{item.label}</Text>
                <Pill
                  label={`${isEarn ? '+' : '-'}${item.points} pts`}
                  tone={isEarn ? 'success' : 'danger'}
                />
              </View>
              <Text style={[styles.meta, { color: c.text }]}>{formatDate(item.createdAt)}</Text>
            </Card>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, gap: 12 },
  body: { fontSize: 14, lineHeight: 20, opacity: 0.85 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  name: { fontSize: 14, fontWeight: '800', flex: 1 },
  meta: { fontSize: 12, opacity: 0.65, marginTop: 6 },
});

