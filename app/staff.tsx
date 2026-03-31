import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Card, PrimaryButton, SectionTitle } from '@/components/FreddosUI';
import { PRODUCTS } from '@/lib/data';
import { useAppStore } from '@/lib/store';
import { router } from 'expo-router';

type Payload = { userId: string; v?: number };

function tryParsePayload(raw: string): Payload | null {
  try {
    const v = JSON.parse(raw);
    if (v && typeof v.userId === 'string') return v as Payload;
    return null;
  } catch {
    return null;
  }
}

export default function StaffScreen() {
  const scheme = useColorScheme();
  const c = Colors[scheme ?? 'light'];
  const isStaffMode = useAppStore((s) => s.isStaffMode);
  const earnPoints = useAppStore((s) => s.earnPoints);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedUserId, setScannedUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const header = useMemo(() => {
    if (!isStaffMode) return 'Activa "Modo staff" en Perfil';
    if (hasPermission === false) return 'Permiso de cámara denegado';
    return 'Escanea el QR del cliente';
  }, [hasPermission, isStaffMode]);

  if (!isStaffMode) {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <Card>
          <SectionTitle>Staff</SectionTitle>
          <Text style={[styles.body, { color: c.text }]}>
            Para evitar abuso, el escáner sólo funciona cuando el modo staff está activado en el perfil.
          </Text>
          <View style={{ height: 14 }} />
          <PrimaryButton label="Ir a Perfil" onPress={() => router.push('/profile')} />
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Card>
        <SectionTitle>Staff</SectionTitle>
        <Text style={[styles.body, { color: c.text }]}>{header}</Text>
      </Card>

      {hasPermission ? (
        <View style={[styles.scannerFrame, { borderColor: c.border }]}>
          <BarCodeScanner
            style={StyleSheet.absoluteFillObject}
            onBarCodeScanned={({ data }) => {
              const payload = tryParsePayload(data);
              if (!payload?.userId) return;
              setScannedUserId(payload.userId);
            }}
          />
        </View>
      ) : (
        <Card>
          <Text style={[styles.body, { color: c.text }]}>
            Necesitamos permiso de cámara para escanear QR.
          </Text>
        </Card>
      )}

      <Card>
        <SectionTitle>Producto</SectionTitle>
        <Text style={[styles.body, { color: c.text }]}>
          Usuario escaneado: {scannedUserId ? scannedUserId : '—'}
        </Text>
        <View style={{ height: 10 }} />

        {PRODUCTS.map((p) => (
          <View key={p.id} style={{ marginTop: 10 }}>
            <PrimaryButton
              label={`Sumar ${p.points} pts · ${p.name}`}
              disabled={!scannedUserId}
              onPress={() => {
                if (!scannedUserId) return;
                earnPoints({ points: p.points, label: `Compra: ${p.name}` });
                Alert.alert('OK', `Añadidos ${p.points} puntos`, [
                  { text: 'Escanear otro', onPress: () => setScannedUserId(null) },
                  { text: 'Cerrar', onPress: () => router.back() },
                ]);
              }}
            />
          </View>
        ))}

        <View style={{ height: 10 }} />
        <PrimaryButton label="Reset escaneo" onPress={() => setScannedUserId(null)} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, gap: 12 },
  body: { fontSize: 14, lineHeight: 20, opacity: 0.85 },
  scannerFrame: {
    height: 280,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
  },
});

