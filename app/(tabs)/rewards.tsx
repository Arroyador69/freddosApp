import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Card, PrimaryButton, SectionTitle } from '@/components/FreddosUI';
import { REWARDS } from '@/lib/data';
import { useAppStore } from '@/lib/store';

export default function RewardsScreen() {
  const scheme = useColorScheme();
  const c = Colors[scheme ?? 'light'];
  const points = useAppStore((s) => s.points);
  const redeemPoints = useAppStore((s) => s.redeemPoints);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Card>
        <SectionTitle>Recompensas</SectionTitle>
        <Text style={[styles.body, { color: c.text }]}>Tu saldo: {points} pts</Text>
      </Card>

      {REWARDS.map((r) => {
        const canRedeem = points >= r.cost;
        return (
          <Card key={r.id} style={styles.item}>
            <Text style={[styles.name, { color: c.text }]}>{r.name}</Text>
            <Text style={[styles.meta, { color: c.text }]}>{r.cost} pts</Text>
            <View style={{ height: 10 }} />
            <PrimaryButton
              label={canRedeem ? 'Canjear' : 'No tienes puntos suficientes'}
              disabled={!canRedeem}
              onPress={() => {
                Alert.alert('Confirmar canje', `¿Canjear "${r.name}" por ${r.cost} puntos?`, [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Canjear',
                    style: 'destructive',
                    onPress: () => redeemPoints({ points: r.cost, label: `Canje: ${r.name}` }),
                  },
                ]);
              }}
            />
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, gap: 12 },
  body: { fontSize: 14, lineHeight: 20, opacity: 0.85 },
  item: {},
  name: { fontSize: 16, fontWeight: '900' },
  meta: { fontSize: 12, opacity: 0.7, marginTop: 2 },
});

