const freddos = {
  espresso: '#1E1412',
  cream: '#F6F0E8',
  burgundy: '#5A1E2B',
  pistachio: '#A6C36F',
  cocoa: '#2C1B18',
  muted: '#8B7C76',
  danger: '#C2413A',
};

const tintColorLight = freddos.burgundy;
const tintColorDark = freddos.cream;

export default {
  light: {
    text: freddos.espresso,
    background: freddos.cream,
    tint: tintColorLight,
    tabIconDefault: freddos.muted,
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    border: 'rgba(30, 20, 18, 0.10)',
    success: freddos.pistachio,
    danger: freddos.danger,
  },
  dark: {
    text: freddos.cream,
    background: freddos.espresso,
    tint: tintColorDark,
    tabIconDefault: 'rgba(246, 240, 232, 0.55)',
    tabIconSelected: tintColorDark,
    card: freddos.cocoa,
    border: 'rgba(246, 240, 232, 0.10)',
    success: freddos.pistachio,
    danger: freddos.danger,
  },
} as const;
