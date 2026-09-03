import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, ActivityIndicator } from 'react-native';
import BackgroundImage from "../assets/jobil.jpg";
import CupImage from "../assets/cup_sports_2.png";
import arrowImage from "../assets/arrow.png";
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { moderateScale } from 'react-native-size-matters';
import MainButton from "../components/MainButton";
import analytics from "@react-native-firebase/analytics";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../theme";

const ConnectOptions = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const navigateToRegister = async () => {
    if (loading) return;
    try {
      await analytics().logEvent('connect_button');
    } catch (e) {
      console.log(e);
    }
    navigation.navigate('Register');
  };

  const navigateToLogin = async () => {
    navigation.navigate('Login');
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.container}>
      <LinearGradient
        colors={['rgba(11, 14, 23, 0.85)', 'rgba(11, 14, 23, 0.98)']}
        style={styles.linearGradient}
      />
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>EDGE<Text style={styles.brandHighlight}>PLAY</Text></Text>
          <Text style={styles.subtitle}>Premium Sports Predictions</Text>
        </View>

        <Image style={styles.heroImage} source={CupImage} />

        <View style={styles.buttonContainer}>
          <MainButton
            onClick={navigateToRegister}
            text="CREATE ACCOUNT"
            color={COLORS.primary}
            textColor="#0B0E17"
            arrow={arrowImage}
          />
          
          <MainButton
            onClick={navigateToLogin}
            text="SIGN IN"
            color={COLORS.cardBg}
            textColor={COLORS.textPrimary}
            style={styles.loginButton}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  linearGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingTop: getStatusBarHeight() + SPACING.lg,
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.lg,
    flex: 1,
  },
  brandRow: {
    marginTop: moderateScale(20),
    alignItems: "center",
  },
  brandText: {
    fontSize: FONT_SIZE.hero,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  brandHighlight: {
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    letterSpacing: 1,
    fontWeight: "600",
  },
  heroImage: {
    width: moderateScale(260),
    height: moderateScale(260),
    resizeMode: "contain",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: SPACING.md,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginTop: SPACING.sm,
  },
});

export default ConnectOptions;
