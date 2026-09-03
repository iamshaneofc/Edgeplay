import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import BackgroundImage from "../assets/jobil.jpg";
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { moderateScale } from 'react-native-size-matters';
import CustomTextInput from "../components/CustomTextInput";
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MainButton from "../components/MainButton";
import { COLORS, FONT_SIZE, RADIUS, SPACING, SHADOWS } from "../theme";

const ResetPassword = ({ navigation }) => {
  const [emailValue, setEmailValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReset = () => {
    if (emailValue) setSubmitted(true);
  };

  return (
    <ImageBackground source={BackgroundImage} style={styles.container}>
      <LinearGradient
        colors={['rgba(11, 14, 23, 0.85)', 'rgba(11, 14, 23, 0.98)']}
        style={styles.linearGradient}
      />
      <View style={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Text style={styles.brandText}>EDGE<Text style={styles.brandHighlight}>PLAY</Text></Text>
          <Text style={styles.welcomeText}>Reset Password</Text>
        </View>

        <View style={[styles.card, SHADOWS.card]}>
          {submitted ? (
            <View style={styles.successWrapper}>
              <MaterialIcons name="check-circle" size={48} color={COLORS.primary} />
              <Text style={styles.successTitle}>Reset Email Sent!</Text>
              <Text style={styles.successDesc}>
                We have sent password reset instructions to <Text style={{ color: COLORS.textPrimary }}>{emailValue}</Text>.
              </Text>
              <MainButton
                onClick={() => navigation.navigate("Login")}
                text="BACK TO LOGIN"
                color={COLORS.primary}
                textColor="#0B0E17"
                style={styles.resetBtn}
              />
            </View>
          ) : (
            <>
              <Text style={styles.instructionText}>
                Enter the email address associated with your EdgePlay account and we'll send you instructions to reset your password.
              </Text>

              <CustomTextInput
                value={emailValue}
                onValueChange={setEmailValue}
                placeHolder="Email Address"
                icon={<Feather name="at-sign" size={18} color={COLORS.textMuted} />}
                keyboardType="email-address"
              />

              <MainButton
                onClick={handleReset}
                text="SEND RESET LINK"
                color={COLORS.primary}
                textColor="#0B0E17"
                style={styles.resetBtn}
              />
            </>
          )}
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    top: getStatusBarHeight() + SPACING.md,
    left: SPACING.lg,
    padding: SPACING.xs,
  },
  brandRow: {
    alignItems: "center",
    marginBottom: SPACING.xl,
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
  welcomeText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    fontWeight: "600",
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  instructionText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  resetBtn: {
    marginTop: SPACING.md,
  },
  successWrapper: {
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  successTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  successDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  }
});

export default ResetPassword;
