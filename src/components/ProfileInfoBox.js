import React from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { moderateScale } from "react-native-size-matters";
import CupMain from "../assets/cup_main.png";
import ChampionsBackground from '../assets/champions_background.jpg';
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from 'react-redux';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../theme";

const ProfileInfoBox = () => {
  const user = useSelector(state => state.user);

  return (
    <View style={styles.container}>
      <ImageBackground source={ChampionsBackground} style={styles.imageBackground}>
        <LinearGradient
          colors={['rgba(11, 14, 23, 0.85)', 'rgba(22, 27, 38, 0.95)']}
          style={styles.linearGradient}
        />
        <View style={styles.avatarBorder}>
          <Image style={styles.trophyIcon} source={CupMain} />
        </View>
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.nameText}>
          {user.name || "Predictor"}
        </Text>
        <Text style={styles.memberTag}>EDGEPLAY PRO MEMBER</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  imageBackground: {
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
    height: moderateScale(180),
    alignItems: "center",
    padding: SPACING.md,
  },
  linearGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  avatarBorder: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.cardBg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  trophyIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    resizeMode: "contain",
  },
  nameText: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textPrimary,
    fontWeight: "900",
    marginTop: moderateScale(4),
  },
  memberTag: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: moderateScale(2),
  }
});

export default ProfileInfoBox;
