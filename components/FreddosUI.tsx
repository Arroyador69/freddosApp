import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export function BrandMark({ compact }: { compact?: boolean }) {
  const scheme = useColorScheme();
  const c = Colors[scheme ?? 'light'];
  return (
    <View style={styles.brandRow}>
      <View style={[styles.brandDot, { backgroundColor: c.tint }]} />
      <Text
        style={[
          styles.brandText,
          {
            color: c.text,
            fontSize: compact ? 16 : 18,
          },
        ]}>
        Freddo's
      </Text>
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const scheme = useColorScheme();
  const c = Colors[scheme ?? 'light'];
  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }, style]}>
      {children}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const scheme = useColorScheme();
  const c = Colors[scheme ?? 'light'];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.primaryButton,
        {
          backgroundColor: disabled ? 'rgba(90, 30, 43, 0.4)' : c.tint,
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const c = Colors[scheme ?? 'light'];
  return <Text style={[styles.sectionTitle, { color: c.text }]}>{children}</Text>;
}

export function Pill({
  label,
  tone,
}: {
  label: string;
  tone: 'neutral' | 'success' | 'danger';
}) {
  const scheme = useColorScheme();
  const c = Colors[scheme ?? 'light'];
  const bg =
    tone === 'success'
      ? 'rgba(166, 195, 111, 0.18)'
      : tone === 'danger'
        ? 'rgba(194, 65, 58, 0.16)'
        : 'rgba(139, 124, 118, 0.16)';
  const fg = tone === 'success' ? c.success : tone === 'danger' ? c.danger : c.text;
  return (
    <View style={[styles.pill, { backgroundColor: bg, borderColor: c.border }]}>
      <Text style={[styles.pillText, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  brandText: {
    fontFamily: 'SpaceMono',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  primaryButton: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

