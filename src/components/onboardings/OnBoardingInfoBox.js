import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../theme';

const OnBoardingInfoBox = ({ slideNumber }) => {
  const text1 = () => (
    <View>
      <Text style={styles.headerText}>100% Risk Free Prediction</Text>
      <Text style={styles.text}>
        With <Text style={{ color: COLORS.primary }}>EdgePlay</Text>, make predictions with virtual coins. No real money required.
      </Text>
    </View>
  );

  const text2 = () => (
    <View>
      <Text style={styles.headerText}>Dominate The Leaderboards</Text>
      <Text style={styles.text}>
        Make smart predictions on live games, climb the weekly rankings, and prove you are the <Text style={{ color: COLORS.primary }}>#1 Predictor</Text>.
      </Text>
    </View>
  );

  const text3 = () => (
    <View>
      <Text style={styles.headerText}>24/7 Live Action</Text>
      <Text style={styles.text}>
        Over <Text style={{ color: COLORS.primary }}>25+ sports</Text> and top global leagues available live around the clock.
      </Text>
    </View>
  );

  const renderCorrectText = () => {
    switch (slideNumber) {
      case 0:
        return text1();
      case 1:
        return text2();
      case 2:
        return text3();
      default:
        return text1();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <View style={styles.textWrapper}>
        {renderCorrectText()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: moderateScale(160),
    borderRadius: RADIUS.lg,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: RADIUS.lg,
  },
  textWrapper: {
    zIndex: 2,
    alignItems: "center",
  },
  headerText: {
    textAlign: "center",
    fontWeight: "800",
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    marginBottom: SPACING.sm,
  },
  text: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    lineHeight: moderateScale(22),
  }
});

export default OnBoardingInfoBox;
