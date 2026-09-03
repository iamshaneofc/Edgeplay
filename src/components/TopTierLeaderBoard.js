import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image
} from "react-native";
import Gold from "../assets/Gold_Board.png";
import Silver from "../assets/Silver_Board.png";
import Bronze from "../assets/Bronze_Board.png";
import { moderateScale } from "react-native-size-matters";
import profilePhotos2 from "../assets/example_profile.jpg";
import Betcoin from '../assets/betcoin.png';
import numeral from "numeral";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../theme";

const Profile = ({ name, photos, rankColor }) => (
  <View style={styles.profileBox}>
    <Text style={[styles.profileName, { color: rankColor || COLORS.textPrimary }]} numberOfLines={1}>
      {name}
    </Text>
    <View style={[styles.avatarBorder, { borderColor: rankColor || COLORS.cardBorder }]}>
      <Image style={styles.avatar} source={photos} />
    </View>
  </View>
);

const TopTierLeaderBoard = ({ topData, weekly, monthly, alltime }) => {
  const renderCorrectCoins = (data) => {
    if (!data) return 0;
    if (weekly) return data.weekly_count;
    if (monthly) return data.monthly_count;
    if (alltime) return data.alltime_count;
    return 0;
  };

  if (!topData || topData.length < 3) return null;

  return (
    <View style={styles.container}>
      {/* 3rd Place (Bronze) */}
      <View style={styles.bronzePos}>
        <Text style={styles.coinBadgeText}>
          {numeral(renderCorrectCoins(topData[2])).format("0.0a")}
        </Text>
        <Image style={styles.coinMini} source={Betcoin} />
      </View>

      {/* 1st Place (Gold) */}
      <View style={styles.goldPos}>
        <Text style={styles.goldCoinText}>
          {numeral(renderCorrectCoins(topData[0])).format("0.0a")}
        </Text>
        <Image style={styles.coinMini} source={Betcoin} />
      </View>

      {/* 2nd Place (Silver) */}
      <View style={styles.silverPos}>
        <Text style={styles.coinBadgeText}>
          {numeral(renderCorrectCoins(topData[1])).format("0.0a")}
        </Text>
        <Image style={styles.coinMini} source={Betcoin} />
      </View>

      <View style={styles.rank3Avatar}>
        <Profile name={topData[2]?.user_name?.split(" ")[0] || "Rank 3"} photos={profilePhotos2} rankColor="#CD7F32" />
      </View>

      <View style={styles.rank2Avatar}>
        <Profile name={topData[1]?.user_name?.split(" ")[0] || "Rank 2"} photos={profilePhotos2} rankColor="#C0C0C0" />
      </View>

      <View style={styles.rank1Avatar}>
        <Profile name={topData[0]?.user_name?.split(" ")[0] || "Rank 1"} photos={profilePhotos2} rankColor="#FFD700" />
      </View>

      <View style={styles.leadersBoard}>
        <Image style={[styles.standImage, { marginRight: moderateScale(-30) }]} source={Bronze} />
        <Image style={[styles.standImage, { height: moderateScale(180), zIndex: 10 }]} source={Gold} />
        <Image style={[styles.standImage, { marginLeft: moderateScale(-30), height: moderateScale(130), zIndex: 5 }]} source={Silver} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  profileBox: {
    alignItems: "center",
  },
  profileName: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "800",
    marginBottom: moderateScale(2),
  },
  avatarBorder: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: RADIUS.round,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.cardBg,
  },
  avatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: RADIUS.round,
  },
  goldPos: {
    zIndex: 15,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: moderateScale(85),
    left: moderateScale(160),
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(2),
    borderRadius: RADIUS.round,
  },
  silverPos: {
    zIndex: 15,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: moderateScale(125),
    right: moderateScale(45),
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(2),
    borderRadius: RADIUS.round,
  },
  bronzePos: {
    zIndex: 15,
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: moderateScale(135),
    left: moderateScale(45),
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(2),
    borderRadius: RADIUS.round,
  },
  goldCoinText: {
    fontSize: FONT_SIZE.xs,
    color: "#FFD700",
    fontWeight: "800",
    marginRight: moderateScale(2),
  },
  coinBadgeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginRight: moderateScale(2),
  },
  coinMini: {
    width: moderateScale(14),
    height: moderateScale(14),
    resizeMode: "contain",
  },
  rank3Avatar: {
    position: "absolute",
    left: moderateScale(50),
    top: moderateScale(60),
  },
  rank2Avatar: {
    position: "absolute",
    right: moderateScale(45),
    top: moderateScale(55),
  },
  rank1Avatar: {
    position: "absolute",
    right: moderateScale(155),
    top: moderateScale(5),
  },
  leadersBoard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    paddingTop: moderateScale(50),
  },
  standImage: {
    resizeMode: "contain",
    width: moderateScale(140),
    height: moderateScale(125),
  },
});

export default TopTierLeaderBoard;
