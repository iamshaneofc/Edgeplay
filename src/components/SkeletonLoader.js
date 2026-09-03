import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from '../theme';

export const SkeletonLoader = ({ width = '100%', height = 20, borderRadius = RADIUS.sm, style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const CardSkeleton = () => (
  <View style={styles.cardContainer}>
    <View style={styles.row}>
      <SkeletonLoader width={100} height={14} />
      <SkeletonLoader width={60} height={14} />
    </View>
    <View style={styles.matchRow}>
      <SkeletonLoader width={44} height={44} borderRadius={22} />
      <SkeletonLoader width={80} height={16} />
      <SkeletonLoader width={30} height={14} />
      <SkeletonLoader width={80} height={16} />
      <SkeletonLoader width={44} height={44} borderRadius={22} />
    </View>
    <View style={styles.oddsRow}>
      <SkeletonLoader width="30%" height={36} borderRadius={RADIUS.md} />
      <SkeletonLoader width="30%" height={36} borderRadius={RADIUS.md} />
      <SkeletonLoader width="30%" height={36} borderRadius={RADIUS.md} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: COLORS.cardBgLighter,
  },
  cardContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  oddsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default SkeletonLoader;
