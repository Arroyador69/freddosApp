import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Card, PrimaryButton } from '@/components/FreddosUI';
import { useAppStore } from '@/lib/store';
import { Link, router } from 'expo-router';

export default function RegisterScreen() {
  const scheme = useColorScheme();
  const c = Colors[scheme ?? 'light'];
  const register = useAppStore((s) => s.register);

  const [name, setName] = useState('Alberto');
  const [email, setEmail] = useState('alberto@freddos.es');
  const [password, setPassword] = useState('123456');

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={styles.header}>
        <Text style={[styles.kicker, { color: c.text }]}>Freddo's Coffee Club</Text>
        <Text style={[styles.title, { color: c.text }]}>Crear cuenta</Text>
      </View>

      <Card>
        <Text style={[styles.label, { color: c.text }]}>Nombre</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholder="Tu nombre"
          placeholderTextColor="rgba(139, 124, 118, 0.8)"
          style={[styles.input, { color: c.text, borderColor: c.border }]}
        />

        <Text style={[styles.label, { color: c.text, marginTop: 12 }]}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="tu@email.com"
          placeholderTextColor="rgba(139, 124, 118, 0.8)"
          style={[styles.input, { color: c.text, borderColor: c.border }]}
        />

        <Text style={[styles.label, { color: c.text, marginTop: 12 }]}>Contraseña</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="rgba(139, 124, 118, 0.8)"
          style={[styles.input, { color: c.text, borderColor: c.border }]}
        />

        <View style={{ height: 14 }} />
        <PrimaryButton
          label="Crear cuenta"
          onPress={async () => {
            await register({ name, email, password });
            router.replace('/');
          }}
        />
      </Card>

      <Text style={[styles.footer, { color: c.text }]}>
        ¿Ya tienes cuenta? <Link href="/login">Acceder</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, justifyContent: 'center', gap: 14 },
  header: { marginBottom: 6 },
  kicker: { fontSize: 12, fontWeight: '700', opacity: 0.7, letterSpacing: 0.6 },
  title: { fontSize: 30, fontWeight: '900', marginTop: 6 },
  label: { fontSize: 12, fontWeight: '800', opacity: 0.8 },
  input: {
    height: 46,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginTop: 6,
    fontSize: 14,
  },
  footer: { textAlign: 'center', fontSize: 12, opacity: 0.7, marginTop: 4 },
});

