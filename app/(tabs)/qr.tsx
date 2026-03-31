import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Card, SectionTitle } from '@/components/FreddosUI';
import { useAppStore } from '@/lib/store';

export default function QrScreen() {
  const scheme = useColorScheme();
  const c = Colors[scheme ?? 'light'];
  const user = useAppStore((s) => s.user);

  const payload = useMemo(() => {
    if (!user) return '';
    // MVP: payload simple. En producción: firmar / tokenizar (anti-fraude).
    return JSON.stringify({ userId: user.id, v: 1 });
  }, [user]);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Card>
        <SectionTitle>Tu QR</SectionTitle>
        <Text style={[styles.body, { color: c.text }]}>
          Enséñaselo al personal para sumar puntos. El QR por sí solo no añade nada: lo valida el modo staff.
        </Text>
        <View style={{ height: 16 }} />
        <View style={styles.qrWrap}>
          <View style={[styles.qrFrame, { backgroundColor: '#fff' }]}>
            <QRCode value={payload || '—'} size={220} />
          </View>
        </View>
        <View style={{ height: 14 }} />
        <Text style={[styles.small, { color: c.text }]} numberOfLines={1}>
          ID: {user?.id}
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  body: { fontSize: 14, lineHeight: 20, opacity: 0.85 },
  small: { fontSize: 12, opacity: 0.6 },
  qrWrap: { alignItems: 'center', justifyContent: 'center' },
  qrFrame: { padding: 14, borderRadius: 20 },
});

