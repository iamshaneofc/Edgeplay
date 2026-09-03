import { moderateScale } from 'react-native-size-matters';

export const COLORS = {
  // Backgrounds
  bgPrimary: '#0B0E17',
  bgSecondary: '#121622',
  cardBg: '#1A202C',
  cardBgLighter: '#222A38',
  cardBorder: '#2D3748',
  
  // Accents
  primary: '#00E676',       // Electric Green
  primaryDark: '#00B359',
  secondary: '#00E5FF',     // Neon Cyan
  accentPurple: '#7C4DFF',  // Deep Purple Accent
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0AEC0',
  textMuted: '#64748B',
  
  // Status Colors
  success: '#00E676',
  danger: '#FF5252',
  warning: '#FFD600',
  info: '#29B6F6',
  
  // Form Controls
  inputBg: '#121622',
  inputBorder: '#2D3748',
  inputBorderActive: '#00E676',
  
  // Header / Navigation
  headerBg: '#0B0E17',
  tabBarBg: '#121622',
  tabBarActive: '#00E676',
  tabBarInactive: '#64748B',
  
  // Glassmorphism overlays
  glassOverlay: 'rgba(26, 32, 44, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
};

export const SPACING = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(48),
};

export const RADIUS = {
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(24),
  round: 999,
};

export const FONT_SIZE = {
  xs: moderateScale(11),
  sm: moderateScale(13),
  md: moderateScale(15),
  lg: moderateScale(18),
  xl: moderateScale(22),
  xxl: moderateScale(28),
  hero: moderateScale(34),
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: {
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
};

export default {
  COLORS,
  SPACING,
  RADIUS,
  FONT_SIZE,
  SHADOWS,
};
