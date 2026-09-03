import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import profilePhotos2 from "../assets/example_profile.jpg";
import Betcoin from "../assets/betcoin.png";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../theme";

const LeaderBoardSingle = ({ position, name, coins }) => {
  return (
    <View style={styles.container}>
      <View style={styles.userSection}>
        <Text style={styles.rankText}>#{position}</Text>
        <Image style={styles.avatar} source={profilePhotos2} />
        <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
      </View>
      <View style={styles.coinSection}>
        <Text style={styles.coinsText}>{coins}</Text>
        <Image style={styles.coinIcon} source={Betcoin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    width: "100%",
    flexDirection: "row",
    height: moderateScale(52),
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    marginVertical: moderateScale(2),
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rankText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontWeight: "800",
    width: moderateScale(30),
  },
  avatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: RADIUS.round,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  nameText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
    flex: 1,
  },
  coinSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinsText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
    marginRight: moderateScale(4),
  },
  coinIcon: {
    width: moderateScale(16),
    height: moderateScale(16),
    resizeMode: "contain",
  }
});

export default LeaderBoardSingle;
