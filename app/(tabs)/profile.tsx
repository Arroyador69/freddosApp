import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Card, PrimaryButton, SectionTitle } from '@/components/FreddosUI';
import { useAppStore } from '@/lib/store';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { STORE } from '@/lib/data';

function distanceMeters(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

export default function ProfileScreen() {
  const scheme = useColorScheme();
  const c = Colors[scheme ?? 'light'];
  const user = useAppStore((s) => s.user);
  const isStaffMode = useAppStore((s) => s.isStaffMode);
  const toggleStaffMode = useAppStore((s) => s.toggleStaffMode);
  const signOut = useAppStore((s) => s.signOut);

  const [locationEnabled, setLocationEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  const initials = useMemo(() => {
    const n = (user?.name ?? '').trim();
    if (!n) return 'F';
    const parts = n.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join('');
  }, [user?.name]);

  async function requestPush() {
    const perms = await Notifications.getPermissionsAsync();
    if (!perms.granted) {
      const req = await Notifications.requestPermissionsAsync();
      if (!req.granted) return false;
    }
    return true;
  }

  async function requestLocation() {
    const fg = await Location.requestForegroundPermissionsAsync();
    if (fg.status !== 'granted') return false;
    // MVP: sólo foreground. Background/geofencing se añade en la siguiente iteración.
    return true;
  }

  async function demoProximityNotification() {
    const okPush = await requestPush();
    const okLoc = await requestLocation();
    if (!okPush || !okLoc) {
      Alert.alert('Permisos necesarios', 'Activa permisos de notificaciones y localización para la demo.');
      return;
    }

    const pos = await Location.getCurrentPositionAsync({});
    const distance = distanceMeters(
      { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
      { latitude: STORE.latitude, longitude: STORE.longitude }
    );

    const within = distance <= STORE.radiusMeters;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: within ? "Estás cerca de Freddo's" : "Freddo's",
        body: within
          ? `Tienes Freddo's a ${(distance / 1000).toFixed(2)} km. ¡Tu próximo café te espera!`
          : `Cuando estés a menos de ${STORE.radiusMeters}m, te avisaremos con promos.`,
      },
      trigger: null,
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Card>
        <View style={styles.avatarRow}>
          <View style={[styles.avatar, { backgroundColor: c.tint }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: c.text }]}>{user?.name}</Text>
            <Text style={[styles.email, { color: c.text }]}>{user?.email}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <SectionTitle>Ajustes</SectionTitle>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.switchTitle, { color: c.text }]}>Modo staff</Text>
            <Text style={[styles.switchDesc, { color: c.text }]}>
              Actívalo para escanear QR y sumar puntos (MVP).
            </Text>
          </View>
          <Switch value={isStaffMode} onValueChange={toggleStaffMode} />
        </View>

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.switchTitle, { color: c.text }]}>Notificaciones</Text>
            <Text style={[styles.switchDesc, { color: c.text }]}>Permite promos y recordatorios.</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={async (v) => {
              if (v) {
                const ok = await requestPush();
                setPushEnabled(ok);
              } else {
                setPushEnabled(false);
              }
            }}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.switchTitle, { color: c.text }]}>Localización</Text>
            <Text style={[styles.switchDesc, { color: c.text }]}>
              Para avisos cuando estés cerca (600m).
            </Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={async (v) => {
              if (v) {
                const ok = await requestLocation();
                setLocationEnabled(ok);
              } else {
                setLocationEnabled(false);
              }
            }}
          />
        </View>

        <View style={{ height: 10 }} />
        <PrimaryButton label="Demo notificación proximidad" onPress={demoProximityNotification} />
        <View style={{ height: 10 }} />
        <PrimaryButton
          label="Abrir escáner (staff)"
          onPress={() => router.push('/staff')}
          disabled={!isStaffMode}
        />
      </Card>

      <Card>
        <PrimaryButton
          label="Cerrar sesión"
          onPress={() => {
            Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Salir',
                style: 'destructive',
                onPress: () => {
                  signOut();
                  router.replace('/login');
                },
              },
            ]);
          }}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, gap: 12 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  name: { fontSize: 18, fontWeight: '900' },
  email: { fontSize: 12, opacity: 0.65, marginTop: 2 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 10 },
  switchTitle: { fontSize: 14, fontWeight: '800' },
  switchDesc: { fontSize: 12, opacity: 0.7, marginTop: 2 },
});

