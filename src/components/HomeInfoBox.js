import React from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { moderateScale } from "react-native-size-matters";
import CupMain from "../assets/cup_main.png";
import StatWon from "../assets/stats_won.png";
import StatLost from "../assets/stats_lost.png";
import StatInPlay from "../assets/stats_in_play.png";
import StatPosition from "../assets/stats_rank.png";
import ChampionsBackground from '../assets/champions_background.jpg';
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from 'react-redux';
import { COLORS, FONT_SIZE, RADIUS, SPACING, SHADOWS } from "../theme";

const HomeInfoBox = () => {
  const user = useSelector(state => state.user);

  return (
    <View style={styles.container}>
      <ImageBackground source={ChampionsBackground} style={styles.imageBackground}>
        <LinearGradient
          colors={['rgba(11, 14, 23, 0.85)', 'rgba(22, 27, 38, 0.95)']}
          style={styles.linearGradient}
        />
        
        <View style={styles.userHeader}>
          <Image style={styles.trophyIcon} source={CupMain} />
          <View style={styles.userInfo}>
            <Text style={styles.welcomeSubtitle}>WELCOME BACK</Text>
            <Text style={styles.userNameText}>{user.name || "Predictor"}</Text>
          </View>
        </View>

        <View style={[styles.statsHolder, SHADOWS.card]}>
          <View style={styles.statBox}>
            <Image style={styles.statIcon} source={StatWon} />
            <Text style={styles.statLabel}>Won</Text>
            <Text style={[styles.statValue, { color: COLORS.success }]}>{user.bet_won ?? 0}</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Image style={styles.statIcon} source={StatLost} />
            <Text style={styles.statLabel}>Lost</Text>
            <Text style={[styles.statValue, { color: COLORS.danger }]}>{user.bet_lost ?? 0}</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Image style={styles.statIcon} source={StatInPlay} />
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={[styles.statValue, { color: COLORS.secondary }]}>{user.bet_pending ?? 0}</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Image style={styles.statIcon} source={StatPosition} />
            <Text style={styles.statLabel}>Rank</Text>
            <Text style={[styles.statValue, { color: COLORS.warning }]}>#{user.position || "-"}</Text>
          </View>
        </View>
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
    justifyContent: "space-between",
    padding: SPACING.md,
    paddingTop: SPACING.lg,
  },
  linearGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  trophyIcon: {
    width: moderateScale(54),
    height: moderateScale(54),
    resizeMode: "contain",
  },
  userInfo: {
    marginLeft: SPACING.md,
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: "700",
    letterSpacing: 1,
  },
  userNameText: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textPrimary,
    fontWeight: "900",
  },
  statsHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.xs,
  },
  statDivider: {
    width: 1,
    height: "60%",
    backgroundColor: COLORS.cardBorder,
  },
  statIcon: {
    width: moderateScale(22),
    height: moderateScale(22),
    resizeMode: "contain",
    marginBottom: moderateScale(2),
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  statValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
    marginTop: moderateScale(2),
  },
});

export default HomeInfoBox;
